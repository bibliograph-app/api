import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "materials" })
export class Material {
  @Prop({ type: String, index: {} })
  uuid!: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
