import {
  signupApi,
  loginApi,
  verifyOtpApi,
  resendOtpApi,
  forgotPasswordApi,
  resetPasswordApi
} from "../api/authapi"

import type {
  AuthRepository,
  AuthResponse,
} from "../../domain/repositories/AuthRepository"

export class AuthRepositoryImpl
implements AuthRepository {

  async signup(data) {

    const res =
      await signupApi(data)

    return res.data

  }

  async login(data) {

    try {

      const response =
        await loginApi(data)

      return response.data

    }

    catch (error: any) {

      throw new Error(

        error.response?.data?.message ||

        "Login failed"

      )

    }

  }

  async verifyOtp(data): Promise<AuthResponse> {

    const res =
      await verifyOtpApi(data)

    const body =
      res.data?.body || res.data

    const token =
      body?.data?.token ||
      body?.token ||
      ""

    const user =
      body?.data?.user ||
      body?.user ||
      {}

    return {

      token,

      user: {

        id:
          user?.id ||
          user?._id ||
          "",

        fullName:
          user?.fullName || "",

        email:
          user?.email ||
          data.email,

        role:
          user?.role ||
          "student",

      }

    }

  }

  async resendOtp(data) {

    const res =
      await resendOtpApi(data)

    return res.data

  }

  async requestPasswordReset(data) {

    await forgotPasswordApi(data)

  }

  async resetPassword(data) {

  await resetPasswordApi(data)

  }

}