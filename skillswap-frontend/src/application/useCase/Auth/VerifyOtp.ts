import type {
  AuthRepository,
  AuthResponse
} from "../../../domain/repositories/AuthRepository"

export class VerifyOtp {

  constructor(private repo: AuthRepository) {}

  async execute(data): Promise<AuthResponse> {

    if (!data.otp || data.otp.length !== 6) {
      throw new Error("Invalid OTP format")
    }

    return this.repo.verifyOtp(data)

  }

}