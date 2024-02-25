import { IsNotEmpty, IsNumberString, IsString, Length, MinLength, min, minLength, MIN, Min } from "class-validator";
import { IsSameValue, IsStringAndNotEmpty } from "src/customDecorator";


export class ChangeUserPasswordDto {
  @MinLength(4)
  @IsStringAndNotEmpty()
  oldPassword: string;

  @IsSameValue("oldPassword",{
    message: "新旧密码相同",
  })
  @MinLength(4)
  @IsStringAndNotEmpty()
  newPassword: string;
}
