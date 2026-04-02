export class User {

  constructor(
    public fullName: string,
    public email: string,
    public password: string,
    public isVerified: boolean = false,
    public otp?: string,
    public otpExpires?: Date
  ) {}

  static create(data: {
    fullName: string
    email: string
    password: string
  }) {

    return new User(
      data.fullName,
      data.email,
      data.password,
      false
    )

  }

}