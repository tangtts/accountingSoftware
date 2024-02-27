import { Exclude } from "class-transformer";
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
export class Categories {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment: "名称",
  })
  categoryName: string;
 
  @Column({
    comment: "对应的value属性",
  })
  categoryValue: string;

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

  // 当分类改变后，需要更新用户的分类
  @ManyToOne(() => User, user => user.categories, {
    cascade: true,
    onDelete: "CASCADE",
  })
  userCategory: User;
}
