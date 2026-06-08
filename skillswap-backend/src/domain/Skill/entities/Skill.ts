export interface Skill {
  _id?: string

  name: string

  category: string

  description?: string

  teachers: string[]

  learners: string[]

  totalTeachers: number

  totalLearners: number

  createdAt?: Date
}