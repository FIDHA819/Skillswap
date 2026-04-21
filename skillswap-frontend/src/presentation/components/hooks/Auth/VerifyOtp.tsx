import { useState } from "react"

import { VerifyOtp } from "../../../../application/useCase/Auth/VerifyOtp"
import { AuthRepositoryImpl } from "../../../../infrastructure/repositories/AuthRepositoriesImpl"

const repo = new AuthRepositoryImpl()
const verifyOtpUseCase = new VerifyOtp(repo)

export const useVerifyOtp = () => {

  const [loading, setLoading] = useState(false)

  const verifyOtp = async (data) => {

  setLoading(true)

  try {

    const res =
      await verifyOtpUseCase.execute(data)

    localStorage.setItem(
      "token",
      res.token
    )

    return true

  } catch (error: any) {

    throw new Error(

      error.response?.data?.message ||
      "Invalid OTP"

    )

  } finally {

    setLoading(false)

  }

}
  const resendOtp = async (data) => {
    

    return repo.resendOtp(data)

  }

  return {
    verifyOtp,
    resendOtp,
    loading
  }

}