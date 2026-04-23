import { IUserRepository }
from "../../domain/repositories/IUserRepository"

export class GetCurrentUserUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string) {

    return this.userRepository.findById(userId)

  }

}