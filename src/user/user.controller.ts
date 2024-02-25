import { RedisService } from "./../redis/redis.service";
import { GenCaptchaService } from "src/toolsServer/genCaptcha.service";
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
import { LoginUserDto } from "./dto/login-user.dto";
import { PublicApi, RequireLogin, UserInfo } from "src/customDecorator";
import { ChangeUserPasswordDto } from "./dto/change-userPassword.dto";
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { ConfigEnum } from "src/config/config.enum";

@ApiTags("用户模块")
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly genCaptchaService: GenCaptchaService,
    private readonly redisService: RedisService,
    private  configService:ConfigService
  ) {}

  @ApiOperation({ summary: '注册' })
  @PublicApi()
  @Post("register")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '登录' })
  @PublicApi()
  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: '生成验证码' })
  @Get("capcha")
  @PublicApi()
  createCapcha(@Res() res) {
    let { text, data } = this.genCaptchaService.captcha();
    const prefix = this.configService.get(ConfigEnum.REDIS_REGISTER_CODE,"registerCode");
    
    this.redisService.set(
      `${prefix}:${text.toLocaleLowerCase()}`,
      text.toLocaleLowerCase(),
      1000
    );
    res.type("image/svg+xml");
    res.send(data);
  }

  @ApiOperation({ summary: '修改密码' })
  @Post("changePassword")
  changePassword(
    @UserInfo("uid") uid,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto
  ) {
    return this.userService.changeUserPassword(uid, changeUserPasswordDto);
  }

  @ApiOperation({ summary: '用户详细信息' })
  @Get("detail")
  userDetail(@UserInfo("uid") uid) {
    return this.userService.getUserDetail(uid);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @Post("update")
  updateUser(@UserInfo("uid") uid,@Body() updateUserDto:UpdateUserDto) {
    return this.userService.updateUser(uid,updateUserDto);
  }
}
