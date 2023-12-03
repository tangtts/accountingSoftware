import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Entity('categories')
export class CommonCategories {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    comment:"名称"
  })
  name: string;

  @Column({
    comment:"对应的value属性"
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
}
