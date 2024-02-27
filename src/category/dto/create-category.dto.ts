import { IsString } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class CreateCategoryDto {

  @IsStringAndNotEmpty()
  categoryName:string;
}
