import { IsString } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class CreateCommonCategoryDto {

  @IsStringAndNotEmpty()
  name:string;

  @IsStringAndNotEmpty()
  value:string

}
