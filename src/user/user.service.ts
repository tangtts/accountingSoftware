import { LoginUserDto } from "./dto/login-user.dto";
import { RedisService } from "./../redis/redis.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { md5 } from "src/utils";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  // 使用写在这里就相当于 this 注入了
  constructor(
    private readonly redisService: RedisService,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 要判断 capcha 是否正确
    let r = await this.redisService.get(
      `register:code:${createUserDto.captcha}`
    );
    if (!r) {
      throw new HttpException("验证码失效", HttpStatus.BAD_REQUEST);
    }

    if (r !== createUserDto.captcha) {
      throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);
    }

    // 是否注册过
    if (await this.isExitUser(createUserDto.phoneNumber)) {
      throw new HttpException("该手机号已注册", HttpStatus.BAD_REQUEST);
    }

    // 密码加密
    createUserDto.password = md5(createUserDto.password);

    await this.userRepository.save(createUserDto);
    return "注册成功";
  }

  async login(loginUserDto: LoginUserDto) {
    loginUserDto.password = md5(loginUserDto.password);
    let user = await this.userRepository.findOneBy({
      phoneNumber: loginUserDto.phoneNumber,
      password: loginUserDto.password,
    });
    if (!user) {
      return new HttpException("账号密码不正确", HttpStatus.BAD_REQUEST);
    }
    // 生成token
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // true 说明存在有相同手机号的用户
  async isExitUser(phoneNumber) {
    return await this.userRepository.findOneBy({ phoneNumber });
  }
}
