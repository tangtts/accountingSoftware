import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommonCategoryDto } from "./dto/create-commonCategory.dto";
import { UpdateCommonCategoryDto } from "./dto/update-commonCategory.dto";
import { CommonCategories } from "./entities/commonCategories.entity";
import { UserService } from "src/user/user.service";
import { TimeRangeBudget } from "src/budget/entities/budgetDetail.entity";

@Injectable()
export class CommonService {
  @InjectRepository(CommonCategories)
  private readonly commonCategories: Repository<CommonCategories>;

  @InjectRepository(TimeRangeBudget)
  private readonly timeRangeBudget: Repository<TimeRangeBudget>;

  

  @Inject(UserService)
  private readonly userService: UserService;

  async getAllCategories(uid:number) {
    let user =await this.userService.findUserWithCategroyById(uid);
    return user.categories;
  }

  async createCategory(
    uid: number,
    createCommonCategoryDto: CreateCommonCategoryDto
  ) {
    // 先判断是否有重复
    let user = await this.userService.findUserWithCategroyById(uid);
    let hasExist = user.categories.find(category => {
      return (
        category.name == createCommonCategoryDto.name ||
        category.value == createCommonCategoryDto.value
      );
    });

    if (hasExist) {
      throw new HttpException(
        "已经存在同名或者同值的类型!",
        HttpStatus.BAD_REQUEST
      );
    }
   
    await this.commonCategories.save({
      ...createCommonCategoryDto,
      userCategory:user
    });
    return "success";
  }

  async update(updateCommonCategoryDto: UpdateCommonCategoryDto) {
    let category = await this.commonCategories.findOneBy({
      id: updateCommonCategoryDto.id,
    });

    if (!category) {
      throw new HttpException("不存在此类别！", HttpStatus.BAD_REQUEST);
    }

    if (updateCommonCategoryDto.name) {
      category.name = updateCommonCategoryDto.name;
    }

    if (updateCommonCategoryDto.value) {
      category.value = updateCommonCategoryDto.value;
    }
    return await this.commonCategories.save(category);
  }
  async del(id: string) {
    let category = await this.commonCategories.findOneBy({ id });

    if (!category) {
      throw new HttpException("不存在此类别！", HttpStatus.BAD_REQUEST);
    }
    await this.commonCategories.delete({ id });
    return "success";
  }
}
