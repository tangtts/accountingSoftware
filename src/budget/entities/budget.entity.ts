import { Exclude, Type } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id:number

  @Column({
    comment:"开始日期时间戳",
    type:"varchar",
    length:13
  })
  startDateTimestamp:string

  @Column({
    comment:"结束日期时间戳",
    type:"varchar",
    length:13
  })
  endDateTimestamp:string

  @Column({
    comment:"预算金额",
    default:0
  })
  budgetAmount:number

  @ManyToOne(()=>User,(user)=>user.budgetRecord,{
      cascade:true,
      onDelete:"CASCADE"
  })
  userBudget:User
}
