import { PartialType } from '@nestjs/swagger';
import { IsStringAndNotEmpty } from 'src/customDecorator';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
 
  @IsNumber()
  @IsNotEmpty()
  id:number
}
