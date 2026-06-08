// application/useCases/CreateSkillUseCase.ts

import { ISkillRepository } from "../../../domain/Skill/repositories/ISkillRepository"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"

export class CreateSkillUseCase {

  constructor(
    private skillRepo: ISkillRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(
    teacherId:string,
    data:{
      name:string
      categoryId:string
      description:string
    }
  ){

    let skill =
      await this.skillRepo.findByName(
        data.name
      )

    if(!skill){

      skill =
      await this.skillRepo.create({
        ...data,
        teachers:[teacherId],
        learners:[]
      })

    }else{

      await this.skillRepo.addTeacher(
        skill._id!.toString(),
        teacherId
      )
    }

    await this.userRepo.addSkillToTeach(
      teacherId,
      skill._id!.toString()
    )

    return skill
  }
}