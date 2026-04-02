import { IUserRepository }
from "../../domain/User/repositories/IUserRepository"

import { User }
from "../../domain/User/entities/User"

import { UserModel }
from "../database/models/UserModel"

export class UserRepositoryImpl
implements IUserRepository {

  async findByEmail(email: string)
  : Promise<User | null> {

    const user =
      await UserModel.findOne({ email })

    if (!user) return null

    return new User(
  user.fullName,
  user.email,
  user.password,
  user.isVerified,
  user.otp,
  user.otpExpires
)
  }

  async create(user: User)
  : Promise<void> {

    await UserModel.create(user)

  }
  async verifyUser(email: string)
: Promise<void> {

  await UserModel.updateOne(

    { email },

    {

      isVerified: true,
      otp: null,
      otpExpires: null

    }

  )

}

}