import { IProfileRepository }
from "../../../domain/Profile/repositories/IProfileRepository"

export class GetTeacherProfileUseCase{

  constructor(
    private profileRepo:IProfileRepository
  ){}

  async execute(
    userId:string
  ){

    return await this.profileRepo
    .findByUserId(userId)

  }

}