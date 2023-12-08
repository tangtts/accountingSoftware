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
} from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { UserInfo } from "src/customDecorator";
import { CreateTimeRangeBudgetDto } from "./dto/create-TimeRangeBudget.dto";
import { UpdateTimeRangeBudgetDto } from "./dto/update-TimeRangeBudget.dto";

@Controller("budget")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post("/create")
  create(@UserInfo("uid") uid, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(uid, createBudgetDto);
  }

  @Post("/createTimeRange")
  createTimeRange(@UserInfo("uid") uid, @Body() createTimeRangeBudgetDto: CreateTimeRangeBudgetDto) {
    return this.budgetService.createTimeRangeBudget(uid, createTimeRangeBudgetDto);
  }

  @Get("/timeRangeBudgetList") timeRangeBudgetList(@UserInfo("uid") uid,@Query("startTime") startTime,@Query("endTime") endTime){
    return this.budgetService.getTimeRangeBudgetList(uid,startTime,endTime);
  }

  @Get("/getTimeRange")
  GetTimeRange(@UserInfo("uid") uid,@Query('startTime',new DefaultValuePipe(new Date)) startTime,@Query('endTime',new DefaultValuePipe(new Date)) endTime){
    return this.budgetService.getAllTimeRangeBudget(uid,startTime,endTime);
  }

  @Get("/detail")
  detail(@UserInfo("uid") uid, @Query("year") year: string, @Query("month") month: string) {
    return this.budgetService.findOne(uid,year,month);
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
