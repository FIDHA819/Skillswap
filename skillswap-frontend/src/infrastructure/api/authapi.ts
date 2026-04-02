import api from "./axios"

export const signupApi = (data) =>
  api.post("/signup", data)

export const loginApi = (data) =>
  api.post("/login", data)

export const verifyOtpApi = (data) =>
  api.post("/verify-otp", data)

export const resendOtpApi = (data) =>
  api.post("/resend-otp", data)