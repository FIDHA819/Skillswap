import { IUserRepository }
from "../../domain/repositories/IUserRepository"

import { User }
from "../../domain/entities/User"

import { UserModel }
from "../database/models/UserModel"


export class UserRepositoryImpl implements IUserRepository {

  private userModel = UserModel

  private toDomain(userDoc: any): User {

    return new User(
      userDoc._id.toString(),
      userDoc.fullName,
      userDoc.email,
      userDoc.password,
      userDoc.isVerified,
      userDoc.otp ?? undefined,
      userDoc.otpExpires ?? undefined,
      userDoc.skillsToTeach ?? [],
      userDoc.skillsToLearn ?? [],
      userDoc.role ?? "learner",
      userDoc.profileCompleted ?? false
    )

  }

  async findById(userId: string): Promise<User | null> {

  const userDoc =
    await this.userModel.findById(userId)

  if (!userDoc) return null

  return this.toDomain(userDoc)

}

  async findByEmail(email: string): Promise<User | null> {

    const userDoc = await this.userModel.findOne({ email })

    if (!userDoc) return null

    return this.toDomain(userDoc)

  }

  async create(user: User): Promise<void> {

    await this.userModel.create(user)

  }

  async verifyUser(email: string): Promise<void> {

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
  ): Promise<void> {

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
  ): Promise<void> {

    await this.userModel.updateOne(
      { email },
      {
        password,
        otp: null,
        otpExpires: null
      }
    )

  }

  async updateSkills(
    email: string,
    skillsToTeach: string[],
    skillsToLearn: string[]
  ): Promise<void> {

    await this.userModel.updateOne(
      { email },
      {
        skillsToTeach,
        skillsToLearn
      }
    )

  }

  async updateProfileCompletion(
    email: string,
    completed: boolean
  ): Promise<void> {

    await this.userModel.updateOne(
      { email },
      {
        profileCompleted: completed
      }
    )

  }

  async switchRole(
    email: string,
    role: "learner" | "teacher"
  ): Promise<void> {

    await this.userModel.updateOne(
      { email },
      {
        role
      }
    )

  }

  async findSuggestedMatches(userId: string): Promise<User[]> {

    const currentUser = await this.userModel.findById(userId)

    if (!currentUser) return []

    const matches = await this.userModel.find({

      skillsToTeach: {
        $in: currentUser.skillsToLearn
      },

      _id: { $ne: userId }

    })

    return matches.map(this.toDomain)

  }

}