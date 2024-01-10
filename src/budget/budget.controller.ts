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
import { BudgetType, CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { UserInfo } from "src/customDecorator";
import { CreateTimeRangeBudgetDto } from "./dto/create-TimeRangeBudget.dto";
import { UpdateTimeRangeBudgetDto } from "./dto/update-TimeRangeBudget.dto";
import * as dayjs from "dayjs";


function genTimestampByType(type: BudgetType) {
  let startTimestamp = 0;
  let endTimestamp = 0;
  if (type == BudgetType.DAY) {
    startTimestamp = dayjs().startOf('date').valueOf();
    endTimestamp = dayjs().endOf('date').valueOf();
  } else if (type == BudgetType.WEEK) {
    startTimestamp = dayjs().startOf('week').valueOf();
    endTimestamp = dayjs().endOf('week').valueOf();
  } else {
    startTimestamp = dayjs().startOf('month').valueOf();
    endTimestamp = dayjs().endOf('month').valueOf();
  }
  return [startTimestamp, endTimestamp]
}

@Controller("budget")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) { }

  @Post("/create")
  create(@UserInfo("uid") uid, @Body() createBudgetDto: CreateBudgetDto) {
    const [startTimestamp, endTimestamp] = genTimestampByType(createBudgetDto.type)
    return this.budgetService.create(uid, { startTimestamp, endTimestamp,budget: createBudgetDto.budget });
  }

  @Get("/detailByType")
  detail(@UserInfo("uid") uid,
    @Query("type", new ParseEnumPipe(BudgetType)) type: number,
  ) {
    const [startTimestamp, endTimestamp] = genTimestampByType(type);
    return this.budgetService.findOne(uid, startTimestamp+'', endTimestamp+'');
  }

  @Post("/createTimeRange")
  createTimeRange(@UserInfo("uid") uid, @Body() createTimeRangeBudgetDto: CreateTimeRangeBudgetDto) {
    return this.budgetService.createTimeRangeBudget(uid, createTimeRangeBudgetDto);
  }

  @Get("/timeRangeBudgetList") timeRangeBudgetList(@UserInfo("uid") uid, 
  @Query("type", new ParseEnumPipe(BudgetType)) type: number) {
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



  @Post("/update")
  update(@UserInfo("uid") uid, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(updateBudgetDto);
  }

  @Post("/updateTimeRange")
  updateTimeRange(@UserInfo("uid") uid, @Body() updateTimeRangeBudgetDto: UpdateTimeRangeBudgetDto) {
    return this.budgetService.updateTimeRangeBudget(uid, updateTimeRangeBudgetDto);
  }
}
