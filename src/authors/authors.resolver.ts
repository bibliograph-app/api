import { Inject, NotFoundException } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { AuthorshipDto } from "~/materials/materials.dto";

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

  @Query("authors")
  async getAuthors(): Promise<AuthorDto[]> {
    const authors = await this.authors.getAllAuthors();
    return authors;
  }

  @ResolveField("name")
  resolveName(@Parent() dto: AuthorDto): string {
    return dto.names[0].value;
  }

  @ResolveField("authorships")
  resolveAuthorships(
    @Parent() parent: AuthorDto,
    @Args("skip") skip: number,
    @Args("limit") limit: number,
  ): Promise<AuthorshipDto[]> {
    return this.authors.getAuthorshipsById(parent.id, { skip, limit });
  }

  @ResolveField("author")
  @Resolver("Authorship")
  async resolveAuthorshipAuthor(@Parent() parent: AuthorshipDto): Promise<AuthorDto> {
    return this.getAuthor(parent.authorId);
  }
}
