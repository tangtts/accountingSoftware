import { Budget } from "src/budget/entities/budget.entity";
import { TimeRangeBudget } from "src/budget/entities/budgetDetail.entity";
import { CommonCategories } from "src/common/entities/commonCategories.entity";
import { IncomeOrCost } from "src/income/entities/income.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: true, comment: "激活/失活" })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({
    comment: "创建时间",
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: "更新时间",
  })
  updateTime: Date;

  // 消费记录关联
  @OneToMany(()=>IncomeOrCost, incomeOrCost=>incomeOrCost.consumptionUser,{
    cascade:true,
    onDelete:"CASCADE"
  })
  consumptionRecord:IncomeOrCost[]

  @OneToMany(()=>Budget, budget=>budget.userBudget,{
    cascade:true,
    onDelete:"CASCADE"
  })
  budgetRecord:Budget[]

  @OneToMany(()=>TimeRangeBudget, budget=>budget.userTimeRangeBudget,{
    cascade:true,
    onDelete:"CASCADE"
  })
  timeRangeBudgetRecord:TimeRangeBudget[]

  @OneToMany(()=>CommonCategories, category=>category.userCategory,{
    cascade:true,
    onDelete:"CASCADE"
  })
  categories:CommonCategories[]
}
