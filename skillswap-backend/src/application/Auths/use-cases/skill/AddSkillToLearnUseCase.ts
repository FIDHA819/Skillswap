import { IUserRepository } from "../../repositories/IUserRepository";

export class AddSkillToLearnUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, skill: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    user.skillsToLearn.push(skill);
    return this.userRepo.update(user);
  }
}
