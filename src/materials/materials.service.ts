import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Material } from "./materials.model";

@Injectable()
export class MaterialsService {
  constructor(
    @InjectModel(Material.name) private materialsModel: Model<Material>,
  ) {
  }

  async getMaterialById(id: string): Promise<
    | null
    | { id: string; title: string; isbn13: string | null }
  > {
    const material = await this.materialsModel
      .findOne(
        { uuid: id },
        { uuid: "$uuid", title: "$title", isbn13: "$isbn13" },
      )
      .exec()
      .then((v) =>
        v?.toJSON<{
          uuid: string;
          title: string;
          isbn13?: string;
        }>()
      );
    if (!material) return null;

    return {
      id: material.uuid,
      title: material.title,
      isbn13: material.isbn13 || null,
    };
  }

  async getReferencesById(
    id: string,
    { skip, limit }: { skip: number; limit: number },
  ): Promise<
    {
      material: { id: string; title: string };
    }[]
  > {
    const references = await this.materialsModel
      .aggregate<
        {
          material: {
            id: string;
            title: string;
          };
        }
      >([
        {
          $match: { uuid: id },
        },
        {
          $lookup: {
            from: "materials",
            localField: "references.id",
            foreignField: "_id",
            as: "references",
          },
        },
        {
          $unwind: {
            path: "$references",
          },
        },
        {
          $project: {
            "_id": 0,
            "material.id": "$references.uuid",
            "material.title": "$references.title",
            "material.isbn13": "$references.isbn13",
          },
        },
        {
          $sort: {
            "material.title": 1,
          },
        },
        {
          $limit: limit,
        },
        {
          $skip: skip,
        },
      ]);

    return references;
  }

  async getAuthorshipsById(
    id: string,
    { limit }: { limit: number | null },
  ): Promise<
    {
      author: { id: string; names: { name: string }[] };
      roles: string[];
    }[]
  > {
    const references = await this.materialsModel
      .aggregate<
        {
          author: { id: string; names: { name: string }[] };
          roles: string[];
        }
      >([
        {
          $match: { uuid: id },
        },
        {
          $unwind: {
            path: "$authorships",
          },
        },
        {
          $lookup: {
            from: "authors",
            localField: "authorships.id",
            foreignField: "_id",
            as: "authorships.author",
          },
        },
        {
          $unwind: {
            path: "$authorships.author",
          },
        },
        {
          $project: {
            "_id": 0,
            "author.id": "$authorships.author.uuid",
            "author.names": "$authorships.author.names",
            "roles": "$authorships.roles",
          },
        },
        ...limit ? [{ $limit: limit }] : [],
      ]);

    return references;
  }
}
