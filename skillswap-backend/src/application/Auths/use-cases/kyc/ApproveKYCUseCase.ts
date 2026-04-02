import { IUserRepository } from "../../repositories/IUserRepository";

export class ApproveKYCUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
   if (!user.kyc) throw new Error("KYC not submitted");

   user.kyc.approve()
    return this.userRepo.update(user);
  }
}


