import { useState } from "react"

import { LoginUser } from "../../../../application/useCase/Auth/LoginUser"

import { AuthRepositoryImpl } from "../../../../infrastructure/repositories/AuthRepositoriesImpl"

import { saveToken } from "../../../../infrastructure/storage/tokenStorage"

const repo = new AuthRepositoryImpl()

const loginUserUseCase = new LoginUser(repo)

export const useLogin = () => {

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const login = async (data) => {

    setLoading(true)

    setError(null)

    try {

      const result =
        await loginUserUseCase.execute(data)

      saveToken(result.token)

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      )

      return true

    } catch (err: any) {

      setError(
        err.message || "Login failed"
      )

      return false

    } finally {

      setLoading(false)

    }

  }

  return {

    login,

    loading,

    error

  }

}