import express from "express"

import { AuthController }
from "../controllers/auth.controller"
import passport from '../../infrastructure/services/Passport'
import { authMiddleware } from "../middleware/auth.middleware"

const router = express.Router()

router.post(
  "/signup",
  AuthController.register
)
router.post(
  "/verify-otp",
  AuthController.verifyOtp
)
router.post("/resend-otp", AuthController.resendOtp)

router.post(
  "/login",
  AuthController.login
)
router.post(
  "/forgot-password",
  AuthController.requestPasswordReset
)

router.post(
  "/reset-password",
  AuthController.resetPassword
)
router.get(

  "/auth/google",

  passport.authenticate(
    "google",
    {
      scope: ["profile", "email"]
    }
  )

)

router.get(

  "/auth/google/callback",

  passport.authenticate(
    "google",
    { session: false }
  ),

  AuthController.googleCallback

)
router.get(

  "/auth/github",

  passport.authenticate(
    "github",
    { scope: ["user:email"] }

  )

)


router.get(

  "/auth/github/callback",

  passport.authenticate(
    "github",
    { session: false }

  ),

  AuthController.githubCallback

)


router.get(
  "/me",
  authMiddleware,
  AuthController.me
)
export default router