import { Request, Response }
from "express"

import { UserRepositoryImpl }
from "../../infrastructure/repositories/UserRepositoryImpl"

import { RegisterUserUseCase }
from "../../application/Auth/use-cases/RegisterUseCase"

import { VerifyOtpUseCase } from "../../application/Auth/use-cases/VerifyOtpUseCase"

import { ResendOtpUseCase } from "../../application/Auth/use-cases/ResendOtpUseCase"
import { LoginUserUseCase } from "../../application/Auth/use-cases/LoginUseCase"
import { ForgotPasswordUseCase }   
from "../../application/Auth/use-cases/ForgotPasswordUseCase"
import { OAuthLoginUseCase }
from "../../application/Auth/use-cases/oAuthLoginUseCase"

import { ResetPasswordUseCase }   
from "../../application/Auth/use-cases/ResetPasswordUseCase"
import { GetCurrentUserUseCase } from "../../application/Auth/GetCurrentUserUseCase"



import { AppError } from "../../core/errors/AppError"
import { AuthRequest} from "../../types/AuthRequest"


export class AuthController {

  static async register(req: Request, res: Response) {

    try {

      const repo = new UserRepositoryImpl()

      const useCase =
        new RegisterUserUseCase(repo)

      const result =
        await useCase.execute(req.body)

      return res.status(200).json(result)

    } catch (error: any) {

      console.error(error)

      if (error instanceof AppError) {
        return res.status(error.status).json({
          message: error.message
        })
      }

      return res.status(500).json({
        message: "Signup failed"
      })

    }

  }

  static async verifyOtp(req: Request, res: Response) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new VerifyOtpUseCase(repo)

    const result =
      await useCase.execute({

        email: req.body.email,

        otp: req.body.otp,

        mode: req.query.mode as "signup" | "reset"

      })

    return res.status(200).json(result)

  } catch (error: any) {

    console.error(error)

    return res.status(
      error.status || 500
    ).json({

      message:
        error.message ||
        "Failed to verify OTP"

    })

  }

}
 static async resendOtp(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new ResendOtpUseCase(repo)

    const result =
      await useCase.execute({

        email: req.body.email,

        mode: req.query.mode as "signup" | "reset"

      })

    return res.status(200).json(result)

  } catch (error: any) {

    console.error(error)

    return res.status(
      error.status || 500
    ).json({

      message:
        error.message ||
        "Failed to resend OTP"

    })

  }

}


static async login(req: Request, res: Response) {

  try {

    const repo = new UserRepositoryImpl()

    const useCase =
      new LoginUserUseCase(repo)

    const result =
      await useCase.execute(req.body)

    return res.status(200).json(result)

  } catch (error: any) {

    console.error(error)

    return res.status(
      error.status || 500
    ).json({

      message:
        error.message ||
        "Login failed"

    })

  }

}
static async me(req: Request, res: Response) {

  try {

    const userId =
      (req as AuthRequest).user?.id

    if (!userId) {

      return res.status(401).json({
        message: "Unauthorized"
      })

    }

    const repo = new UserRepositoryImpl()

    const useCase =
      new GetCurrentUserUseCase(repo)

    const user =
      await useCase.execute(userId)

    return res.json(user)

  }

  catch (error) {

    console.error(error)

    return res.status(500).json({
      message: "Failed to fetch user"
    })

  }

}
static async requestPasswordReset(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new ForgotPasswordUseCase(repo)

    const result =
      await useCase.execute(req.body)

    return res.status(200).json(result)

  }

  catch (error: any) {

    console.error(error)

    return res.status(
      error.status || 500
    ).json({

      message:
        error.message ||
        "Failed to send reset email"

    })

  }

}
static async resetPassword(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new ResetPasswordUseCase(repo)

    const result =
      await useCase.execute(req.body)

    return res.status(200).json(result)

  }

  catch (error: any) {

    console.error(error)

    return res.status(
      error.status || 500
    ).json({

      message:
        error.message ||
        "Password reset failed"

    })

  }

}

static async googleCallback(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new OAuthLoginUseCase(repo)

    const email =
      (req.user as any).email

    const token =
      await useCase.execute(email)

    return res.redirect(

      `http://localhost:5173/oauth-success?token=${token}`

    )

  }

  catch (error) {

    return res.redirect(

      "http://localhost:5173/login"

    )

  }

}
static async githubCallback(
  req: Request,
  res: Response
) {

  try {

    const repo =
      new UserRepositoryImpl()

    const useCase =
      new OAuthLoginUseCase(repo)

    const email =
      (req.user as any).email

    const token =
      await useCase.execute(email)

    return res.redirect(

      `http://localhost:5173/oauth-success?token=${token}`

    )

  }

  catch (error) {

    return res.redirect(

      "http://localhost:5173/login"

    )

  }

}
}