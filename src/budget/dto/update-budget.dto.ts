import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsNotEmpty, IsNumber, IsNumberString, isNumberString, IsString } from 'class-validator';
import { IsStringAndNotEmpty } from 'src/customDecorator';
import { Type } from 'class-transformer';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {

  @Type(()=>Number)
  @IsNumber()
  @IsNotEmpty()
  id:number
}
