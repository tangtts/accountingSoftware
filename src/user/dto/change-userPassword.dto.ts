import { IsNotEmpty, IsNumberString, IsString, Length, MinLength, min, minLength } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";


export class ChangeUserPasswordDto {
  @IsStringAndNotEmpty()
  oldPassword: string;

  @IsStringAndNotEmpty()
  newPassword: string;
 
}
