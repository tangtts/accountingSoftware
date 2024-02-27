import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from './entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { TimeRangeBudget } from 'src/budget/entities/budgetDetail.entity';

@Module({
  imports: [
    UserModule, TypeOrmModule.forFeature([Categories,TimeRangeBudget])],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
