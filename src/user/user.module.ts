import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { GenCaptchaService } from "src/toolsServer/genCaptcha.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, GenCaptchaService],
  exports:[UserService],
}) 
export class UserModule {}
