import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HttpService } from "nestjs-http-promise";

import { Material } from "./materials.model";

@Injectable()
export class MaterialsService {
  constructor(
    @Inject(HttpService) private readonly http: HttpService,
    @InjectModel(Material.name) private materialsModel: Model<Material>,
  ) {
  }

  async getBookcover(isbn13: string): Promise<string | null> {
    try {
      const url = new URL(`/isbn13/${isbn13}`, "http://127.0.0.1:8080/");
      const data = await this.http
        .get<string | null>(url.toString())
        .then((v) => v.data);
      return data;
    } catch (e) {
      console.dir(e);
      return null;
    }
  }

  async getAllMaterials(): Promise<
    { id: string; title: string; isbn13: string | null }[]
  > {
    const meterials = await this.materialsModel.find()
      .exec()
      .then((vs) => vs.map((v) => v.toJSON<{ uuid: string; title: string; isbn13?: string }>()));

    return meterials.map(({ title, uuid, isbn13 }) => ({
      id: uuid,
      title,
      isbn13: isbn13 || null,
    }));
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
      material: { id: string; title: string; isbn13: string | null };
    }[]
  > {
    const references = await this.materialsModel
      .aggregate<
        {
          material: {
            id: string;
            title: string;
            isbn13: string | null;
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
      authorId: string;
      materialId: string;
      roles: string[];
    }[]
  > {
    const references = await this.materialsModel
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
            "materialId": "$uuid",
            "authorId": "$authorships.author.uuid",
            "roles": "$authorships.roles",
          },
        },
        ...limit ? [{ $limit: limit }] : [],
      ]);

    return references;
  }
}
