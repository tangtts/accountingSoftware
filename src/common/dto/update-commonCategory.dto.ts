import { PartialType } from '@nestjs/swagger';
import { IsStringAndNotEmpty } from 'src/customDecorator';
import {   CreateCommonCategoryDto
} from './create-commonCategory.dto';

export class UpdateCommonCategoryDto extends PartialType(CreateCommonCategoryDto) {
 
  @IsStringAndNotEmpty()
  id:string
}
