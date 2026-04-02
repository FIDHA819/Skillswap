
export type Skill = { skillName: string; mode?: "free" | "paid" };

export type BankDetails = { bankName: string; accountNumber: string; ifsc: string; documentUrl?: string };

export type Profile = {
  fullName: string;
  nickname: string;
  gender: string;
  country: string;
  language: string;
  birthday: string;
  photo?: File | string;
  skillsToLearn: Skill[];
  skillsToTeach: Skill[];
  bankDetails?: BankDetails;
  kycStatus?: "pending" | "approved" | "rejected";
};
