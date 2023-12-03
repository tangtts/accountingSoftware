import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonCategories } from './entities/commonCategories.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonCategories])],
  controllers: [CommonController],
  providers: [CommonService]
})
export class CommonModule {}
