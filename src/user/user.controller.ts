import { RedisService } from './../redis/redis.service';
import { GenCaptchaService } from 'src/toolsServer/genCaptcha.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Response,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from './dto/login-user.dto';

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly genCaptchaService:GenCaptchaService,
    private readonly redisService:RedisService
    ) {}

  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get("captcha")
  createCapcha(@Res() res){
    let { text, data } =  this.genCaptchaService.captcha();
    this.redisService.set(`register:code:${text}`,text,1000)
    res.type('image/svg+xml');
    res.send(data)
  }
}
