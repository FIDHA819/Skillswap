import { IUserRepository } from "../../repositories/IUserRepository";
import { IOTPService } from "../../../../infrastructure/services/OTPService";
import { IJWTService } from "../../../../infrastructure/services/IJWTService";
import { VerifyOtpRequestDTO } from "../../dtos/IAUTHDTOS";

export class VerifyOtpUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpService: IOTPService,
    private jwtService: IJWTService
  ) {}

  async execute(body: VerifyOtpRequestDTO): Promise<{ token: string; user: any }> {
    console.log("🔹 Email:", body.email);
console.log("🔹 OTP:", body.otp);

const user = await this.userRepo.findByEmail(body.email);
console.log("🔹 Found user:", user);

const isValid = await this.otpService.verifyOTP(body.email, body.otp);
console.log("🔹 OTP valid:", isValid);

await this.userRepo.update(user._id.toString(), { isVerified: true, status: "active" });

const refreshedUser = await this.userRepo.findByEmail(body.email);
console.log("🔹 Refreshed user:", refreshedUser);

const payload = {
  id: refreshedUser?._id?.toString(),
  email: refreshedUser?.email,
  fullName: refreshedUser?.fullName,
  role: refreshedUser?.role,
  isVerified: refreshedUser?.isVerified,
};

const token = this.jwtService.sign(payload);
console.log("🔹 Generated token:", token);

return { token, user: payload };

  }
}
