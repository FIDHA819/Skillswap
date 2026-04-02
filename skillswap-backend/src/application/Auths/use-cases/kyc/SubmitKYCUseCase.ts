import { IUserRepository } from "../../repositories/IUserRepository";
import { IFileUploader } from "../../../../infrastructure/services/IFileUploader";
import { KYCEntity } from "../../../../domain/Auth/entities/kyc.entity";
import { IKYCDocumentDTO } from "../../dtos/IKYCDocumentDTOS";
import { KYCStatus } from "../../../../domain/Auth/enums/user-role.enum";

export class SubmitKYCUseCase {
  constructor(
    private userRepo: IUserRepository,
    private fileService: IFileUploader
  ) {}

  async execute(userId: string, files: Express.Multer.File[]): Promise<KYCEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("User not found");

    const documents: IKYCDocumentDTO[] = [];
    for (const file of files) {
      const url = await this.fileService.uploadBuffer(file.buffer, file.originalname, "kyc");
      documents.push({
        name: file.originalname,
        url,
        idType: "",
        idNumber: "", 
        status: KYCStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    
    const kyc = user.kyc
      ? new KYCEntity(userId, user.kyc.documents, user.kyc.status)
      : new KYCEntity(userId, []); 

    documents.forEach(doc => kyc.updateDocument(doc));
    user.kyc = kyc;

    await this.userRepo.update(user);

    return kyc;
  }
}
