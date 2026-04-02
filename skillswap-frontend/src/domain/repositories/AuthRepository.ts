export interface AuthRepository {
  signup(data: {
    fullName: string
    email: string
    password: string
    role: string
  }): Promise<any>

  login(data: {
    email: string
    password: string
  }): Promise<AuthResponse>

  verifyOtp(data: {
    email: string
    otp: string
  }): Promise<AuthResponse>

  resendOtp(data: {
    email: string
  }): Promise<any>

  requestPasswordReset(data): Promise<void>

resetPassword(data): Promise<void>
}

export interface AuthResponse {
  token: string

  user: {
    id: string
    fullName: string
    email: string
    role: "student" | "teacher" | "admin"
  }
}