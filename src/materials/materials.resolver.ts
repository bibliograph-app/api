import { Inject } from "@nestjs/common";
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
    return {
      id,
      title: "?",
    };

    /*
    const res = await this.feeds.getAuthorById(id);
    if (!res) throw new NotFoundException(`Author ${id} not found`);

    return {
      id: res.id,
      name: "?",
    };
    */
  }
}
