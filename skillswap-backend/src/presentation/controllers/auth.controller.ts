import { Request, Response }
from "express"

import { UserRepositoryImpl }
from "../../infrastructure/repositories/UserRepositoryImpl"

import { RegisterUserUseCase }
from "../../application/Auth/use-cases/RegisterUseCase"

import { VerifyOtpUseCase } from "../../application/Auth/use-cases/VerifyOtpUseCase"

export class AuthController {

  static async register(
    req: Request,
    res: Response
  ) {

    try {

      const repo = new UserRepositoryImpl()

      const useCase =
        new RegisterUserUseCase(repo)

      const result =
        await useCase.execute(req.body)

      res.status(200).json(result)

    } catch (error) {

      console.error(error)

      res.status(500).json({
        message: "Signup failed"
      })

    }

  }
  static async verifyOtp(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new VerifyOtpUseCase(repo)

    const result =
      await useCase.execute(req.body)

    return res.status(200).json(result)

  } catch (error) {

    console.error(error)

    return res.status(400).json({
      message: "OTP verification failed"
    })

  }

}

}