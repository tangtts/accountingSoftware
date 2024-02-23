import { LoginUserDto } from "./dto/login-user.dto";
import { RedisService } from "./../redis/redis.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { encryptByMD5 } from "src/utils";
import { JwtService } from "@nestjs/jwt";
import { ChangeUserPasswordDto } from "./dto/change-userPassword.dto";
import { ConfigService } from "@nestjs/config";
import { ConfigEnum } from "src/config/config.enum";
@Injectable()
export class UserService {
  

  // 使用写在这里就相当于 this 注入了
  constructor(
    private readonly redisService: RedisService,
    private jwtService: JwtService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private  configService:ConfigService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const prefix = this.configService.get(ConfigEnum.REDIS_REGISTER_CODE,"registerCode")
    // 要判断 capcha 是否正确
    let r = await this.redisService.get(
      `${prefix}:${createUserDto.capcha.toLocaleLowerCase()}`
    );
    
    if (!r) {
      throw new HttpException("验证码失效", HttpStatus.BAD_REQUEST);
    }

    if (r !== createUserDto.capcha) {
      throw new HttpException("验证码不正确", HttpStatus.BAD_REQUEST);
    }

    // 是否注册过
    if (await this.checkUserExistByPhoneNumber(createUserDto.phoneNumber)) {
      throw new HttpException("该手机号已注册", HttpStatus.BAD_REQUEST);
    }

    // 密码加密
    createUserDto.password = encryptByMD5(createUserDto.password);

    await this.userRepository.save(createUserDto);
    return "success";
  }

  async login(loginUserDto: LoginUserDto) {
    loginUserDto.password = encryptByMD5(loginUserDto.password);
    let user = await this.userRepository.findOneBy({
      phoneNumber: loginUserDto.phoneNumber,
      password: loginUserDto.password,
    });

    if (!user) {
      return new HttpException("账号密码不正确", HttpStatus.BAD_REQUEST);
    }

    // 生成token
    const payload = { uid: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async changeUserPassword(
    uid: number,
    changeUserPasswordDto: ChangeUserPasswordDto
  ) {
    // 校验旧密码
    let { password } = await this.findUserById(uid);

    if (encryptByMD5(changeUserPasswordDto.oldPassword) !== password) {
      throw new HttpException("旧密码不正确", HttpStatus.BAD_REQUEST);
    }

    await this.userRepository.update(
      { id: uid },
      { password: encryptByMD5(changeUserPasswordDto.newPassword) }
    );
    return "success";
  }

  // true 说明存在有相同手机号的用户
  async checkUserExistByPhoneNumber(phoneNumber:string) {
    return await this.userRepository.findOneBy({ phoneNumber });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findUserWithBudgetById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        budgetRecord: true,
      },
    });
  }

  /** 查询用户和其账单分类 */
  async findUserWithCategroyById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        categories: true,
      },
    });
  }

   /** 查询用户和其消费记录 */
   async findUserWithConsumptionRecordById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        consumptionRecord: true,
      },
    });
  }

  /** 根据时间获取分类及其分类对应的预算 */
  async findUserWithTimeRangeById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        timeRangeBudgetRecord: true,
        budgetRecord: true,
        categories: true,
      },
    });
  }

  async save(user: User) {
    return await this.userRepository.save(user);
  }

  async getUserDetail(uid:number){
    return await this.userRepository.findOneBy({
      id:uid
    });
  }
  
  async updateUser(uid:number,updateUserDto:UpdateUserDto){
    console.log("🚀 ~ file: user.service.ts:154 ~ UserService ~ updateUser ~ updateUserDto:", updateUserDto);
     await this.userRepository.update(uid,updateUserDto);
     return "success"
  }
}
