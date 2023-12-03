import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum IncomeOrCostType {
  INCOME,
  COST,
}

export enum PayType {
  ALIPay,
  WEIXINPay,
  CASh,
  OTHER,
}

@Entity('incomeOrCost')
export class IncomeOrCost {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: "enum",
    enum: IncomeOrCostType,
    default: IncomeOrCostType.COST,
  })
  type: IncomeOrCostType;

  @Column({
    comment: "数量",
  })
  amount: string;

  @Column({
    comment: "照片url",
  })
  picUrl: string;

  @Column({
    comment: "支付方式",
    type: "enum",
    enum: PayType,
    default: PayType.ALIPay,
  })
  payType: PayType;

  @Column({
    comment: "创建时间"
  })
  createTime: Date;

  @Column({ comment: "备注" })
  remark: string;
}
