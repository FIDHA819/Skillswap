import { TeachSkillEntity } from "../../../domain/entities/teachSkill.enitity";

export interface ITeachSkillRepository {
  create(skill: TeachSkillEntity): Promise<TeachSkillEntity>;
  findByUser(userId: string): Promise<TeachSkillEntity[]>;
  remove(skillId: string, userId: string): Promise<void>;
}
