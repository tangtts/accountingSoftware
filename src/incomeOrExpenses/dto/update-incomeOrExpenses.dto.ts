import { PartialType } from '@nestjs/swagger';
import { CreateIncomeOrExpensesDto } from './create-incomeOrExpenses.dto';
import { IsNumber, IsString } from 'class-validator';
import { IsStringAndNotEmpty } from 'src/customDecorator';

export class UpdateIncomeOrExpensesDto extends PartialType(CreateIncomeOrExpensesDto) {
  
  @IsNumber()
  id:number
}
