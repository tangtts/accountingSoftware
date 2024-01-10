import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { IncomeService } from "./income.service";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { UpdateIncomeDto } from "./dto/update-income.dto";
import { IncomeOrCost, IncomeOrCostType } from "./entities/income.entity";
import { UserInfo } from "src/customDecorator";
import * as dayjs from "dayjs";
import { getStartAndEndTime } from "src/utils";

@Controller("income")
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post("/create")
  create(
    @UserInfo("uid") userId: number,
    @Body() createIncomeDto: CreateIncomeDto
  ) {
    return this.incomeService.create(userId, createIncomeDto);
  }

  @Post("/update")
  update(@Body() updateIncomeDto: UpdateIncomeDto) {
    return this.incomeService.update(updateIncomeDto);
  }

  @Get("/detail")
  detail(@Query("detailId",ParseIntPipe) detailId: number) {
    return this.incomeService.getDetail(detailId);
  }

  @Post("/all")
  getAllIncomeFromTime(
    @UserInfo("uid") userId: number,
    @Body("startTime") startTime: Date,
    @Body("endTime") endTime: Date,
    @Body("type") type: IncomeOrCostType
  ) {
    return this.incomeService.getAllIncomeFromTimeAndType(
      userId,
      startTime,
      endTime,
      type
    );
  }
  // 预算
  private getAmountTotal(data: Array<{ amount: string | number }>) {
    return data.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }

  private async getTimeIncomeOrCost(
    uid: number,
    startTime: Date,
    endTime: Date,
    type?: IncomeOrCostType // 不传是全部
  ) {
    return await this.incomeService.getAllIncomeFromTimeAndType(
      uid,
      startTime,
      endTime,
      type
    );
  }

  private filterIncomeByType(filterRecord:Array<IncomeOrCost>,type?:IncomeOrCostType) {
    if(type){
      return {
        [type == '0' ? 'cost' : 'income']: filterRecord.filter(({type:recodeType})=>recodeType == type)
      }
    }else {
      return {
       income: filterRecord.filter(({type:recodeType})=>recodeType == IncomeOrCostType.INCOME),
       cost: filterRecord.filter(({type:recodeType})=>recodeType == IncomeOrCostType.COST),
      }
    }
  }

  @Get("/getTimeRangeIncomeCost")
  async getCurrentDayIncome(@UserInfo("uid") uid: number) {
    const {
      startDay,
      endDay,
      startWeekDay,
      endWeekDay,
      startMonthDay,
      endMonthDay,
    } = getStartAndEndTime();

    let { income: dayIncome, cost: dayCost }  = this.filterIncomeByType(await this.getTimeIncomeOrCost(
      uid,
      new Date(startDay),
      new Date(endDay)
    ));

    let { income: weekIncome, cost: weekCost } = this.filterIncomeByType( await this.getTimeIncomeOrCost(
      uid,
      new Date(startWeekDay),
      new Date(endWeekDay)
    ));

    let { income: monthIncome, cost: monthCost } =
    this.filterIncomeByType( await this.getTimeIncomeOrCost(
        uid,
        new Date(startMonthDay),
        new Date(endMonthDay)
      ));

    return {
      day: {
        income: this.getAmountTotal(dayIncome),
        cost: this.getAmountTotal(dayCost),
      },
      week: {
        income: this.getAmountTotal(weekIncome),
        cost: this.getAmountTotal(weekCost),
      },
      month: {
        income: this.getAmountTotal(monthIncome),
        cost: this.getAmountTotal(monthCost),
      },
    };
  }
}