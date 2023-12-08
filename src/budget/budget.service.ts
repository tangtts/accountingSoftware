import { UserService } from "./../user/user.service";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { CreateTimeRangeBudgetDto } from "./dto/create-TimeRangeBudget.dto";
import { TimeRangeBudget } from "./entities/budgetDetail.entity";
import { UpdateTimeRangeBudgetDto } from "./dto/update-TimeRangeBudget.dto";
import * as dayjs from "dayjs";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

@Injectable()
export class BudgetService {
  @Inject()
  userService: UserService;

  @InjectRepository(Budget)
  private readonly budget: Repository<Budget>;

  @InjectRepository(TimeRangeBudget)
  private readonly timeRangeBudgetRepo: Repository<TimeRangeBudget>;

  async create(uid: number, createBudgetDto: CreateBudgetDto) {
    let user = await this.userService.findUserWithBudgetById(uid);

    const existBudget = user.budgetRecord.find(
      item =>
        item.year == createBudgetDto.year && item.month == createBudgetDto.month
    );
    // 如果存在旧的，就更新
    if (existBudget) {
      return this.update({ id: existBudget.id, ...createBudgetDto });
    }

    await this.budget.save({
      userBudget: user,
      ...createBudgetDto,
    });
    return "succes";
  }

  async getTimeRangeBudgetList(uid: number,startTime:Date,endTime:Date) {
    // 找到所有的分类
    let { timeRangeBudgetRecord, categories } =
      await this.userService.findUserWithTimeRangeById(uid);

    let cloneCategories = [ ...categories ];

    const filterTimeRangeBudgetRecord = timeRangeBudgetRecord.filter(record=>{
     return startTime.getTime() < record.startTime.getTime() && record.endTime.getTime() < endTime.getTime()
    })

    return cloneCategories.map(category => {
      // 在 budgetList 寻找是否存在
      const existBudget = filterTimeRangeBudgetRecord
        .flatMap(category => category.budgetList)
        .find(budget => category.name === budget.name);

      if (existBudget) {
        return {
          budget: String(existBudget.budget),
          name: existBudget.name,
        };
      } else {
        return {
          budget: "0",
          name: category.name,
        };
      }
    });
  }

  async createTimeRangeBudget(
    uid: number,
    createBudgetDto: CreateTimeRangeBudgetDto
  ) {
    // 找到所有的分类
    let user = await this.userService.findUserWithCategroyById(uid);

    let categories = user.categories as any;

    let mergeCategories = categories.map(item => {
      // 找到相同名称的数据
      let existBudget = createBudgetDto.budgetList.find(
        category => category.name == item.name
      );

      if (existBudget) {
        return {
          budget: String(existBudget.budget),
          name: existBudget.name,
          startTime: createBudgetDto.startTime,
          endTime: createBudgetDto.endTime,
        };
      } else {
        return {
          budget: "0",
          name: item.name,
          startTime: createBudgetDto.startTime,
          endTime: createBudgetDto.endTime,
        };
      }
    });

    let budget = new TimeRangeBudget();
    budget.userTimeRangeBudget = user;

    budget.startTime = createBudgetDto.startTime;

    budget.endTime = createBudgetDto.endTime;

    budget.budgetList = mergeCategories;
    await this.timeRangeBudgetRepo.save(budget);
    return "succes";
  }

  async getAllTimeRangeBudget(uid: number, startTime: string, endTime: string) {
    let user = await this.userService.findUserWithTimeRangeById(uid);
    return (
      user.timeRangeBudgetRecord.find(record => {
        // startTime <= record 的 startTime 并且 endTime >= record 的 endTime
        return (
          dayjs(record.startTime).isSameOrBefore(dayjs(startTime)) &&
          dayjs(endTime).isSameOrBefore(dayjs(record.endTime))
        );
      })?.budgetList || []
    );
  }

  async findOne(uid: number, year: string, month: string) {
    let user = await this.userService.findUserWithBudgetById(uid);
    return (
      user.budgetRecord.find(item => {
        return item.year == year && item.month == month;
      }) || {}
    );
  }

  async updateTimeRangeBudget(
    uid: number,
    updateBudgetDto: UpdateTimeRangeBudgetDto
  ) {
    console.log("🚀 ~ file: budget.service.ts:147 ~ BudgetService ~ updateBudgetDto:", updateBudgetDto);
    let {timeRangeBudgetRecord} = await this.userService.findUserWithTimeRangeById(uid);

    const budget = timeRangeBudgetRecord.find(record => {
      // startTime <= record 的 startTime 并且 endTime >= record 的 endTime
      return (
        dayjs(record.startTime).isSame(dayjs(updateBudgetDto.startTime)) &&
        dayjs(updateBudgetDto.endTime).isSame(dayjs(record.endTime))
      );
    });
    console.log("🚀 ~ file: budget.service.ts:156 ~ BudgetService ~ budget ~ budget:", budget);

    if (budget) {
      this.timeRangeBudgetRepo.update(budget.id, updateBudgetDto);
    }
    return budget;
  }

  async update(updateBudgetDto: UpdateBudgetDto) {
    let { id, ...other } = updateBudgetDto;
    console.log(
      "🚀 ~ file: budget.service.ts:123 ~ BudgetService ~ update ~ updateBudgetDto:",
      updateBudgetDto
    );
    await this.budget.update(id, other);
    return "success";
  }
}
