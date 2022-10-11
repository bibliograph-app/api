import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

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

  @ResolveField("references")
  async getReferences(
    @Parent() parent: MaterialDto,
    @Args("skip") skip: number,
    @Args("limit") limit: number,
  ): Promise<
    { material: { id: string; title: string } }[]
  > {
    if (skip < 0) throw new BadRequestException(`Arg "skip" must be >= 0 (skip: ${skip})`);
    if (limit <= 0) throw new BadRequestException(`Arg "limit" must be > 0 (limit: ${limit})`);

    return this.materials.getReferencesById(parent.id, { skip, limit });
  }
}
