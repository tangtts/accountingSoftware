import { IncomeOrCost } from './entities/income.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

@Module({
  imports:[TypeOrmModule.forFeature([IncomeOrCost])],
  controllers: [IncomeController],
  providers: [IncomeService]
})
export class IncomeModule {}
