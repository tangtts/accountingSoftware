import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserService } from "src/user/user.service";
import { TimeRangeBudget } from "src/budget/entities/budgetDetail.entity";
import { Categories } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  @InjectRepository(Categories)
  private readonly categories: Repository<Categories>;
  @Inject(UserService)
  private readonly userService: UserService;

  async getAllCategories(uid: number) {
    let user = await this.userService.findUserWithCategroyById(uid);
    return user.categories ?? [];
  }

  async createCategory(
    uid: number,
    createCategoryDto: CreateCategoryDto
  ) {
    // 先判断是否有重复
    let user = await this.userService.findUserWithCategroyById(uid);
    let hasExist = user.categories.find(category => {
      return (
        category.categoryName === createCategoryDto.categoryName
      );
    });

    if (hasExist) {
      throw new HttpException(
        "已经存在同名类型!",
        HttpStatus.BAD_REQUEST
      );
    }

    await this.categories.save({
      ...createCategoryDto,
      // 创建一个自增的 value
      categoryValue:user.categories.length + '',
      userCategory: user
    });
    return "success";
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    let oldCategory = await this.categories.findOneBy({
      id: updateCategoryDto.id + ' ',
    });

    if (!oldCategory) {
      throw new HttpException("不存在此类别！", HttpStatus.BAD_REQUEST);
    }

    if (updateCategoryDto.categoryName) {
      oldCategory.categoryName = updateCategoryDto.categoryName;
    }

    return await this.categories.save(oldCategory);
  }
  async del(id: string) {
    let category = await this.categories.findOneBy({ id });

    if (!category) {
      throw new HttpException("不存在此类别！", HttpStatus.BAD_REQUEST);
    }
    await this.categories.delete({ id });
    return "success";
  }
}
