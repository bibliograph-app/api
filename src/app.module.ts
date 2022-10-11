import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { join } from "path";

import { AuthorsModule } from "./authors/authors.module";
import { MaterialsModule } from "./materials/materials.module";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://user:pass@127.0.0.1:27017/bookgraph?authSource=admin"),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      definitions: {
        path: join(process.cwd(), "src/graphql.types.ts"),
        outputAs: "interface",
        defaultScalarType: "unknown",
      },
    }),
    AuthorsModule,
    MaterialsModule,
  ],
})
export class AppModule {}
