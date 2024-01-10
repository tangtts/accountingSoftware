import { Transform, Type, plainToClass } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsNumberString, IsString, ValidateNested, isNotEmpty } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";
import { ITimeRangeBudgetList } from "../entities/budgetDetail.entity";
import { Budget } from 'src/budget/entities/budget.entity';

class TimeRangeBudget {
  @IsNumber()
  id: number;

  @IsStringAndNotEmpty()
  name: string;

  @Transform(({value})=>Number(value))
  @IsNumber()
  budget: number;
}

export class CreateTimeRangeBudgetDto {
  @IsNotEmpty()
  @IsNumber()
  startDateTimestamp: number

  @IsNotEmpty()
  @IsNumber()
  endDateTimestamp: number

  @Type(() => TimeRangeBudget)
  @ValidateNested({ each: true })
  budgetList: ITimeRangeBudgetList[]
}
