import { IUserRepository } from "../../repositories/IUserRepository";
import { KYCStatus } from "../../../../domain/Auth/enums/user-role.enum";

export class UpdateKYCStatusForAdminUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, status: "approved" | "rejected") {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    if (!user.kyc) throw new Error("User has no KYC");

    if (status === "approved") {
      user.kyc.approve();
    } else if (status === "rejected") {
      user.kyc.reject();
    }

    return this.userRepo.update(user);
  }
}
