{
  pkgs,
  deno2nix,
  ...
}:
deno2nix.mkExecutable {
  pname = "sampledata-loader";
  version = "0.1.0";

  src = ./.;
  lockfile = ./loader.lock.json;

  output = "sampledata-loader";
  entrypoint = "./loader.ts";
  importMap = "./import_map.json";

  additionalDenoFlags = "--allow-read --allow-net";
}
