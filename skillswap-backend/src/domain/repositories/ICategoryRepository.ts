import { Category } from "../entities/Category"

export interface ICategoryRepository {

  getAllCategories(): Promise<Category[]>

  getCategoryById(
    categoryId: string
  ): Promise<Category | null>

}