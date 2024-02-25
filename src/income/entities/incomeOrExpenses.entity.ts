import { Exclude } from "class-transformer";
import { IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 *
 * 消费收入枚举
 * @export
 * @enum {number}
 */
export enum IncomeOrExpensesType {
  EXPENSES = "0", // 花费
  INCOME = "1", // 收入
}

export enum IncomeOrExpensesPatternType {
  ALIPay,
  WEIXINPay,
  CASH,
  OTHER,
}

@Entity("income_or_expenses")
export class IncomeOrExpenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: IncomeOrExpensesType,
    default: IncomeOrExpensesType.EXPENSES,
    comment: "收入或支出",
  })
  incomeOrExpensesType: IncomeOrExpensesType;

  @Column({
    comment: "金额",
  })
  amount: string;

  @Column({ type: "text", nullable: true, comment: "照片url" })
  @Exclude()
  picUrlsString: string;

  @Column({
    comment: "消费或者收入类别",
  })
  categoryType: string;

  @Column({
    comment: "消费或者收入方式",
    type: "enum",
    enum: IncomeOrExpensesPatternType,
    default: IncomeOrExpensesPatternType.ALIPay,
  })
  incomeOrExpensesPatternType: IncomeOrExpensesPatternType;

  @Column({
    nullable: false,
    default: () => "NOW()",
    comment: "支付时间",
  })
  payTime: Date;

  @Column({ comment: "备注", default: "" })
  remark: string;

  @CreateDateColumn({
    comment: "创建时间",
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: "更新时间",
  })
  updateTime: Date;

  // 用户
  @ManyToOne(() => User, user => user.incomeOrExpensesRecord)
  incomeOrExpensesUser: User;
}
