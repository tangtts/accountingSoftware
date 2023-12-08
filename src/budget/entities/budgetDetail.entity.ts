import { User } from "src/user/entities/user.entity";
import {
  Column,
  Entity,
  BeforeInsert,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as dayjs from "dayjs";
import { CommonCategories } from "src/common/entities/commonCategories.entity";

export interface ITimeRangeBudgetList {
  name: string;
  budget: number;
}

@Entity()
export class TimeRangeBudget {
  @PrimaryGeneratedColumn()
  id: number;

  @BeforeInsert()
  setDefaultStartTime() {
    this.startTime = dayjs().startOf("day").toDate();
  }

  @Column({
    type: "date",
  })
  startTime: Date;

  @Column({
    type: "date",
  })
  endTime: Date;

  @Column({
    comment: "分类列表",
    type: "json",
  })
  budgetList: ITimeRangeBudgetList[];

  // 关联用户
  @ManyToOne(() => User, user => user.timeRangeBudgetRecord)
  userTimeRangeBudget: User;

  @ManyToOne(() => CommonCategories, category => category.timeRangeBudget)
  commonCategories:CommonCategories
}
