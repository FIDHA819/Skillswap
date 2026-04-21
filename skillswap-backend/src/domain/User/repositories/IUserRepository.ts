import { User } from "../entities/User"



export interface IUserRepository {

  findByEmail(email: string): Promise<User | null>
  

  create(user: User): Promise<void>

  verifyUser(email: string): Promise<void>

  updateOtp(
    email: string,
    otp: string,
    expiry: Date
  ): Promise<void>

   updatePassword(   // ✅ ADD THIS
    email: string,
    password: string
  ): Promise<void>

}