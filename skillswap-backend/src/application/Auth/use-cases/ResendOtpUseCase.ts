import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

import { AppError }
from "../../../core/errors/AppError"

import { MailService }
from "../../../infrastructure/services/MailService"

export class ResendOtpUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

  async execute(data: {

    email: string
    mode: "signup" | "reset"

  }) {

    const { email, mode } = data

    const user =
      await this.userRepository
        .findByEmail(email)

    if (!user)
      throw new AppError(
        "User not found",
        404
      )

    // ❗ Block resend ONLY during signup flow
    if (
      mode === "signup" &&
      user.isVerified
    )
      throw new AppError(
        "User already verified",
        400
      )

    const otp =
      Math.floor(
        100000 + Math.random() * 900000
      ).toString()

    console.log(otp)

    const expiry =
      new Date(
        Date.now() + 5 * 60 * 1000
      )

    await this.userRepository.updateOtp(
      email,
      otp,
      expiry
    )

    await MailService.sendOtp(
      email,
      otp
    )

    return {

      message:
        "OTP resent successfully"

    }

  }

}