import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCommonCategoryDto } from "./dto/create-commonCategory.dto";
import { UpdateCommonCategoryDto } from "./dto/update-commonCategory.dto";
import { CommonCategories } from "./entities/commonCategories.entity";

@Injectable()
export class CommonService {
  @InjectRepository(CommonCategories)
  private readonly commonCategories: Repository<CommonCategories>;

  async getAllCategories() {
    return await this.commonCategories.find();
  }

  async createCategory(createCommonCategoryDto: CreateCommonCategoryDto) {
    // 先判断是否有重复
    let hasExist = await this.commonCategories.find({
      where: [
        { name: createCommonCategoryDto.name },
        { value: createCommonCategoryDto.value },
      ],
    });

    if (hasExist.length) {
      throw new HttpException(
        "已经存在同名或者同值的类型!",
        HttpStatus.BAD_REQUEST
      );
    }

    let category = new CommonCategories();
    category.name = createCommonCategoryDto.name;
    category.value = createCommonCategoryDto.value;
    return await this.commonCategories.save(category);
  }

  async update(updateCommonCategoryDto:UpdateCommonCategoryDto){
    let category =  await this.commonCategories.findOneBy({id:updateCommonCategoryDto.id})

    if(!category){
      throw new HttpException(
        "不存在此类别！",
        HttpStatus.BAD_REQUEST
      );
    }

    if(updateCommonCategoryDto.name){
      category.name = updateCommonCategoryDto.name
    }

    if(updateCommonCategoryDto.value){
      category.value = updateCommonCategoryDto.value
    }
    return await this.commonCategories.save(category)
  }
 async del(id:string){
    let category =  await this.commonCategories.findOneBy({id})

    if(!category){
      throw new HttpException(
        "不存在此类别！",
        HttpStatus.BAD_REQUEST
      );
    }
    await this.commonCategories.delete({id})
    return "success"
  }
}
