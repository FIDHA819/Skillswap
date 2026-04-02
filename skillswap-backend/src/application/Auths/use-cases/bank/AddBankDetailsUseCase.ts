import { IBankDetailsDTO } from "../../dtos/IBankDocumentsDTOS";
import { IUserRepository } from "../../repositories/IUserRepository";

export class AddBankDetailsUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, bankData: IBankDetailsDTO) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");
  user.bankDetails = {
      ...bankData,
      userId,
      verified: bankData.verified ?? false,
    };
    return this.userRepo.update(user);
  }
}

