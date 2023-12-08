import { IncomeOrCost } from "./entities/income.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { IncomeController } from "./income.controller";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([IncomeOrCost, User]), UserModule],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
