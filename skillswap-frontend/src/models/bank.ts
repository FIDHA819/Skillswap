export interface BankDetails {
  accountNumber: string;
  confirmAccountNumber: string;
  bankName: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  document?: File;
}
