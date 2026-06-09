// infrastructure/repositories/SkillRepository.ts

import SkillModel from "../database/models/SkillModel"
import { ISkillRepository } from "../../domain/Skill/repositories/ISkillRepository"

export class SkillRepository
implements ISkillRepository {

  async create(skill:any){
    return SkillModel.create(skill)
  }

  async findByName(name:string){
    return SkillModel.findOne({name})
  }

  async findById(id:string){
    return SkillModel.findById(id)
  }

  async findAll(){
    return await SkillModel.find()
  }

  async addTeacher(
    skillId:string,
    teacherId:string
  ){
    await SkillModel.findByIdAndUpdate(
      skillId,
      {
        $addToSet:{
          teachers:teacherId
        }
      }
    )
  }
  async findTeachersBySkill(skillName: string): Promise<PopulatedTeacher[]> {
  const skill = await SkillModel
    .findOne({ name: skillName })
    .populate({
      path: "teachers",
      select: "_id fullName email profileCompleted role"
    })
    .lean()

  if (!skill) return []
  return skill.teachers as PopulatedTeacher[]
}
}