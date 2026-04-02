import { IUserRepository } from "../../Auth/repositories/IUserRepository";

export class GetUserByIdUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
}
