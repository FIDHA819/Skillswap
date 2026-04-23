import { IUserRepository } from "../../../domain/repositories/IUserRepository"

export class GetSuggestedMatchesUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(userId: string) {

    return this.userRepository.findSuggestedMatches(userId)

  }

}