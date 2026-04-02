import { IUserRepository } from "../../repositories/IUserRepository";
import { IJWTService } from "../../../../infrastructure/services/IJWTService";
import { IPasswordHasher } from "../../../../infrastructure/services/IPasswordHasher";

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private jwtService: IJWTService,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(body: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(body.email);
    if (!user) throw new Error("User not found");

    const valid = await this.passwordHasher.compare(body.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = this.jwtService.sign({ id: user._id.toString(), role: user.role }, "15m");
    const refreshToken = this.jwtService.sign({ id: user._id.toString() }, "7d");

    return {
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
