// src/application/Auth/repositories/IUserRepository.ts
import {
  IUserCreateDTO,
  IUserUpdateDTO,
  IUserResponseDTO,
} from "../dtos/IUSERDTOS";

export interface IUserRepository {
  create(userData: IUserCreateDTO): Promise<IUserResponseDTO>;

  findByEmail(email: string): Promise<IUserResponseDTO | null>;

  findById(id: string): Promise<IUserResponseDTO | null>;

  update(id: string, updateData: IUserUpdateDTO): Promise<IUserResponseDTO | null>;

  findAll(): Promise<IUserResponseDTO[]>;
}
