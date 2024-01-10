import { IncomeService } from "./../income.service";
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";
import { IncomeOrCostType, PayType } from "../entities/income.entity";
import { Type, Transform } from "class-transformer";

export class CreateIncomeDto {
  constructor() {}

  @IsEnum(IncomeOrCostType)
  @Type(() => String)
  type: IncomeOrCostType; // 消费类型

  @IsStringAndNotEmpty()
  amount: string;

  // undefined 可以满足 isOptional
  @IsOptional()
  @IsUrl(undefined, { each: true })
  picUrls: Array<string>;

  @IsStringAndNotEmpty()
  categoryType:string

  @IsEnum(PayType)
  @Type(() => Number) // 支付方式
  payType: PayType;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  payTime: Date;

  @IsString()
  @IsOptional()
  remark: string;
}
