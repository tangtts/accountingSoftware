import { Type } from "class-transformer";
import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, MIN, Max, } from "class-validator";


export enum BudgetType { 
  DAY = 1,
  WEEK = 2,
  MONTH = 3
}

export class CreateBudgetDto {
  // @IsNotEmpty()
  // @Type(()=>Number)
  // @IsNumber()
  // year:number = new Date().getFullYear()

  // @IsNotEmpty()
  // @Type(()=>Number)
  // @IsNumber()
  // @Min(0)
  // @Max(12)
  // month:number = new Date().getMonth()

  @IsNotEmpty()
  @Type(()=>Number)
  // 分别代表日 周 月
  @IsIn([1,2,3])
  type:number = 1

  @IsNotEmpty()
  @IsNumber()
  @Type(()=>Number)
  budget:number = 0
}
