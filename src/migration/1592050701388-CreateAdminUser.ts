import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { UserRole, User } from "../entity/User";

export class CreateAdminUser1592050701388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let user = new User();
    user.username = "Admin";
    user.password = "admin";
    user.hashPassword();
    user.role = UserRole.ADMIN;
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
