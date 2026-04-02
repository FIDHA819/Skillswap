import type {
  AuthRepository,
  AuthResponse
} from "../../../domain/repositories/AuthRepository"

export class LoginUser {

  constructor(
    private repo: AuthRepository
  ) {}

  async execute(data): Promise<AuthResponse> {

    if (!data.email.includes("@")) {

      throw new Error(
        "Invalid email format"
      )

    }

    if (!data.password) {

      throw new Error(
        "Password required"
      )

    }

    return this.repo.login(data)

  }

}