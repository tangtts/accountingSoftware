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
  DefaultValuePipe,
  ParseEnumPipe,
} from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { CreateBudgetTimeType, CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { UserInfo } from "src/customDecorator";
import { CreateTimeRangeBudgetDto } from "./dto/create-TimeRangeBudget.dto";
import { UpdateTimeRangeBudgetDto } from "./dto/update-TimeRangeBudget.dto";
import * as dayjs from "dayjs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";


/**
 *
 * 根据年月日创建不同返回对应的开始结束时间
 * @param {CreateBudgetTimeType} createBudgetTimeType
 * @return {[number,number]} 
 */
function genTimestampByType(createBudgetTimeType: CreateBudgetTimeType) {
  let startTimestamp = 0;
  let endTimestamp = 0;
  if (createBudgetTimeType == CreateBudgetTimeType.DAY) {
    startTimestamp = dayjs().startOf('date').valueOf();
    endTimestamp = dayjs().endOf('date').valueOf();
  } else if (createBudgetTimeType == CreateBudgetTimeType.WEEK) {
    startTimestamp = dayjs().startOf('week').valueOf();
    endTimestamp = dayjs().endOf('week').valueOf();
  } else {
    startTimestamp = dayjs().startOf('month').valueOf();
    endTimestamp = dayjs().endOf('month').valueOf();
  }
  return [startTimestamp, endTimestamp]
}

@ApiTags("创建预算")
@Controller("budget")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @ApiOperation({ summary: "根据时间创建预算表" })
  @Post("/create")
  create(@UserInfo("uid") uid, @Body() createBudgetDto: CreateBudgetDto) {
    const [startTimestamp, endTimestamp] = genTimestampByType(createBudgetDto.createBudgetTimeType)
    return this.budgetService.create(uid, { startTimestamp, endTimestamp,budgetAmount: createBudgetDto.budgetAmount });
  }


  @ApiOperation({ summary: "修改预算表" })
  @Post("/update")
  update(@UserInfo("uid") uid, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(uid, updateBudgetDto);
  }

  @ApiOperation({ summary: "根据时间查找预算表" })
  @Get("/detailByType")
  detail(@UserInfo("uid") uid,
    @Query("type") type: number,
  ) {
    const [startTimestamp, endTimestamp] = genTimestampByType(type);
    return this.budgetService.findOne(uid, startTimestamp+'', endTimestamp+'');
  }

  // TODO 不知道用在了哪里，剩下的接口还没有对接
  @ApiOperation({ summary: "根据时间段创建预算表" })
  @Post("/createTimeRange")
  createTimeRange(@UserInfo("uid") uid, @Body() createTimeRangeBudgetDto: CreateTimeRangeBudgetDto) {
    return this.budgetService.createTimeRangeBudget(uid, createTimeRangeBudgetDto);
  }

  @Get("/timeRangeBudgetList") timeRangeBudgetList(@UserInfo("uid") uid, 
  @Query("type", new ParseEnumPipe(CreateBudgetTimeType)) type: number) {
    const [startTimestamp, endTimestamp] = genTimestampByType(type);
    return this.budgetService.getTimeRangeBudgetList(uid, startTimestamp,endTimestamp);
  }

  @Get("/getBudgetByDate")
  getBudgetByDate(@UserInfo("uid") uid, @Query('startTime', new DefaultValuePipe(new Date)) startTime, @Query('endTime', new DefaultValuePipe(new Date)) endTime) {
    return this.budgetService.getAllTimeRangeBudget(uid, startTime, endTime);
  }


  @Get("/getTimeRange")
  GetTimeRange(@UserInfo("uid") uid, @Query('startTime', new DefaultValuePipe(new Date)) startTime, @Query('endTime', new DefaultValuePipe(new Date)) endTime) {
    return this.budgetService.getAllTimeRangeBudget(uid, startTime, endTime);
  }

  @Post("/updateTimeRange")
  updateTimeRange(@UserInfo("uid") uid, @Body() updateTimeRangeBudgetDto: UpdateTimeRangeBudgetDto) {
    return this.budgetService.updateTimeRangeBudget(uid, updateTimeRangeBudgetDto);
  }
}
