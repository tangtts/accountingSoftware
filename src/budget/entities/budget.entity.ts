import { Exclude, Type } from "class-transformer";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn  } from "typeorm";

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id:number

  @Column({
    default:new Date().getFullYear()
  })
  year:string

  @Column({
    default:new Date().getMonth()
  })
  month:string

  @Column({
    comment:"预算金额",
    default:0
  })
  budget:number

  @ManyToOne(()=>User,(user)=>user.budgetRecord)
  userBudget:User
}
