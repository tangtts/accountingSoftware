import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCategories } from './entities/commonCategories.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { TimeRangeBudget } from 'src/budget/entities/budgetDetail.entity';

@Module({
  imports: [

    UserModule, TypeOrmModule.forFeature([CommonCategories,TimeRangeBudget])],
  controllers: [CommonController],
  providers: [CommonService]
})
export class CommonModule {}
