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
    | { id: string; title: string }
  > {
    const material = await this.materialsModel
      .findOne(
        { uuid: id },
        { uuid: "$uuid", title: "$title" },
      )
      .exec()
      .then((v) =>
        v?.toJSON<{
          uuid: string;
          title: string;
        }>()
      );
    if (!material) return null;

    return {
      id: material.uuid,
      title: material.title,
    };
  }
}
