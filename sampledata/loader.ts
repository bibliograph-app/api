import { parse } from "std/encoding/yaml.ts";
import { resolve } from "std/path/mod.ts";
import { parse as parseArgs } from "std/flags/mod.ts";

const args = parseArgs(Deno.args);

const graphymlPath = resolve(Deno.cwd(), args.file);
const graphyml = await Deno.readTextFile(graphymlPath);
const graph = parse(graphyml);

console.dir(graph);
