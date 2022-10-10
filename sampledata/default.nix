{
  pkgs,
  deno2nix,
  ...
}:
deno2nix.mkExecutable {
  pname = "loader.ts";
  version = "0.1.0";

  src = ./.;
  lockfile = ./lock.json;

  output = "sampledata-loader";
  entrypoint = "./loader.ts";
  importMap = "./import_map.json";

  additionalDenoFlags = "--allow-read";
}
