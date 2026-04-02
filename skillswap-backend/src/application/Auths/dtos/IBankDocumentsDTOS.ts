export interface IBankDetailsDTO {
accountNumber: string;
  ifsc: string;
  bankName: string;
  proofUrl?: string;
  accountType: string;
  accountHolderName: string;
  verified?: boolean;
  userId:string;
}
