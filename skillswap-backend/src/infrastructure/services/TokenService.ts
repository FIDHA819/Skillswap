import jwt from "jsonwebtoken"

export class TokenService {

  static generate(payload: any) {

    return jwt.sign(

      payload,

      process.env.JWT_SECRET!,

      { expiresIn: "1d" }

    )

  }

}