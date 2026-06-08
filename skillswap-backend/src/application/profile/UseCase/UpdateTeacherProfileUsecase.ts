import { IProfileRepository }
from "../../../domain/Profile/repositories/IProfileRepository"

export class UpdateTeacherProfileUseCase{

  constructor(
    private profileRepo:IProfileRepository
  ){}

  async execute(
    userId:string,
    data:any
  ){

    return await this.profileRepo.update(
      userId,
      data
    )

  }

}