import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsPhoneNumber, 
  IsString, Length, MinLength, min, minLength } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";


export class CreateUserDto {
  @ApiProperty({
    example:"zs"
  })
  @IsStringAndNotEmpty()
  username: string;

  @ApiProperty({
    example:"18623806694"
  })
  @IsPhoneNumber("CN")
  @Length(11)
  @IsNumberString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example:"123456"
  })
  @MinLength(6)
  @IsStringAndNotEmpty()
  password: string;

  @ApiProperty({
    example:"abcd"
  })
  @IsStringAndNotEmpty()
  capcha: string;
 
  @IsOptional()
  avatar:string
}
