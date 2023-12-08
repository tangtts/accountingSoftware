import { Type } from "class-transformer";
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, isNotEmpty } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class CreateBudgetDto {
  @IsStringAndNotEmpty()
  @Type(()=>String)
  year:string

  @IsStringAndNotEmpty()
  @Type(()=>String)
  @IsIn(['1','2',"3","4","5","6","7","8","9","10","11","12"])
  month:string

  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  budget:number
}
