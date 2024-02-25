import { Type } from "class-transformer";
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, MIN, Max, Min, } from "class-validator";


export enum CreateBudgetTimeType { 
  DAY = 1,
  WEEK = 2,
  MONTH = 3
}

export class CreateBudgetDto {

  @IsNotEmpty()
  @Type(()=>Number)
  // 分别代表日 周 月
  @IsIn([1,2,3])
  createBudgetTimeType:number = 1

  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  @Min(0)
  budgetAmount:number = 0
}
