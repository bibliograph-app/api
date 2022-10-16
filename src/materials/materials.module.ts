import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "nestjs-http-promise";

import { Material, MaterialSchema } from "./materials.model";
import { MaterialsResolver } from "./materials.resolver";
import { MaterialsService } from "./materials.service";

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Material.name, schema: MaterialSchema },
    ]),
  ],
  providers: [
    MaterialsResolver,
    MaterialsService,
  ],
  exports: [
    MaterialsService,
  ],
})
export class MaterialsModule {}
