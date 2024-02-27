import { UserService } from "./../user/user.service";
import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
import { Categories } from 'src/category/entities/category.entity';
dayjs.extend(isSameOrBefore);

@Injectable()
export class BudgetService {
  @Inject()
  userService: UserService;

  @InjectRepository(Budget)
  private readonly budgetRepository: Repository<Budget>;

  @InjectRepository(TimeRangeBudget)
  private readonly timeRangeBudgetRepo: Repository<TimeRangeBudget>;

  async create(uid: number, { startTimestamp, endTimestamp, budgetAmount }) {
    let user = await this.userService.findBudgetByUserId(uid);

    const existBudget = user.budgetRecord.find(
      item =>
        item.startDateTimestamp == startTimestamp &&
        item.endDateTimestamp == endTimestamp
    );

    // 如果存在旧的，就更新
    if (existBudget) {
      await this.budgetRepository.update(existBudget.id, {
        budgetAmount,
      });
    } else {
      // 否则就创建新预算表
      await this.budgetRepository.save({
        userBudget: user,
        budgetAmount,
        endDateTimestamp: endTimestamp,
        startDateTimestamp: startTimestamp,
      });
    }

    return "success";
  }

  private async generateBudgetList(
    startTimestamp: number,
    endTimestamp: number,
    categories: Categories[],
    uid: number
  ) {
    // 找到所有的分类
    return await this.timeRangeBudgetRepo.save({
      userTimeRangeBudget: await this.userService.findUserWithTimeRangeById(
        uid
      ),
      startTimestamp,
      endTimestamp,
      // 自定义的分类
      budgetList: categories.map(item => {
        return {
          id: item.id,
          budget: 0,
          name: item.categoryName,
        };
      }),
    });
  }
  async getTimeRangeBudgetList(
    uid: number,
    startTimestamp: number,
    endTimestamp: number
  ) {
    // 找到所有的分类
    let { timeRangeBudgetRecord, categories } =
      await this.userService.findUserWithTimeRangeById(uid);

    // 找是否有今天的记录
    let filterTimeRangeBudgetRecord = timeRangeBudgetRecord.find(record => {
      return (
        record.startTimestamp == startTimestamp &&
        record.endTimestamp == endTimestamp
      );
    });

    // 如果没有就创建一个
    if (filterTimeRangeBudgetRecord) {
      // 判断是否增加/修改了 categories
      let list = filterTimeRangeBudgetRecord.budgetList;

      // 遍历 分类
      // 找到 bugetlist 中是否有这个分类
      return {
        id: filterTimeRangeBudgetRecord.id,
        data: categories.map(category => {
          let hasExist = list.find(l => l.id == category.id);

          if (hasExist) {
            return {
              id: hasExist.id,
              name: category.categoryName,
              budget: hasExist.budget,
            };
          } else {
            return {
              id: category.id,
              name: category.categoryName,
              budget: 0,
            };
          }
        }),
      };
    }

    let r = await this.generateBudgetList(
      startTimestamp,
      endTimestamp,
      categories,
      uid
    );
    return {
      data: r.budgetList,
      id: r.id,
    };
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
          startTime: createBudgetDto.startDateTimestamp,
          endTime: createBudgetDto.endDateTimestamp,
        };
      } else {
        return {
          budget: "0",
          name: item.name,
          startTime: createBudgetDto.startDateTimestamp,
          endTime: createBudgetDto.endDateTimestamp,
        };
      }
    });

    let budget = new TimeRangeBudget();
    budget.userTimeRangeBudget = user;

    budget.startTimestamp = createBudgetDto.startDateTimestamp;

    budget.endTimestamp = createBudgetDto.endDateTimestamp;

    budget.budgetList = mergeCategories;
    await this.timeRangeBudgetRepo.save(budget);
    return "succes";
  }

  async getAllTimeRangeBudget(
    uid: number,
    startTimestamp: number,
    endTimestamp: number
  ) {
    let user = await this.userService.findUserWithTimeRangeById(uid);
    return (
      user.timeRangeBudgetRecord.find(record => {
        return (
          record.startTimestamp == startTimestamp &&
          record.endTimestamp == endTimestamp
        );
      })?.budgetList || []
    );
  }

  async findOne(
    uid: number,
    startDateTimestamp: string,
    endDateTimestamp: string
  ) {
    let {budgetRecord} = await this.userService.findBudgetByUserId(uid);
    return (
      budgetRecord.find(item => {
        return (
          item.startDateTimestamp === startDateTimestamp &&
          item.endDateTimestamp === endDateTimestamp
        );
      }) || { budgetAmount: 0 }
    );
  }

  async updateTimeRangeBudget(
    uid: number,
    updateBudgetDto: UpdateTimeRangeBudgetDto
  ) {
    let { timeRangeBudgetRecord } =
      await this.userService.findUserWithTimeRangeById(uid);

    const budget = timeRangeBudgetRecord.find(record => {
      return record.id == updateBudgetDto.id;
    });

    if (budget) {
      this.timeRangeBudgetRepo.update(budget.id, updateBudgetDto);
      return "success";
    }

    return new HttpException("budget not found", HttpStatus.NOT_FOUND);
  }

  async update(uid:number,updateBudgetDto: UpdateBudgetDto) {

    // 查找当前用户是否有这个预算表
    let { budgetRecord } =
    await this.userService.findBudgetByUserId(uid);
    
    if(!budgetRecord || budgetRecord.length === 0){
      throw new BadRequestException("没有所属当前用户预算表！")
    }

    const oldBudgetRecord = budgetRecord.find(record=>record.id === updateBudgetDto.id);

    const mergeBudgetRecord = this.budgetRepository.merge(oldBudgetRecord,updateBudgetDto)
   
    await this.budgetRepository.save(mergeBudgetRecord);
    return "success";
  }
}
