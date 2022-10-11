## Setup

```bash
$ nix run ".#sampledata" -- --triples="./sampledata/triples.yml" --mongoUri="mongodb://user:pass@127.0.0.1:27017/bookgraph?authSource=admin"
```
