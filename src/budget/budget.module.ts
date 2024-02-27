import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { User } from 'src/user/entities/user.entity';


import { TimeRangeBudget } from './entities/budgetDetail.entity';
import { Categories } from 'src/category/entities/category.entity';

@Module({
  imports:[UserModule,TypeOrmModule.forFeature([Budget,User,TimeRangeBudget,Categories])],
  controllers: [BudgetController],
  providers: [BudgetService]
})
export class BudgetModule {}
