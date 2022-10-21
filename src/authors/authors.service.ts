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

  async getAuthorshipsById(
    id: string,
    { skip, limit }: { skip: number; limit: number },
  ): Promise<{ authorId: string; materialId: string; roles: string[] }[]> {
    const authorships = await this.auhtorModel
      .aggregate<
        {
          authorId: string;
          materialId: string;
          roles: string[];
        }
      >([
        {
          $match: { uuid: id },
        },
        {
          $lookup: {
            from: "materials",
            localField: "_id",
            foreignField: "authorships.id",
            as: "materials",
          },
        },
        {
          $unwind: {
            path: "$materials",
          },
        },
        {
          $unwind: {
            path: "$materials.authorships",
          },
        },
        {
          $project: {
            "_id": 0,
            "authorId": "$uuid",
            "materialId": "$materials.uuid",
            "roles": "$materials.authorships.roles",
          },
        },
        { $limit: limit },
        { $skip: skip },
      ]);

    return authorships;
  }
}
