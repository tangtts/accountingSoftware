import { Budget } from "src/budget/entities/budget.entity";
import { TimeRangeBudget } from "src/budget/entities/budgetDetail.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity("categories")
export class CommonCategories {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment: "名称",
  })
  name: string;

  @Column({
    comment: "对应的value属性",
  })
  value: string;

  @CreateDateColumn({
    comment: "创建时间",
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: "更新时间",
  })
  updateTime: Date;

  @ManyToOne(()=>User,(user)=>user.categories)
  userCategory: User;

  // 一个分类对应多个
  @OneToMany(()=>TimeRangeBudget,(timeRangeBudget)=>timeRangeBudget.commonCategories)
  timeRangeBudget: TimeRangeBudget[];
}
