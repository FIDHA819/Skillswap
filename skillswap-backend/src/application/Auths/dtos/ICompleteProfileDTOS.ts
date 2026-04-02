export interface CompleteProfileRequestDTO {
  userId: string;
  profilePhoto?: string;
  nickname?: string;
  gender?: string;
  birthday?: Date;
  country?: string;
  language?: string;
  skillsToLearn?: string[];
}

export interface CompleteProfileResponseDTO {
  success: boolean;
  message: string;
}
