import { User } from "../entities/User"

export interface IUserRepository {
  findById(userId: string): Promise<User | null>

  findByEmail(email: string): Promise<User | null>

  create(user: User): Promise<void>

  verifyUser(email: string): Promise<void>

  updateOtp(email: string, otp: string, expiry: Date): Promise<void>

  updatePassword(email: string, password: string): Promise<void>

  updateSkills(
    email: string,
    skillsToTeach: string[],
    skillsToLearn: string[]
  ): Promise<void>

  updateProfileCompletion(
    email: string,
    completed: boolean
  ): Promise<void>

  switchRole(
    email: string,
    role: "learner" | "teacher"
  ): Promise<void>

  // ⭐ ADD THIS
  findSuggestedMatches(userId: string): Promise<User[]>

}