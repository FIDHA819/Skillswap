import { IUserRepository } from "../../repositories/IUserRepository";
import { IOTPService } from "../../../../infrastructure/services/OTPService";
import { IEmailService } from "../../../../infrastructure/services/MailService";
import { ResendOtpRequestDTO, ResendOtpResponseDTO } from "../../dtos/IAUTHDTOS";

export class ResendOtpUseCase {
  constructor(
    private userRepo: IUserRepository,
    private otpService: IOTPService,
    private emailService: IEmailService
  ) {}

  async execute(body: ResendOtpRequestDTO): Promise<ResendOtpResponseDTO> {
    const user = await this.userRepo.findByEmail(body.email);
    if (!user) throw new Error("User not found");

    const otp = await this.otpService.sendOTP(body.email);
    await this.emailService.sendEmail(
      body.email,
      "Your OTP Code",
      `<p>Hello ${user.fullName},</p><p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
    );

    return { message: "OTP resent successfully", email: body.email };
  }
}
