import { ISkillRepository } from "../../../domain/repositories/ISkillRepository"

export class SearchTeachersUseCase {

  constructor(
    private skillRepository: ISkillRepository
  ) {}

  async execute(keyword: string) {

    return this.skillRepository.searchSkills(keyword)

  }

}