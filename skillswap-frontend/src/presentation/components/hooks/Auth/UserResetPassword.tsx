import { AuthRepositoryImpl } from "../../../../infrastructure/repositories/AuthRepositoriesImpl"

const repo = new AuthRepositoryImpl()

export const useResetPassword = () => {

  const resetPassword = async (data) => {

    await repo.resetPassword(data)

  }

  return { resetPassword }

}