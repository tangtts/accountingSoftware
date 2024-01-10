import { UserService } from "./../user/user.service";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { IncomeOrCost, IncomeOrCostType } from "./entities/income.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class IncomeService {
  @InjectRepository(IncomeOrCost)
  incomeOrCost: Repository<IncomeOrCost>;

  @InjectRepository(User)
  user: Repository<User>;

  @Inject()
  userService: UserService;

  async create(userId: number, createIncomeDto: CreateIncomeDto) {
    let user = await this.userService.findUserById(userId);

    if (!user) {
      throw new HttpException("用户不存在", HttpStatus.BAD_REQUEST);
    }

    await this.incomeOrCost.save({
      ...createIncomeDto,
      // 关联消费用户
      consumptionUser: user,
    });

    return "success";
  }

  async update(updateIncomeDto: UpdateIncomeDto) {
    let r = await this.findOneIncomeOrCostById(updateIncomeDto.id);
    if (!r) {
      throw new HttpException("请确认是否有此消费或者支出记录!", HttpStatus.BAD_REQUEST);
    }

    let picUrlsString = updateIncomeDto.picUrls.join(",");
    
    await this.incomeOrCost.save({
      ...updateIncomeDto,
      picUrlsString
    });
    return "success";
  }

  async getDetail(id: number) {
    let r = await this.incomeOrCost.findOneBy({
      id,
    });
    let picUrls = r.picUrlsString?.split(",");
    delete r.picUrlsString
    return {
      ...r,
      picUrls
    };
  }

  async getAllIncomeFromTimeAndType(
    userId: number,
    startTime: Date,
    endTime: Date,
    type?: IncomeOrCostType // 可以不传,不传是全部
  ) {
    // 获取支付的用户
    const consumptionUser = await this.userService.findUserWithConsumptionRecordById(userId);

    // endTime >  payTime > startTime 
   let filterRecord =  consumptionUser.consumptionRecord.filter(({payTime})=>{
      return payTime.getTime()>=startTime.getTime() && payTime.getTime()<=endTime.getTime()
    });

    if(type){
      return filterRecord.filter(({type:recodeType})=>recodeType == type)
    }else {
      return filterRecord
    }
  }

  private findOneIncomeOrCostById(id: number) {
    return this.incomeOrCost.findOneBy({ id });
  }
}
