import { MongoClient } from "mongo/mod.ts";
import { parse } from "std/encoding/yaml.ts";
import { parse as parseArgs } from "std/flags/mod.ts";
import { resolve } from "std/path/mod.ts";
import { v4 } from "std/uuid/mod.ts";

const parsedArgs = parseArgs(Deno.args);
const triplesYmlPath = resolve(Deno.cwd(), parsedArgs.triples);
const triplesYml = await Deno.readTextFile(triplesYmlPath);
const triples = parse(
  triplesYml,
) as (
  | { from: string; to: string; rel: { label: "NAME" } }
  | { from: string; to: string; rel: { label: "AUTHOR" } }
  | { from: string; to: string; rel: { label: "TITLE" } }
  | { from: string; to: string; rel: { label: "REFERENCE" } }
  | { from: string; to: string; rel: { label: "ISBN13" } }
)[];
const filteredTriples = triples
  .filter(({ rel, from, to }) => {
    switch (rel.label) {
      case "NAME":
        return (typeof from === "string" && !v4.validate(from)) &&
          (typeof to === "string" && v4.validate(to));
      case "TITLE":
        return (typeof from === "string" && !v4.validate(from)) &&
          (typeof to === "string" && v4.validate(to));
      case "AUTHOR":
        return (typeof from === "string" && v4.validate(from)) &&
          (typeof to === "string" && v4.validate(to));
      case "REFERENCE":
        return (typeof from === "string" && v4.validate(from)) &&
          (typeof to === "string" && v4.validate(to));
    }
  })
  .map(({ from, to, rel }) => ({ from, to, rel }));

const mc = new MongoClient();
await mc.connect(
  parsedArgs.mongoUri,
  // "mongodb://user:pass@127.0.0.1:27017/bookgraph?authSource=admin",
);
const db = mc.database();

const collTriple = db.collection("triples");
await collTriple.deleteMany({});
await collTriple.insertMany(filteredTriples);

const collAuthors = db.collection("authors");
const collMaterials = db.collection("materials");
await collAuthors.deleteMany({});
await collMaterials.deleteMany({});

await Promise.all(
  triples.filter(({ rel }) => rel.label === "NAME").map(
    async ({ from, to, rel }) => {
      await collAuthors.updateOne(
        { uuid: to },
        { $addToSet: { names: { name: from } } },
        { upsert: true },
      );
    },
  ),
);

await Promise.all(
  triples.filter(({ rel }) => rel.label === "TITLE").map(
    async ({ from, to, rel }) => {
      await collMaterials.updateOne(
        { uuid: to },
        { $set: { title: from } },
        { upsert: true },
      );
    },
  ),
);
await Promise.all(
  triples.filter(({ rel }) => rel.label === "ISBN13").map(
    async ({ from, to, rel }) => {
      await collMaterials.updateOne(
        { uuid: to },
        { $set: { isbn13: from } },
      );
    },
  ),
);
await Promise.all(
  triples.filter(({ rel }) => rel.label === "AUTHOR").map(
    async ({ from, to, rel }) => {
      const author = await collAuthors.findOne({ uuid: to });
      if (!author) return;
      await collMaterials.updateOne(
        { uuid: from },
        { $addToSet: { authors: { id: author._id } } },
      );
    },
  ),
);
await Promise.all(
  triples.filter(({ rel }) => rel.label === "REFERENCE").map(
    async ({ from, to, rel }) => {
      const referenced = await collMaterials.findOne({ uuid: to });
      if (!referenced) return;
      await collMaterials.updateOne(
        { uuid: from },
        { $addToSet: { references: { id: referenced._id } } },
      );
    },
  ),
);
