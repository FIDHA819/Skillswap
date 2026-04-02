// src/application/Auth/dtos/IAUTHDTOS.ts

export interface SignupRequestDTO {
  email: string;
  fullName: string;
  password: string;
}

export interface SignupResponseDTO {
  message: string;
  email: string;
}

export interface VerifyOtpRequestDTO {
  email: string;
  otp: string;
}

export interface VerifyOtpResponseDTO {
  message: string;
  email: string;
}

export interface ResendOtpRequestDTO {
  email: string;
}

export interface ResendOtpResponseDTO {
  message: string;
  email: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
