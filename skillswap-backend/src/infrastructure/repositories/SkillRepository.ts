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
    return SkillModel.find()
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
}