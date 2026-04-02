import { IBankDetailsDTO } from "../../dtos/IBankDocumentsDTOS";
import { IUserRepository } from "../../repositories/IUserRepository";

export class UpdateBankDetailsUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, updatedData: Partial<IBankDetailsDTO>) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.bankDetails) {
      throw new Error("Bank details not found");
    }

    user.bankDetails = {
      ...user.bankDetails,
      ...updatedData,
      userId, 
    };

    const updatedUser = await this.userRepo.update(user);
    return updatedUser.bankDetails;
  }
}
