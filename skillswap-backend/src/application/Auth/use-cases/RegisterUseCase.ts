import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

import { User }
from "../../../domain/entities/User"

import { HashService }
from "../../../infrastructure/services/HashServices"

import { OtpService }
from "../../../infrastructure/services/OTPService"

import { MailService }
from "../../../infrastructure/services/MailService"

import { AppError }
from "../../../core/errors/AppError"

export class RegisterUserUseCase {

  constructor(
    private userRepository: IUserRepository
  ) {}

 async execute(data: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}) {

  if (!data)
    throw new Error("Signup payload missing")

  if (!data.password)
    throw new Error("Password missing")

  if (!data.confirmPassword)
    throw new Error("Confirm password missing")

  if (data.password !== data.confirmPassword)
    throw new Error("Passwords do not match")


    const exists =
      await this.userRepository
        .findByEmail(data.email)

    if (exists)
      throw new AppError(
        "Email already exists"
      )

    const hashedPassword =
      await HashService.hash(
        data.password
      )

    const user =
      User.create({

        fullName: data.fullName,
        email: data.email,
        password: hashedPassword

      })

    const otp =
      OtpService.generate()
        console.log(otp)
        user.otp = otp

user.otpExpires =
  new Date(Date.now() + 5 * 60 * 1000)

    await this.userRepository.create(user)

    await MailService.sendOtp(
      data.email,
      otp
    )

    return {

      message:
        "OTP sent successfully"

    }

  }

}