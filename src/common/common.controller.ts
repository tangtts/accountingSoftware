import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { CommonService } from "./common.service";
import { CreateCommonCategoryDto } from "./dto/create-commonCategory.dto";
import { UpdateCommonCategoryDto } from "./dto/update-commonCategory.dto";

@Controller("common")
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get("/findCategory")
  findAllCategories() {
    return this.commonService.getAllCategories();
  }

  @Post("/createCategory")
  create(@Body() createCommonCategoryDto: CreateCommonCategoryDto) {
    return this.commonService.createCategory(createCommonCategoryDto);
  }

  @Post("/updateCategory")
  update(@Body() updateCommonCategoryDto: UpdateCommonCategoryDto) {
    return this.commonService.update(updateCommonCategoryDto);
  }
  @Post("/delCategory")
  del(@Body("id", new ParseIntPipe()) id) {
    return this.commonService.del(id);
  }
}
