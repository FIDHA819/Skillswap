import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

import { AppError }
from "../../../core/errors/AppError"

import { HashService }
from "../../../infrastructure/services/HashServices"

export class ResetPasswordUseCase {

  constructor(
    private userRepo: IUserRepository
  ) {}

  async execute(data: {

    email: string
  
    password: string

  }) {

    const user =
      await this.userRepo.findByEmail(
        data.email
      )

    if (!user)
      throw new AppError(
        "User not found",
        404
      )

    

    const hashedPassword =
      await HashService.hash(
        data.password
      )

    await this.userRepo.updatePassword(
      data.email,
      hashedPassword
    )

    return {

      message:
        "Password reset successful"

    }

  }

}