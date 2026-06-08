import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository"
import { Category } from "../../../domain/Category/entities/Category"

export class GetCategoriesUseCase {

  constructor(
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<Category[]> {

    return this.categoryRepository.getAllCategories()

  }

}