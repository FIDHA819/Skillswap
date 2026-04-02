import { IUserRepository }
from "../../../domain/User/repositories/IUserRepository"

import jwt from "jsonwebtoken"

export class VerifyOtpUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: {

    email: string
    otp: string

  }) {

    if (!data.email || !data.otp)
      throw new Error("Missing OTP data")

    const user =
      await this.userRepository
        .findByEmail(data.email)

    if (!user)
      throw new Error("User not found")

    if (user.otp !== data.otp)
      throw new Error("Invalid OTP")

    if (user.otpExpires < new Date())
      throw new Error("OTP expired")

    await this.userRepository.verifyUser(
      data.email
    )

    const token =
      jwt.sign(

        { email: user.email },

        process.env.JWT_SECRET!,

        { expiresIn: "1d" }

      )

    return {

      message:
        "Account verified successfully",

      token

    }

  }

}