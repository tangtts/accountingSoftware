import { UserService } from "../user/user.service";
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateIncomeOrExpensesDto } from "./dto/create-incomeOrExpenses.dto";
import { UpdateIncomeOrExpensesDto } from "./dto/update-incomeOrExpenses.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import {
  IncomeOrExpenses,
  IncomeOrExpensesType,
} from "./entities/incomeOrExpenses.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class IncomeOrExpensesService {
  @InjectRepository(IncomeOrExpenses)
  incomeOrExpensesRepository: Repository<IncomeOrExpenses>;

  @InjectRepository(User)
  userRepository: Repository<User>;

  @Inject()
  userService: UserService;

  async create(
    userId: number,
    createIncomeOrExpensesDto: CreateIncomeOrExpensesDto
  ) {
    let user = await this.userService.findUserById(userId);

    if (!user) {
      throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
    }

    await this.incomeOrExpensesRepository.save({
      ...createIncomeOrExpensesDto,
      // 关联消费用户
      incomeOrExpensesUser: user,
    });

    return "success";
  }

  async update(updateIncomeDto: UpdateIncomeOrExpensesDto) {
    let oldRecord = await this.incomeOrExpensesRepository.findOneBy({id:updateIncomeDto.id});

    if (!oldRecord) {
      throw new HttpException(
        "请确认是否有此消费或者支出记录!",
        HttpStatus.BAD_REQUEST
      );
    }

    let picUrlsString = updateIncomeDto.picUrls.join(",");

    await this.incomeOrExpensesRepository.save({
      updateIncomeDto,
      picUrlsString,
    });

    return "success";
  }

  async getDetail(id: number) {
    let r = await this.incomeOrExpensesRepository.findOneBy({
      id,
    });

    if(!r){
      throw new BadRequestException("不存在此订单信息！")
    }

    let picUrls = r.picUrlsString?.split(",");
    delete r.picUrlsString;
    return {
      ...r,
      picUrls,
    };
  }

  async getListFromTimeAndType(
    userId: number,
    startTime?: Date,
    endTime?: Date,
    incomeOrExpensesType?: IncomeOrExpensesType // 可以不传,不传是全部
  ) {
    // TODO 添加了 username，不添加 select 会带上整个 user 类
    const queryBuilder = this.userRepository
      .createQueryBuilder("user").select("user.username")
      .leftJoinAndSelect("user.incomeOrExpensesRecord", "u")
      .where("u.id = :userId", { userId });

    if (incomeOrExpensesType) {
      queryBuilder.andWhere("u.incomeOrExpensesType = :incomeOrExpensesType", {
        incomeOrExpensesType,
      });
    }

    if (startTime) {
      // 大于startTime
      queryBuilder.andWhere("u.createdTime >= :startTime", { startTime });
    }

    if (endTime) {
      queryBuilder.andWhere("u.createdTime <= :endTime", { endTime });
    }

    return await queryBuilder.getOne();
  }
}
