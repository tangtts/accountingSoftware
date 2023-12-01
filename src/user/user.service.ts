import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async create(createUserDto: CreateUserDto) {
    // 要判断 capcha 是否正确
    // 是否注册过
    if (await this.isExitUser(createUserDto.phoneNumber)) {
      throw new HttpException("该手机号已注册", HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.save(createUserDto);
    return "注册成功";
  }

  // true 说明存在有相同手机号的用户
  async isExitUser(phoneNumber) {
    return await this.userRepository.findOneBy({ phoneNumber });
  }
}
