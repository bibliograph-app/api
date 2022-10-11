import { Inject, NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { MaterialDto } from "./materials.dto";
import { MaterialsService } from "./materials.service";

@Resolver("Material")
export class MaterialsResolver {
  constructor(
    @Inject(MaterialsService) private readonly materials: MaterialsService,
  ) {
  }

  @Query("material")
  async getMaterial(@Args("id") id: string): Promise<MaterialDto> {
    const material = await this.materials.getMaterialById(id);
    if (!material) throw new NotFoundException(`Material not found. (id: ${id})`, "?");

    return material;
  }
}
