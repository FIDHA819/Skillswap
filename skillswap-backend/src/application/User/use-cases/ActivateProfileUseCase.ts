import { IUserRepository } from "../../repositories/IUserRepository";

export class ActivateProfileUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    user.activateProfile();
    return this.userRepo.update(user);
  }
}
