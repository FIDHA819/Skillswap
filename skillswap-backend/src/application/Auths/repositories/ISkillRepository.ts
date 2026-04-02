import { SkillEntity } from "../../../domain/entities/skill.entity";

export interface ISkillRepository {
  create(skill: SkillEntity): Promise<SkillEntity>;
  findByUser(userId: string): Promise<SkillEntity[]>;
  remove(skillId: string, userId: string): Promise<void>;
}
