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
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum IncomeOrCostType {
  COST = "0",
  INCOME = "1",
}

export enum PayType {
  ALIPay,
  WEIXINPay,
  CASh,
  OTHER,
}

@Entity("income")
export class IncomeOrCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: IncomeOrCostType,
    default: IncomeOrCostType.COST,
    comment: "收入或支出",
  })
  type: IncomeOrCostType;

  @Column({
    comment: "金额",
  })
  amount: string;

  @Column({ type: "text", nullable: true, comment: "照片url" })
  @Exclude()
  picUrlsString: string;

  @Column({
    comment: "类别",
  })
  categoryType: string;

  @Column({
    comment: "支付方式",
    type: "enum",
    enum: PayType,
    default: PayType.ALIPay,
  })
  payType: PayType;

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

  // 支付的用户
  @ManyToOne(() => User, user => user.consumptionRecord)
  consumptionUser: User;
}
