import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

export enum Membership {
  SILVER = "silver",
  GOLD = "gold",
  BRONZE = "bronze",
}

@Entity()
class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  userId: string;

  @Column({
    type: "enum",
    enum: Membership,
    default: Membership.SILVER,
    nullable: false,
  })
  membership: Membership;
}

export default Member;
