import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MinLength, min, minLength } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";


export class CreateUserDto {
  @IsStringAndNotEmpty()
  username: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(11)
  phoneNumber: string;

  @IsStringAndNotEmpty()
  @MinLength(6)
  password: string;

  @IsStringAndNotEmpty()
  capcha: string;

  @IsOptional()
  avatar:string
}
