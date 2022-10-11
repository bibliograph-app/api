import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "authors" })
export class Author {
  @Prop({ type: String, index: {} })
  uuid!: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
