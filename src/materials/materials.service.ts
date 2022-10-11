import { Injectable } from "@nestjs/common";

@Injectable()
export class MaterialsService {
  async getMaterialById(id: string): Promise<
    | null
    | { id: string }
  > {
    return null;
  }
}
