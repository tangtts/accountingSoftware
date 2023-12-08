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
} from "@nestjs/common";
import { CommonService } from "./common.service";
import { CreateCommonCategoryDto } from "./dto/create-commonCategory.dto";
import { UpdateCommonCategoryDto } from "./dto/update-commonCategory.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from "multer";
import * as path from "path";
import { ensureDir } from "fs-extra";
import { ConfigService } from "@nestjs/config";
import { RequireLogin, UserInfo } from "src/customDecorator";
@Controller("common")
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly configService: ConfigService
  ) {}

  @Get("/findCategory")
  findAllCategories(@UserInfo('uid') uid:number,) {
    return this.commonService.getAllCategories(uid);
  }

  @Post("/createCategory")
  create(@UserInfo('uid') uid:number, @Body() createCommonCategoryDto: CreateCommonCategoryDto) {
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
  @Post("/upload")
  upload(
    @Req() req: any,
    @Body() uploadDTO: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const PORT = this.configService.get("nest_server_port");
    return {
      file: req.file,
      url: `http://127.0.0.1:${PORT}/static/${req.file.filename}`,
    };
  }
}
