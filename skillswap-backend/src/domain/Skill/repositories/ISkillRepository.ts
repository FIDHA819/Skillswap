// domain/repositories/ISkillRepository.ts

import { Skill } from "../entities/Skill"

export interface ISkillRepository {

  create(skill: Skill): Promise<Skill>

  findByName(name: string): Promise<Skill | null>

  findById(id: string): Promise<Skill | null>

  findAll(): Promise<Skill[]>

  addTeacher(
    skillId: string,
    teacherId: string
  ): Promise<void>
}