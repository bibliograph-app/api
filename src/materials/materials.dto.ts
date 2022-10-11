import { Material } from "~/graphql.types";

export type MaterialDto = Omit<Material, "references">;
