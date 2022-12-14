import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Author, AuthorSchema } from "./authors.model";
import { AuthorsResolver } from "./authors.resolver";
import { AuthorsService } from "./authors.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [
    AuthorsResolver,
    AuthorsService,
  ],
  exports: [
    AuthorsService,
  ],
})
export class AuthorsModule {}
