import { Skill } from "../Skill/entities/Skill"

export interface ISkillRepository {

  getAllSkills(): Promise<Skill[]>

  getSkillsByCategory(category: string): Promise<Skill[]>

  searchSkills(keyword: string): Promise<Skill[]>

}