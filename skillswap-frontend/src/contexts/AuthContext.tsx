import React,{
createContext,
useContext,
useEffect,
useState
}
from "react"

import {
userService,
type UserProfile
}
from "../services/userService"
import {
  authService
} from "../services/authService"

type AuthState={

loading:boolean

user:UserProfile|null

token:string|null

refresh:()=>Promise<void>

logout:()=>void

setAuth:(

token:string,

user:UserProfile

)=>void

updateUser:(

data:Partial<UserProfile>

)=>void

needsOtp:boolean

needsProfile:boolean

isAuthenticated:boolean

}

const AuthContext=
createContext<
AuthState
|
undefined
>(
undefined
)

export const AuthProvider=({

children

}:{

children:
React.ReactNode

})=>{

const [

token,

setToken

]=useState<
string
|
null
>(

localStorage.getItem(
"token"
)

)

const [

user,

setUser

]=useState<
UserProfile
|
null
>(null)

const [

loading,

setLoading

]=useState(
true
)

/*
━━━━━━━━━━━━━━
SET AUTH
━━━━━━━━━━━━━━
*/

const setAuth=(

newToken:string,

newUser:UserProfile

)=>{

localStorage.setItem(

"token",

newToken

)

setToken(
newToken
)

setUser(
newUser
)

}

/*
━━━━━━━━━━━━━━
UPDATE USER
━━━━━━━━━━━━━━
*/

const updateUser=(

data:Partial<UserProfile>

)=>{

setUser(

prev=>

prev

?

{

...prev,

...data

}

:

null

)

}

/*
━━━━━━━━━━━━━━
LOGOUT
━━━━━━━━━━━━━━
*/

const logout=()=>{

localStorage.removeItem(
"token"
)

localStorage.removeItem(
"user"
)

setToken(
null
)

setUser(
null
)

}

/*
━━━━━━━━━━━━━━
REFRESH
━━━━━━━━━━━━━━
*/

const refresh=
async()=>{

setLoading(
true
)

try{

const savedToken=

localStorage.getItem(
"token"
)

if(
!savedToken
){

setUser(
null
)

return

}

setToken(
savedToken
)

const profile=

await userService
.getProfile()

console.log(
"profile loaded",
profile
)

setUser(
profile
)

}

catch(
error:any
){

console.log(
"AUTH ERROR",
error
)

/*
NO PROFILE
FIRST LOGIN
*/

if (error?.response?.status === 404) {

  try {

    const currentUser =
      await authService.getCurrentUser()

    setUser({

      _id: currentUser.id,
      id: currentUser.id,
      userId: currentUser.id,

      fullName:
        currentUser.fullName || "",

      email:
        currentUser.email || "",

      nickname: "",

      photoUrl: "",

      gender: "",

      country: "",

      language: "",

      dob: "",

      qualification: "",

      profileCompleted:
        currentUser.profileCompleted ?? false,

      createdAt: "",

      updatedAt: "",

      isVerified:
        currentUser.isVerified ?? true,

      role:
        currentUser.role ?? "learner"

    })

    return

  } catch {

    logout()

    return
  }

}

logout()

}

finally{

setLoading(
false
)

}

}

/*
━━━━━━━━━━━━━━
AUTO REFRESH
━━━━━━━━━━━━━━
*/

useEffect(()=>{

refresh()

},[])

/*
━━━━━━━━━━━━━━
DERIVED
━━━━━━━━━━━━━━
*/

const needsOtp=

Boolean(
token
)&&

Boolean(
user
)&&

!user.isVerified

const needsProfile=

Boolean(
token
)&&

Boolean(
user
)&&

!user.profileCompleted

const isAuthenticated=

Boolean(
token
)&&

Boolean(
user
)

/*
━━━━━━━━━━━━━━
PROVIDER
━━━━━━━━━━━━━━
*/

return(

<AuthContext.Provider

value={{

loading,

user,

token,

refresh,

logout,

setAuth,

updateUser,

needsOtp,

needsProfile,

isAuthenticated

}}

>

{

children

}

</AuthContext.Provider>

)

}

/*
━━━━━━━━━━━━━━
HOOK
━━━━━━━━━━━━━━
*/

export const useAuth=()=>{

const ctx=

useContext(
AuthContext
)

if(
!ctx
){

throw new Error(

"useAuth must be used inside AuthProvider"

)

}

return ctx

}