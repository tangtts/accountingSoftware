import { Exclude } from "class-transformer";
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

  @Column({
    comment:"头像",
    default:"https://img.ixintu.com/download/jpg/20200902/bd1dd4e21d7c981e9df7b58155dc95fd_512_512.jpg!con"
  })
  avatar: string;

  @Column({
    select:false
  })
  password: string;

  @Column({ default: false,select:false })
  isAdmin: boolean;

  @Column({ default: true, comment: "激活/失活" })
  isActive: boolean;

  @Column({ default: false,select:false })
  isDeleted: boolean;

  @CreateDateColumn({
    comment: "创建时间",
    select:false
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: "更新时间",
    select:false
  })
  updateTime: Date;

  // 消费记录关联
  @OneToMany(()=>IncomeOrCost, incomeOrCost=>incomeOrCost.consumptionUser,{
    cascade:true,
    onDelete:"CASCADE"
  })
  consumptionRecord:IncomeOrCost[]

  @OneToMany(()=>Budget, budget=>budget.userBudget)
  budgetRecord:Budget[]

  // 一个 用户拥有多个时间间隔记录
  @OneToMany(()=>TimeRangeBudget, budget=>budget.userTimeRangeBudget)
  timeRangeBudgetRecord:TimeRangeBudget[]

// 一方面创建分类需要更改 预算表 
// 更改预算后, 需要更新用户的分类


  @OneToMany(()=>CommonCategories, category=>category.userCategory)
  categories:CommonCategories[]


}
