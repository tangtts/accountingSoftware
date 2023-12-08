import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsStringAndNotEmpty } from 'src/customDecorator';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {

  @IsNotEmpty()
  @IsNumber()
  id:number
}
