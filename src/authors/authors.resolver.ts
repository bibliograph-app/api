import { Inject, NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { AuthorDto } from "./authors.dto";
import { AuthorsService } from "./authors.service";

@Resolver("Author")
export class AuthorsResolver {
  constructor(
    @Inject(AuthorsService) private readonly authors: AuthorsService,
  ) {}

  @Query("author")
  async getAuthor(@Args("id") id: string): Promise<AuthorDto> {
    const res = await this.authors.getAuthorById(id);
    if (!res) throw new NotFoundException(`Author not found. (id: ${id})`, "?");

    return res;
  }

  @ResolveField("name")
  resolveName(@Parent() dto: AuthorDto): string {
    return dto.names[0].name;
  }
}
