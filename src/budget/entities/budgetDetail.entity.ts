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

export interface ITimeRangeBudgetList {
  id:string,
  name: string;
  budget: number;
}

@Entity()
export class TimeRangeBudget {
  @PrimaryGeneratedColumn()
  id: number;

  // @BeforeInsert()
  // setDefaultStartTime() {
  //   this.startTime = dayjs().startOf("day").toDate();
  // }

  @Column({
    type: "varchar",
    length:13
  })
  startTimestamp: number;

  @Column({
    type: "varchar",
    length:13
  })
  endTimestamp: number;

  @Column({
    comment: "分类列表",
    type: "json",
  })
  budgetList: ITimeRangeBudgetList[];

  // 关联用户
  @ManyToOne(() => User, user => user.timeRangeBudgetRecord,{
    cascade:true,
    onDelete:"CASCADE"
  })
  userTimeRangeBudget: User;
}
