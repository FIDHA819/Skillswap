import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { IUserRepository }
from "../../../domain/User/repositories/IUserRepository"

import { AppError }
from "../../../core/errors/AppError"

export class LoginUserUseCase {

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
console.log("LOGIN EMAIL:", data.email)
    if (!user) {

      throw new AppError(
        "User not found",
        404
      )

    }

    const isMatch =
      await bcrypt.compare(
        data.password,
        user.password
      )

    if (!isMatch) {

      throw new AppError(
        "Invalid password",
        401
      )

    }

    if (!user.isVerified) {

      throw new AppError(
        "Verify OTP first",
        403
      )

    }

    const token =
      jwt.sign(

        {

          id: user.id,
          email: user.email

        },

        process.env.JWT_SECRET as string,

        {

          expiresIn: "1d"

        }

      )

    return {

      token,

      user: {

        id: user.id,
        email: user.email

      }

    }

  }

}