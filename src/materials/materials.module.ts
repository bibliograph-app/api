import { Module } from "@nestjs/common";

import { MaterialsResolver } from "./materials.resolver";
import { MaterialsService } from "./materials.service";

@Module({
  imports: [],
  providers: [
    MaterialsResolver,
    MaterialsService,
  ],
  exports: [
    MaterialsService,
  ],
})
export class MaterialsModule {}
