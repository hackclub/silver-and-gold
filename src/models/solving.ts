import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// Represents a person solving the emoji challenge
@Entity()
class Solving extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  userId: string;

  @Column({
    nullable: false,
  })
  emoji: string;
}

export default Solving;
