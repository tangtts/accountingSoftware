import { Body, ClassSerializerInterceptor, Controller, UploadedFile, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { IsNumber, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';
import * as OSS from 'ali-oss';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { ensureDir } from 'fs-extra';
import { diskStorage } from 'multer';
import  * as path from 'path';
import { PublicApi } from 'src/customDecorator';


class LoginUserDto2 {
  name: string

  @Exclude()
  age: number

  constructor(arg: any) {
    Object.assign(this, arg);
  }
}

@ApiTags("基础模块")
@Controller("/")
export class AppController {
  client: OSS;
  constructor(
    private readonly appService: AppService,
  ) {
    const config = {
      accessKeyId: 'LTAI5tPKFF1zJUP9NpShGaiD',
      accessKeySecret: 'aJ8YmbEaVY442gciKNqTjvYqOWCHSj',
      // 存储桶名字
      bucket: 'shuokuntang',
    };

    this.client = new OSS(config);
  }

  @PublicApi()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: '上传文件' })
  @PublicApi()
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
  async upload(
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
