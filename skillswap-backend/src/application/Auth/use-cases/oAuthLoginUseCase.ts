import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

import { TokenService }
from "../../../infrastructure/services/TokenService"

export class OAuthLoginUseCase {

  constructor(
    private userRepo: IUserRepository
  ) {}

  async execute(email: string) {

    let user =
      await this.userRepo.findByEmail(email)

    // if user doesn't exist → create user automatically
    if (!user) {

      await this.userRepo.create({

        email,
        fullName: "OAuth User",
        password: "",
        isVerified: true

      })

    }

    const token =
      TokenService.generate({ email })

    return token

  }

}