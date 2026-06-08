import { IUserRepository }
from "../../../domain/repositories/IUserRepository"
import { AppError } from "../../../core/errors/AppError"

export class GetCurrentUserUseCase {

constructor(private repo: IUserRepository) {}

async execute(userId: string) {

const user = await this.repo.findById(userId)

if (!user)
throw new AppError("User not found", 404)

return {
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  profileCompleted: user.profileCompleted,
  role: user.role,
  isVerified: user.isVerified
}

}

}