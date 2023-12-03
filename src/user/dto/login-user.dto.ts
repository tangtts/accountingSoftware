import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumberString, IsString, Length, MinLength, min, minLength } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";
import { PickType } from '@nestjs/mapped-types';


export class LoginUserDto 
extends PickType(CreateUserDto,['phoneNumber',"password"] as const)
{}

