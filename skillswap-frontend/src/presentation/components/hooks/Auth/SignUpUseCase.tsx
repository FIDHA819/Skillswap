import { useState } from "react"
import { RegisterUser } from "../../../../application/useCase/Auth/RegisterUser"
import { AuthRepositoryImpl } from "../../../../infrastructure/repositories/AuthRepositoriesImpl"

const repo =
  new AuthRepositoryImpl()

const registerUserUseCase =
  new RegisterUser(repo)

export const useSignup = () => {
  const [loading, setLoading] =
    useState(false)

  const signup = async (data) => {
    setLoading(true)

    try {
      await registerUserUseCase.execute(
        data
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    signup,
    loading,
  }
}