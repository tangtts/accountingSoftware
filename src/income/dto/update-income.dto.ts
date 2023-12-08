import { PartialType } from '@nestjs/swagger';
import { CreateIncomeDto } from './create-income.dto';
import { IsNumber, IsString } from 'class-validator';
import { IsStringAndNotEmpty } from 'src/customDecorator';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {
  
  @IsNumber()
  id:number
}
