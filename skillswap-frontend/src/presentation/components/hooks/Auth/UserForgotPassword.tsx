import { AuthRepositoryImpl } from "../../../../infrastructure/repositories/AuthRepositoriesImpl"
const repo = new AuthRepositoryImpl()

export const useForgotPassword = () => {

  const requestReset = async (email) => {

    await repo.requestPasswordReset({ email })

  }

  return { requestReset }

}