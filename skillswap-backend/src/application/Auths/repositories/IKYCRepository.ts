import { KYCEntity } from "../../../domain/entities/kyc.entity";

export interface IKYCRepository {
  submitKYC(userId: string, documents: KYCEntity[]): Promise<KYCEntity[]>;
  getByUser(userId: string): Promise<KYCEntity[]>;
  updateDocument(document: KYCEntity): Promise<KYCEntity>;
}
