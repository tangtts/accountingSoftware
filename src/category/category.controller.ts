import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Req,
  Inject,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from "multer";
import * as path from "path";
import {  UserInfo } from "src/customDecorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("分类模块")
@Controller("category")
export class CategoryController {
  @Inject()
  private readonly categoryService: CategoryService

  @ApiOperation({summary: '获取所有分类'})
  @Get("/getCategories") 
  findAllCategories(@UserInfo('uid') uid: number) {
    return this.categoryService.getAllCategories(uid);
  }

  @ApiOperation({summary: '新建分类'})
  @Post("/createCategory")
  create(@UserInfo('uid') uid: number, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(uid, createCategoryDto);
  }

  @ApiOperation({summary: '更新分类'})
  @Post("/updateCategory")
  update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(updateCategoryDto);
  }

  @ApiOperation({summary: '删除分类'})
  @Post("/delCategory")
  del(@Body("id") id:string) {
    return this.categoryService.del(id);
  }
}
