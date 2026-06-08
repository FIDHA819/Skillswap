import { ProfileModel }
from "../database/models/ProfileModel"

import type { Profile }
from "../../domain/Profile/entities/Profile"

import { IProfileRepository }
from "../../domain/Profile/repositories/IProfileRepository"

export class ProfileRepositoryImpl
implements IProfileRepository{

async create(
profile:Profile
):Promise<Profile>{

const saved=

await ProfileModel
.create(profile)

return this.toDomain(
saved
)

}

async findByUserId(
userId:string
):Promise<Profile|null>{

const doc=

await ProfileModel
.findOne({

userId:
String(userId)

})

if(
!doc
){

return null

}

return this.toDomain(
doc
)

}
async update(
userId:string,
data:any
):Promise<Profile|null>{

const updated=

await ProfileModel.findOneAndUpdate(

{
userId
},

{

$set:{

...data

}

},

{

new:true

}

)

if(
!updated
){

return null

}

return this.toDomain(
updated
)

}
/*
UPDATE PROFILE EMAIL
*/

async updateEmail(

userId:string,

email:string

):Promise<any>{

return await ProfileModel
.findOneAndUpdate(

{

userId

},

{

email

},

{

new:true

}

)

}
async updateEmail(

userId:string,

email:string

){

return await ProfileModel.findOneAndUpdate(

{

userId

},

{

email

},

{

new:true

}

)

}
async updateTeacherProfile(

  userId:string,

  data:any

){

  return await ProfileModel.findOneAndUpdate(

    {userId},

    {$set:data},

    {new:true}

  )

}

/*
━━━━━━━━━━
MAPPER
━━━━━━━━━━
*/

private toDomain(doc:any): Profile {

  return {

    id: doc.id,

    userId: doc.userId,

    email: doc.email,

    fullName: doc.fullName,

    nickname: doc.nickname,

    photoUrl: doc.photoUrl,

    gender: doc.gender,

    country: doc.country,

    language: doc.language,

    qualification: doc.qualification,

    dob: doc.dob,

    role: doc.role || "learner",

    headline: doc.headline,

    bio: doc.bio,

    skillsToTeach: doc.skillsToTeach || [],

    experienceYears: doc.experienceYears || 0,

    hourlyRate: doc.hourlyRate || 0,

    availability: doc.availability || [],

    totalStudents: doc.totalStudents || 0,

    totalSessions: doc.totalSessions || 0,

    rating: doc.rating || 0,

    kycVerified: doc.kycVerified || false,

    profileCompleted: doc.profileCompleted || false

  }

}

}