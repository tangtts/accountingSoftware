import { PartialType } from "@nestjs/mapped-types";
import { TimeRangeBudget } from "../entities/budgetDetail.entity";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateTimeRangeBudgetDto } from "./create-TimeRangeBudget.dto";

export class UpdateTimeRangeBudgetDto extends PartialType(CreateTimeRangeBudgetDto) {

  @IsNotEmpty()
  @IsNumber()
  id:number
}