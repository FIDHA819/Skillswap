import axios from "axios"

export type UserProfile = {

_id:string

id:string

userId:string

email:string

fullName:string

nickname:string

photoUrl?:string

gender:string

country:string

language:string

dob:string

qualification:string

profileCompleted:boolean

createdAt:string

updatedAt:string

isVerified?:boolean

role?:"learner"|"teacher"

}

const API =
"http://localhost:5000"

export const userService = {

async getProfile():
Promise<UserProfile>{

const token =
localStorage.getItem(
"token"
)

if(!token){

throw new Error(
"No token found"
)

}

console.log(
"Sending token:",
token
)

const res =
await axios({

method:"GET",

url:
`${API}/profile/me`,

headers:{

Authorization:
`Bearer ${token}`,

Accept:
"application/json"

}

})

console.log(
"profile response:",
res.data
)

const profile =
res.data

return{

_id:profile._id,

id:profile.id,

userId:profile.userId,

email:profile.email,

fullName:profile.fullName,

nickname:profile.nickname,

photoUrl:
profile.photoUrl
? `${API}/${profile.photoUrl.replace(/\\/g,"/")}`
:undefined,

gender:profile.gender,

country:profile.country,

language:profile.language,

dob:profile.dob,

qualification:profile.qualification,

profileCompleted:
Boolean(
profile.profileCompleted
),

createdAt:
profile.createdAt,

updatedAt:
profile.updatedAt,

isVerified:
profile.isVerified,

role:
"learner"

}

}

}