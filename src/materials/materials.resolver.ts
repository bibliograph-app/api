import { BadRequestException, Inject, NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { AuthorshipDto, MaterialDto } from "./materials.dto";
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

  @Query("materials")
  async getMaterials(): Promise<MaterialDto[]> {
    const materials = await this.materials.getAllMaterials();
    return materials;
  }

  @ResolveField("cover")
  async cover(@Parent() parent: MaterialDto) {
    if (parent.isbn13) {
      const bookcover = await this.materials.getBookcover(parent.isbn13);
      return bookcover;
    }
    return null;
  }

  @ResolveField("references")
  async resolveReferences(
    @Parent() parent: MaterialDto,
    @Args("skip") skip: number,
    @Args("limit") limit: number,
  ): Promise<
    { material: MaterialDto }[]
  > {
    if (skip < 0) {
      throw new BadRequestException(
        `Arg \`skip\` in \`Material.references\` must be >= 0 (skip: ${skip})`,
      );
    }
    if (limit <= 0) {
      throw new BadRequestException(
        `Arg \`limit\` in \`Material.references\` must be > 0 (limit: ${limit})`,
      );
    }

    return this.materials.getReferencesById(parent.id, { skip, limit });
  }

  @ResolveField("authorships")
  async resolveAuthorships(
    @Parent() parent: MaterialDto,
    @Args("limit") limit?: number,
  ): Promise<{
    author: { id: string; names: { name: string }[] };
    roles: string[];
  }[]> {
    if (limit && limit <= 0) {
      throw new BadRequestException(
        `Arg \`limit\` in \`Material.authorship\` must be > 0 if specified (limit: ${limit})`,
      );
    }

    return this.materials.getAuthorshipsById(parent.id, { limit: limit || null });
  }

  @ResolveField("material")
  @Resolver("Authorship")
  async resolveAuthorshipMaterial(@Parent() parent: AuthorshipDto): Promise<MaterialDto> {
    return this.getMaterial(parent.materialId);
  }
}
