import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, ValidateNested, isNotEmpty } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";
import { ITimeRangeBudgetList } from "../entities/budgetDetail.entity";

class TimeRangeBudget {
  @IsStringAndNotEmpty()
  name: string;

  @IsNumber()
  budget: number;
}

export class CreateTimeRangeBudgetDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startTime:Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  endTime:Date

  @Type(()=>TimeRangeBudget)
  @ValidateNested({ each: true })
  budgetList:ITimeRangeBudgetList[]
}
