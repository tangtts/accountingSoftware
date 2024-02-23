import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';


class LoginUserDto1 {
  @IsString()
  name:string

  @IsNumber()
  age:number
}

class LoginUserDto2 {
  name:string

  @Exclude()
  age:number

  constructor(arg:any){
    Object.assign(this, arg);
  }
}

@ApiTags("测试")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  getHelloPost(@Body() dto:any): LoginUserDto2 {
    console.log(dto)
    let x = new LoginUserDto2({
      name:"zs",
      age:30
    })
    return x
  }
}
