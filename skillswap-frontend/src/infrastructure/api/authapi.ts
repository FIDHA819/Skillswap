import api from "./axios"

export const signupApi = (data) =>
  api.post("/signup", data)

export const loginApi = (data) =>
  api.post("/login", data)

export const verifyOtpApi = (data) =>
 api.post(`/verify-otp?mode=${data.mode}`, data)

export const resendOtpApi = (data) =>
  api.post(`/resend-otp?mode=${data.mode}`, data)

export const forgotPasswordApi = (data) =>
  api.post("/forgot-password", data)

export const resetPasswordApi = (data) =>
  api.post("/reset-password", data)