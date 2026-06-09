import { Response } from "express"

import { CreateProfileUseCase }
from "../../application/profile/UseCase/CreateProfileUseCase"

import { ProfileRepositoryImpl }
from "../../infrastructure/repositories/ProfileRepositoryImpl"

import { UserRepositoryImpl }
from "../../infrastructure/repositories/UserRepositoryImpl"
import { MailService }
from "../../infrastructure/services/MailService"

import { OtpService }
from "../../infrastructure/services/OTPService"

import { EmailOtpStore }
from "../../infrastructure/services/OTPStore"

const profileRepo =
new ProfileRepositoryImpl()

const userRepo =
new UserRepositoryImpl()

const createProfileUseCase =
new CreateProfileUseCase(

profileRepo,

userRepo

)

export class ProfileController {

static async create(
req:any,
res:Response
){

try{

const userId =
req.user.id

const photoUrl =
req.file?.path

const profile =

await createProfileUseCase
.execute({

...req.body,

userId,

photoUrl

})

return res
.status(201)
.json(profile)

}

catch(error:any){

console.log(
"PROFILE ERROR:",
error
)

return res
.status(500)
.json({

message:

error.message ||

"Profile creation failed"

})

}

}

static async me(req: any, res: Response) {
  try {
    const userId = req.user.id
    const profileRepo = new ProfileRepositoryImpl()
    const userRepo = new UserRepositoryImpl()

    let profile = await profileRepo.findByUserId(userId)  // was: repo.findByUserId

    if (!profile) {
      const createProfileUseCase = new CreateProfileUseCase(profileRepo, userRepo)
      profile = await createProfileUseCase.execute({ userId })
    }

    return res.status(200).json(profile)
  } catch (error) {
    console.log("ME ERROR", error)
    return res.status(500).json({ message: "Server error" })
  }
}


/*
━━━━━━━━━━━━━━
CHANGE EMAIL
━━━━━━━━━━━━━━
*/

static async changeEmail(
req:any,
res:Response
){

try{

const { email }=
req.body

if(!email){

return res.status(400).json({
message:"Email required"
})

}

const otp=
OtpService.generate()

console.log(
"GENERATED OTP",
otp
)

await MailService.sendOtp(
email,
otp
)

EmailOtpStore.save(

req.user.id,

email,

otp

)

return res.status(200).json({

message:
"OTP sent successfully"

})

}

catch(error:any){

console.log(
"CHANGE EMAIL ERROR",
error
)

return res.status(500).json({

message:
error.message

})

}

}

static async verifyEmail(
req:any,
res:Response
){

try{

const {

email,
otp

}=req.body

if(!otp){

return res.status(400).json({

message:
"OTP required"

})

}

/*
OTP VALIDATION
*/

const user=

await userRepo.findById(
req.user.id
)

if(!user){

return res.status(404).json({

message:
"User not found"

})

}

if(

user.otp!==otp

||

!user.otpExpires

||

new Date()>

user.otpExpires

){

return res.status(400).json({

message:
"Invalid or expired OTP"

})

}

/*
UPDATE BOTH
*/

await profileRepo.updateEmail(

req.user.id,

email

)

await userRepo.updateEmail(

req.user.id,

email

)

/*
CLEAR OTP
*/

await userRepo.update(

req.user.id,

{

otp:null,

otpExpires:null

}

)

return res.status(200).json({

message:
"Email updated",

email

})

}

catch(error){

console.log(error)

return res.status(500).json({

message:
"Verification failed"

})

}

}

/*
━━━━━━━━━━━━━━
UPDATE PROFILE
━━━━━━━━━━━━━━
*/

static async update(
req:any,
res:Response
){

try{

const repo=

new ProfileRepositoryImpl()

const updated=

await repo.update(

req.user.id,

{

...req.body,

photoUrl:

req.file?.path

||

undefined

}

)

if(
!updated
){

return res
.status(404)
.json({

message:
"Profile not found"

})

}

return res
.status(200)
.json(
updated
)

}

catch(error){

console.log(
"UPDATE ERROR",
error
)

return res
.status(500)
.json({

message:
"Update failed"

})

}

}
static async verifyEmail(
req:any,
res:Response
){

try{

const {

email,
otp

}=req.body
console.log(otp)
/*
temporary
replace later
with real OTP validation
*/

if(!otp){

return res
.status(400)
.json({

message:
"OTP required"

})

}

/*
update profile email
*/

const repo=
new ProfileRepositoryImpl()

await repo.updateEmail(

req.user.id,

email

)

return res
.status(200)
.json({

message:
"Email updated"

})

}

catch(error:any){

console.log(
"VERIFY EMAIL ERROR",
error
)

return res
.status(500)
.json({

message:
"Email verification failed"

})

}

}

static async teacherProfile(
  req:any,
  res:Response
){

  try{

    const repo=
    new ProfileRepositoryImpl()

    const profile=
    await repo.findByUserId(
      req.user.id
    )

    return res.json(profile)

  }

  catch(error){

    return res
    .status(500)
    .json({
      message:"Server Error"
    })

  }

}

static async updateTeacherProfile(
  req:any,
  res:Response
){

  try{

    const repo=
    new ProfileRepositoryImpl()

    const profile=

    await repo.updateTeacherProfile(

      req.user.id,

      req.body

    )

    return res.json(profile)

  }

  catch(error){

    return res
    .status(500)
    .json({

      message:
      "Update Failed"

    })

  }

}
}






