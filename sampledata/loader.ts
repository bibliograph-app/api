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
