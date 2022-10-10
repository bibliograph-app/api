{
  # main
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    deno2nix.url = "github:SnO2WMaN/deno2nix";
    corepack.url = "github:SnO2WMaN/corepack-flake";
  };

  # dev
  inputs = {
    yamlfmt.url = "github:SnO2WMaN/yamlfmt.nix";

    devshell.url = "github:numtide/devshell";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  } @ inputs:
    flake-utils.lib.eachSystem ["x86_64-linux"] (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = with inputs; [
            devshell.overlay
            deno2nix.overlays.default
            corepack.overlays.default
            (final: prev: {
              yamlfmt = yamlfmt.packages.${system}.yamlfmt;
            })
          ];
        };
      in {
        devShells.default = pkgs.devshell.mkShell {
          packages = with pkgs; [
            alejandra
            treefmt
            yamlfmt
            dprint
            deno
            (pkgs.callPackage ./sampledata {})
            nodejs
            (mkCorepack {
              nodejs = nodejs;
              pm = "pnpm";
            })
          ];
          commands = [
            {
              package = "treefmt";
              category = "formatter";
            }
          ];
        };
      }
    );
}
