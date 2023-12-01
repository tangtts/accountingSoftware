import { applyDecorators } from '@nestjs/common';
import { IsEmpty, IsString,IsNotEmpty } from 'class-validator';
// 合并装饰器

export function IsStringAndNotEmpty(){
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
  )
}