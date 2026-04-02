import { UserEntity } from "../../../../domain/entities/user.entities";
import { IUserRepository } from "../../repositories/IUserRepository";

export class GetAllUsersUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string, profileData: Partial<UserEntity>) {
   
    return this.userRepo.findAll();
  }
}
