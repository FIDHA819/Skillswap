export interface IKYCDocumentDTO {
  name: string;
  url: string;
  idType: string;
  idNumber: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}



