import { IUserRepository }
from "../../domain/User/repositories/IUserRepository"

import { User }
from "../../domain/User/entities/User"

import { UserModel }
from "../database/models/UserModel"

export class UserRepositoryImpl
implements IUserRepository {

  private userModel = UserModel

  private toDomain(userDoc: any): User {

    return new User(
      userDoc._id.toString(),
      userDoc.fullName,
      userDoc.email,
      userDoc.password,
      userDoc.isVerified,
      userDoc.otp ?? undefined,
      userDoc.otpExpires ?? undefined

    )

  }

  async findByEmail(email: string): Promise<User | null> {

    const userDoc =
      await this.userModel.findOne({ email })

    if (!userDoc) return null

    return this.toDomain(userDoc)

  }

  async create(user: any) {

    await this.userModel.create(user)

  }

  async verifyUser(email: string) {

    await this.userModel.updateOne(

      { email },

      {

        isVerified: true,
        otp: null,
        otpExpires: null

      }

    )

  }

  async updateOtp(

    email: string,
    otp: string,
    expiry: Date

  ) {

    await this.userModel.updateOne(

      { email },

      {

        otp,
        otpExpires: expiry

      }

    )

  }
  
  async updatePassword(
  email: string,
  password: string
) {

  await this.userModel.updateOne(

    { email },

    {

      password,
      otp: null,
      otpExpires: null

    }

  )

}

}