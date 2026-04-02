import nodemailer from "nodemailer"

export class MailService {

  static async sendOtp(
    email: string,
    otp: string
  ) {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS

        }

      })

    await transporter.sendMail({

      to: email,

      subject: "OTP Verification",

      text: `Your OTP is ${otp}`

    })

  }

}