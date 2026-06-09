import crypto from "crypto"

import { Profile }
from "../../../domain/Profile/entities/Profile"

import { IProfileRepository }
from "../../../domain/Profile/repositories/IProfileRepository"

import { IUserRepository }
from "../../../domain/repositories/IUserRepository"

export class CreateProfileUseCase{

constructor(

private profileRepository:
IProfileRepository,

private userRepository:
IUserRepository

){}

async execute(
data:any
){

const existing=

await this.profileRepository
.findByUserId(
data.userId
)

if(existing){

throw new Error(
"Profile already exists"
)

}

const user=

await this.userRepository
.findById(
data.userId
)

if(!user){

throw new Error(
"User not found"
)

}

console.log(
"USER FOUND →",
user.id
)

const profile: Profile = {
  id: crypto.randomUUID(),

  userId: String(data.userId),

  email: data.email || user.email,

  fullName: data.fullName || user.fullName,

  nickname: data.nickname || "",

  photoUrl: data.photoUrl || "",

  gender: data.gender,
  country: data.country,
  language: data.language,
  qualification: data.qualification,
  dob: data.dob,

  role: "learner",

  headline: "",
  bio: "",

  skillsToTeach: [],

  experienceYears: 0,
  hourlyRate: 0,

  availability: [],

  totalStudents: 0,
  totalSessions: 0,
  rating: 0,

  kycVerified: false,
  profileCompleted: true,
}
true



console.log(
"PROFILE TO SAVE →",
profile
)

const created=

await this.profileRepository
.create(
profile
)

/*
FIX HERE
DO NOT UPDATE BY EMAIL
*/

await this.userRepository
.updateProfileCompletion(

String(data.userId),

true

)

return created

}

}