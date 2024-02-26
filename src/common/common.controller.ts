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
import { CommonService } from "./common.service";
import { CreateCommonCategoryDto } from "./dto/create-commonCategory.dto";
import { UpdateCommonCategoryDto } from "./dto/update-commonCategory.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from "multer";
import * as path from "path";
import { ensureDir } from "fs-extra";
import { ConfigService } from "@nestjs/config";
import { PublicApi, RequireLogin, UserInfo } from "src/customDecorator";
import * as OSS from 'ali-oss';
@Controller("common")
export class CommonController {
  client: OSS;
  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {
    const config = {
      // 填写你自己的 AccessKey 
      accessKeyId: 'LTAI5tJZKeExiYQNvdoRz9iJ',
      accessKeySecret: 'vJviRopIxV6Go5UotOluU4bceWRHRH',
      // 存储桶名字
      bucket: 'shuokuntang',
      // 文件存储路径
      dir: 'images/',
    };

    this.client = new OSS(config);
  }

  @Get("/findCategory")
  findAllCategories(@UserInfo('uid') uid: number,) {
    return this.commonService.getAllCategories(uid);
  }

  @Post("/createCategory")
  create(@UserInfo('uid') uid: number, @Body() createCommonCategoryDto: CreateCommonCategoryDto) {
    return this.commonService.createCategory(uid, createCommonCategoryDto);
  }

  @Post("/updateCategory")
  update(@Body() updateCommonCategoryDto: UpdateCommonCategoryDto) {
    return this.commonService.update(updateCommonCategoryDto);
  }
  @Post("/delCategory")
  del(@Body("id", new ParseIntPipe()) id) {
    return this.commonService.del(id);
  }

  @RequireLogin()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: async function (req, file, cb) {
          // 确保有这个目录
          await ensureDir("my-uploads");
          cb(null, path.join(process.cwd(), "my-uploads"));
        },
        filename: function (req, file, cb) {
          file.originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );
          const uniqueSuffix = Date.now() + "-" + file.originalname;
          cb(null, file.fieldname + "-" + uniqueSuffix);
        },
      }),
    })
  )

  @PublicApi()
  @Post("/upload")
  async upload(
    @Req() req: any,
    @Body() uploadDTO: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const localePath = path.join(process.cwd(), "my-uploads", file.filename)
    try {
      const { url } = await this.client.put(file.fieldname + "-" + file.originalname,
        localePath)
      return {
        url
      }
    } catch (error) {
      console.log(error)
    }
  }
}
