import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { IUserRepository }
from "../../../domain/User/repositories/IUserRepository"

import { AppError }
from "../../../core/errors/AppError"
import { OtpService }
from "../../../infrastructure/services/OTPService"

import { MailService }
from "../../../infrastructure/services/MailService"

export class ForgotPasswordUseCase {

  constructor(
    private userRepo: IUserRepository
  ) {}

  async execute(data: {
    email: string
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

    const otp =
      OtpService.generate()

      console.log(otp)

    const expiry =
      new Date(
        Date.now() +
        5 * 60 * 1000
      )

    await this.userRepo.updateOtp(
      data.email,
      otp,
      expiry
    )

    await MailService.sendOtp(
      data.email,
      otp
    )

    return {

      message:
        "Reset OTP sent to email"

    }

  }

}