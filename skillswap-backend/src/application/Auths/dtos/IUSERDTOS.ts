// src/application/Auth/dtos/IUserDTOs.ts

export interface IUserBaseDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
}

export interface IUserCreateDTO {
  fullName: string;
  email: string;
  password: string;
  role?: string;
}

export interface IUserUpdateDTO {
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

export interface IUserResponseDTO extends IUserBaseDTO {
  createdAt: Date;
  updatedAt: Date;
}
