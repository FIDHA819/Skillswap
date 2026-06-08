import { useState } from "react"

import { LoginUser }
from "../../../../application/useCase/Auth/LoginUser"

import { AuthRepositoryImpl }
from "../../../../infrastructure/repositories/AuthRepositoriesImpl"

import { useAuth }
from "../../../../contexts/AuthContext"

const repo =
new AuthRepositoryImpl()

const loginUserUseCase =
new LoginUser(repo)

interface LoginData {

email: string

password: string

}

type LoginResult = {

success: boolean

user?: {

id: string

email: string

profileCompleted?: boolean

isVerified?: boolean

role?: string

}

}

export const useLogin = () => {

const [
loading,
setLoading
]=useState(false)

const [
error,
setError
]=useState<
string | null
>(null)

const {
setAuth
}=useAuth()

const login =
async(
data: LoginData
): Promise<LoginResult> => {

setLoading(true)

setError(null)

try{

const result =
await loginUserUseCase
.execute(
data
)

if(
!result?.token ||
!result?.user
){

throw new Error(
"Invalid login response"
)

}

setAuth(

result.token,

result.user

)

return {

success:true,

user:
result.user

}

}

catch(
err:any
){

setError(

err?.message ||

"Login failed"

)

return {

success:false

}

}

finally{

setLoading(
false
)

}

}

return {

login,

loading,

error

}

}