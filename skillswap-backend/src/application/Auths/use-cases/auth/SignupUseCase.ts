import { IUserRepository } from "../../repositories/IUserRepository";
import { IPasswordHasher } from "../../../../infrastructure/services/IPasswordHasher";
import { IEmailService } from "../../../../infrastructure/services/MailService";
import { IOTPService } from "../../../../infrastructure/services/OTPService";
import { SignupRequestDTO, SignupResponseDTO } from "../../dtos/IAUTHDTOS";
import { Role, UserStatus } from "../../../../domain/Auth/enums/user-role.enum";

export class SignupUseCase {
  constructor(
    private userRepo: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private emailService: IEmailService,
    private otpService: IOTPService
  ) {}

  async execute(body: SignupRequestDTO): Promise<SignupResponseDTO> {
    const existingUser = await this.userRepo.findByEmail(body.email);
    if (existingUser) throw new Error("Email already registered");

    const hashedPassword = await this.passwordHasher.hash(body.password);

    const createdUser = await this.userRepo.create({
      email: body.email,
      fullName: body.fullName,
      password: hashedPassword,
      role: Role.STUDENT,               // Set internally
      status: UserStatus.PENDING,       // Set internally
    });

    const otp = await this.otpService.sendOTP(body.email);
    await this.emailService.sendEmail(
      body.email,
      "Your OTP Code",
      `<p>Hello ${body.fullName},</p><p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
    );

    return {
      message: "Signup successful. OTP sent to email.",
      email: body.email,
    };
  }
}
