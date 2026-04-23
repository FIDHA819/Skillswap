export type UserRole = "learner" | "teacher"

export class User {

  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public password: string,
    public isVerified: boolean = false,
    public otp?: string,
    public otpExpires?: Date,

    // dashboard-related fields
    public skillsToTeach: string[] = [],
    public skillsToLearn: string[] = [],

    public role: UserRole = "learner",

    // onboarding tracking
    public profileCompleted: boolean = false
  ) {}

  static create(data: {
    fullName: string
    email: string
    password: string
  }) {

    return new User(
      "",
      data.fullName,
      data.email,
      data.password,
      false,
      undefined,
      undefined,
      [],
      [],
      "learner",
      false
    )

  }

}