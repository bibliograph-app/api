```bash
# Update lock.json
$ deno cache --import-map=./import_map.json --lock ./loader.lock.json --lock-write ./loader.ts

# Test
$ deno run --import-map ./import_map.json --allow-read --allow-net ./loader.ts --triples="./triples.yml" --mongoUri="mongodb://user:pass@127.0.0.1:27017/bookgraph?authSource=admin"
```
