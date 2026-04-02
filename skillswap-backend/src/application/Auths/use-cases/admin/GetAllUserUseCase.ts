import { IUserRepository } from "../../repositories/IUserRepository";

export class GetAllUsersForAdminUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute() {
    return this.userRepo.findAll();
  }
}
