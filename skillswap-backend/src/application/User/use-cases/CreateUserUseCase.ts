import { IPasswordHasher } from "../../Auth/providers/IPasswordHasher";
import { IUserRepository } from "../../Auth/repositories/IUserRepository";
import { UserEntity } from "../../../domain/Auth/entities/user.entities";

export class CreateUserUseCase {
  constructor(private userRepo: IUserRepository, private passwordHasher: IPasswordHasher) {}

  async execute({ fullName, email, password }: { fullName: string; email: string; password: string }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await this.passwordHasher.hash(password);
    const userEntity = UserEntity.create({ fullName, email, password: hashedPassword });

    return await this.userRepo.create(userEntity);
  }
}
