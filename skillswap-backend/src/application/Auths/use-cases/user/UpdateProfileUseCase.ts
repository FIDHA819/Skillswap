import { UserEntity } from "../../../../domain/entities/user.entities";
import { IUserRepository } from "../../repositories/IUserRepository";

export class UpdateProfileUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, profileData: Partial<UserEntity>) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    user.updateProfile(profileData);
    return this.userRepo.update(user);
  }
}
