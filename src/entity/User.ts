import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  CLIENT = "CLIENT",
}

@Entity()
@Unique(["username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  username: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column({
    type: "simple-enum",
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  // @IsNotEmpty()
  role: UserRole;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  checkIfUncryptedPasswordIsValid(uncryptedPasswod: string) {
    return bcrypt.compareSync(uncryptedPasswod, this.password);
  }
}
