export interface KycDetails {
  fullName: string;
  dob: string;
  panOrTaxId: string;
  govIdNumber: string;
  address: string;
  email: string;
  phone: string;
  idFront?: File;
  idBack?: File;
}
