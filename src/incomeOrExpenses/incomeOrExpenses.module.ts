import { IncomeOrExpenses } from "./entities/incomeOrExpenses.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { IncomeOrExpensesService } from "./incomeOrExpenses.service";
import { IncomeController } from "./incomeOrExpenses.controller";
import { UserModule } from "src/user/user.module";
import { User } from "src/user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([IncomeOrExpenses, User]), UserModule],
  controllers: [IncomeController],
  providers: [IncomeOrExpensesService],
})
export class IncomeOrExpensesModule {}
