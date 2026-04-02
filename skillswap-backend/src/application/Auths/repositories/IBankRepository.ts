import { BankEntity } from "../../../domain/entities/bank.entity";

export interface IBankRepository {
  addBankDetails(bankDetails: BankEntity): Promise<BankEntity>;
  getByUser(userId: string): Promise<BankEntity | null>;
  updateBankDetails(bankDetails: BankEntity): Promise<BankEntity>;
}
