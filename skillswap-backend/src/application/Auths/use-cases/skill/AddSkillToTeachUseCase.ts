import { IUserRepository } from "../../repositories/IUserRepository";

export class AddSkillToTeachUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, skillData: { skill: string; category: string; introduction: string; highestQuality: string; mode: "paid" | "free" }) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    user.skillsToTeach.push(`${skillData.skill} - ${skillData.category}`);
    return this.userRepo.update(user);
  }
}
