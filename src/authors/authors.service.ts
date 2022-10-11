import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Author } from "./authors.model";

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name) private auhtorModel: Model<Author>,
  ) {
  }

  async getAuthorById(id: string): Promise<
    | null
    | { id: string; names: { name: string }[] }
  > {
    const author = await this.auhtorModel
      .findOne(
        { uuid: id },
        { uuid: "$uuid", names: "$names" },
      )
      .exec()
      .then((v) =>
        v?.toJSON<{
          uuid: string;
          names: { name: string }[];
        }>()
      );
    if (!author) return null;

    return {
      id: author.uuid,
      names: author.names,
      // names: author.names,
    };
  }
}
