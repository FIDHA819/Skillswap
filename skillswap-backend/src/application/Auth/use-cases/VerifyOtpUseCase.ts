import { AppError } from "../../../core/errors/AppError"
import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

import jwt from "jsonwebtoken"

export class VerifyOtpUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: {
  email: string
  otp: string
  mode: "signup" | "reset"
}) {

  if (!data.email || !data.otp)
    throw new AppError("Missing OTP data")

  const user =
    await this.userRepository.findByEmail(data.email)

  if (!user)
    throw new AppError("User not found", 404)

  if (user.otp !== data.otp)
    throw new AppError("Invalid OTP", 400)

  if (!user.otpExpires || user.otpExpires < new Date())
    throw new AppError("OTP expired", 400)


  /*
  ✅ ALWAYS verify account if not already verified
  */

  if (!user.isVerified) {

    await this.userRepository.verifyUser(data.email)

  }


  return {
    message: "OTP verified successfully"
  }

}
}