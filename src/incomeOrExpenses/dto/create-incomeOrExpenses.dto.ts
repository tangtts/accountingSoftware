import { IncomeOrExpensesService } from "../incomeOrExpenses.service";
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
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";
import {
  IncomeOrExpensesType,
  IncomeOrExpensesPatternType,
} from "../entities/incomeOrExpenses.entity";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateIncomeOrExpensesDto {

  @ApiProperty({
    enum: IncomeOrExpensesType,
    enumName: "IncomeOrExpensesType",
    description: "收入支出类型",
    example: IncomeOrExpensesType.EXPENSES,
  })
  @IsEnum(IncomeOrExpensesType)
  @Type(() => String)
  incomeOrExpensesType: IncomeOrExpensesType; // 消费类型

  @ApiProperty({
    description: "收入支出数量",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  // undefined 可以满足 isOptional
  @ArrayMinSize(0)
  @ValidateIf(o => o.picUrls && o.picUrls.length > 0)
  @IsUrl({}, { each: true })
  picUrls: Array<string>;

  @ApiProperty({
    description: "收入支出类型",
    example: "1",
  })
  @IsStringAndNotEmpty()
  categoryType: string;

  @ApiProperty({
    enum: IncomeOrExpensesPatternType,
    enumName: "PayType",
    description: "收入消费方式",
    example: IncomeOrExpensesPatternType.ALIPay,
  })
  @IsEnum(IncomeOrExpensesPatternType)
  @Type(() => Number) // 支付方式
  incomeOrExpensesPatternType: IncomeOrExpensesPatternType;

  @ApiProperty({
    description: "收入支出时间",
    example: new Date(),
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  incomeOrExpensesTime: Date;

  @ApiProperty({
    description: "收入支出备注",
    example: "",
  })
  @IsString()
  @IsOptional()
  remark: string;


}
