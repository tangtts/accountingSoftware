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
  Inject,
} from "@nestjs/common";
import { IncomeOrExpensesService } from "./incomeOrExpenses.service";
import { CreateIncomeOrExpensesDto } from "./dto/create-incomeOrExpenses.dto";
import { UpdateIncomeOrExpensesDto } from "./dto/update-incomeOrExpenses.dto";
import {
  IncomeOrExpenses,
  IncomeOrExpensesType,
} from "./entities/incomeOrExpenses.entity";
import { UserInfo } from "src/customDecorator";
import * as dayjs from "dayjs";
import { getStartAndEndDate } from "src/utils";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { isEmpty } from "class-validator";

@ApiTags("记一笔")
@Controller("incomeOrExpenses")
export class IncomeController {
  constructor(
    private readonly incomeOrExpensesService: IncomeOrExpensesService,
  ) { }

  @ApiOperation({ summary: "创建收入/支出" })
  @Post("/create")
  create(
    @UserInfo("uid") userId: number,
    @Body() createIncomeDto: CreateIncomeOrExpensesDto
  ) {
    return this.incomeOrExpensesService.create(userId, createIncomeDto);
  }

  @ApiOperation({ summary: "更新收入/支出" })
  @Post("/update")
  update(@Body() updateIncomeDto: UpdateIncomeOrExpensesDto) {
    return this.incomeOrExpensesService.update(updateIncomeDto);
  }

  @ApiOperation({ summary: "获取所有收入/支出类型" })
  @Post("/all")
  async getAllIncomeFromTime(
    @UserInfo("uid") userId: number,
    @Body("startTime") startTime: Date,
    @Body("endTime") endTime: Date,
    @Body("incomeOrExpensesType") incomeOrExpensesType: IncomeOrExpensesType
  ) {
    return this.getTimeIncomeOrExpenses(userId,
      startTime,
      endTime,
      incomeOrExpensesType)
  }

  @ApiOperation({ summary: "获取单个收入/支出详情" })
  @Get("/detail")
  detail(@Query("detailId", ParseIntPipe) detailId: number) {
    return this.incomeOrExpensesService.getDetail(detailId);
  }

  // 预算
  private getAmountTotal(data: Array<{ amount: string | number }>) {
    if (isEmpty(data)) return 0;
    return data.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }

  private async getTimeIncomeOrExpenses(
    uid: number,
    startTime: Date,
    endTime: Date,
    incomeOrExpensesType?: IncomeOrExpensesType // 不传是全部
  ) {
    let result =  await this.incomeOrExpensesService.getListFromTimeAndType(
      uid,
      startTime,
      endTime,
      incomeOrExpensesType
    ) as Array<IncomeOrExpenses>;

    if(result.length !== 0){
      result = result.map(item => {
        return {
          ...item,
          picUrls:item.picUrlsString ? item.picUrlsString.split(",") : [],
        }
      })
    } 
    return result
  }

  /**
   *
   *
   * @private
   * @param {Array<IncomeOrExpenses>} filterRecord
   * @param {IncomeOrExpensesType} [type]
   * @return { Array<IncomeOrExpenses> | {expenses: IncomeOrExpenses[], income: IncomeOrExpenses[]}}
   * @memberof IncomeController
   */
  private filterIncomeByType(
    filterRecord: Array<IncomeOrExpenses>,
    type?: IncomeOrExpensesType
  ) {
    if (!filterRecord) return ({ income: [], expense: [] })

    if (type) {
      return {
        [type == IncomeOrExpensesType.EXPENSES ? "expenses" : "income"]:
          filterRecord.filter( 
            ({ incomeOrExpensesType }) => incomeOrExpensesType == type
          ),
      };
    } else {
      return {
        income: filterRecord.filter(
          ({ incomeOrExpensesType }) =>
            incomeOrExpensesType == IncomeOrExpensesType.INCOME
        ),
        expenses: filterRecord.filter(
          ({ incomeOrExpensesType }) =>
            incomeOrExpensesType == IncomeOrExpensesType.EXPENSES
        ),
      };
    }
  }

  @ApiOperation({ summary: "根据时间段查询" })
  @Get("/getTimeRangeIncomeCost")
  async getCurrentDayIncome(@UserInfo("uid") uid: number) {
    const {
      startDay,
      endDay,
      startWeekDay,
      endWeekDay,
      startMonthDay,
      endMonthDay,
    } = getStartAndEndDate();
    let { income: dayIncome, expenses: dayCost } = this.filterIncomeByType(
      await this.getTimeIncomeOrExpenses(uid, new Date(startDay), new Date(endDay))
    );

    let { income: weekIncome, expenses: weekCost } = this.filterIncomeByType(
      await this.getTimeIncomeOrExpenses(
        uid,
        new Date(startWeekDay),
        new Date(endWeekDay)
      )
    );

    let { income: monthIncome, expenses: monthCost } = this.filterIncomeByType(
      await this.getTimeIncomeOrExpenses(
        uid,
        new Date(startMonthDay),
        new Date(endMonthDay)
      )
    );

    return {
      day: {
        income: this.getAmountTotal(dayIncome),
        expenses: this.getAmountTotal(dayCost),
      },
      week: {
        income: this.getAmountTotal(weekIncome),
        expenses: this.getAmountTotal(weekCost),
      },
      month: {
        income: this.getAmountTotal(monthIncome),
        expenses: this.getAmountTotal(monthCost),
      },
    };
  }
}
