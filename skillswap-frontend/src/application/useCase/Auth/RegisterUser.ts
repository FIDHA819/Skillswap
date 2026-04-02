
//   // ---------------------------
//   // Login Handler
//   // ---------------------------
//   const handleLogin = async (e: FormEvent) => {
//     e.preventDefault();
//     setMessage(null);

//     const emailTrimmed = email.toLowerCase().trim();

//     if (!validateEmail(emailTrimmed))
//       return setMessage({ type: "error", text: "Invalid email format." });

//     setLoading(true);
//     try {
//       const res = await authService.login({ email: emailTrimmed, password });
//       const data = res?.data || res;

//       // Store token and user locally
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       setMessage({
//         type: "success",
//         text: "Email verified successfully! Redirecting...",
//       });

//       if (!data.user.profileCompleted) {
//         navigate("/profile");
//       } else {
//         navigate("/home");
//       }
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setMessage({
//           type: "error",
//           text: err.response?.data?.message || "Invalid credentials.",
//         });
//       } else {
//         setMessage({ type: "error", text: "An unexpected error occurred." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------
//   // OTP Verification
//   // ---------------------------
//   const handleVerifyOtp = async (e: FormEvent) => {
//     e.preventDefault();
//     setMessage(null);
//     setLoading(true);

//     try {
//       const otpValue = otp.join("");
//       const emailTrimmed = email.toLowerCase().trim();

//       const { token, user } = await authService.verifyOtp({
//         email: emailTrimmed,
//         otp: otpValue,
//       });

//       if (!token || !user?.id) {
//         throw new Error("Invalid response from server");
//       }

//       // Save locally
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       setMessage({
//         type: "success",
//         text: "Email verified successfully! Redirecting...",
//       });

//       // Fetch user profile for up-to-date completion status
//       const profileRes = await userService.getProfile(token);

//       if (!profileRes?.profileCompleted) {
//         navigate("/profile");
//       } else {
//         navigate("/home");
//       }
//     } catch (err: any) {
//       if (axios.isAxiosError(err)) {
//         setMessage({
//           type: "error",
//           text: err.response?.data?.message || "Invalid OTP.",
//         });
//       } else {
//         setMessage({ type: "error", text: err.message || "OTP verification failed." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------
//   // Resend OTP
//   // ---------------------------
//   const handleResendOtp = async () => {
//     setMessage(null);
//     setLoading(true);
//     try {
//       const emailTrimmed = email.toLowerCase().trim();

//       await authService.resendOtp({ email: emailTrimmed });

//       setMessage({ type: "success", text: "New OTP sent to your email." });
//       setTimer(60);
//     } catch (err) {
//       if (axios.isAxiosError(err)) {
//         setMessage({
//           type: "error",
//           text: err.response?.data?.message || "Failed to resend OTP.",
//         });
//       } else {
//         setMessage({ type: "error", text: "Failed to resend OTP." });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------------------
//   // OTP Input
//   // ---------------------------
//   const handleOtpChange = (index: number, value: string) => {
//     if (/^\d?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
//         nextInput?.focus();
//       }
//     }
//   };

  

export class RegisterUser {
  constructor(private repo) {}

  async execute(data) {
    if (!data.email.includes("@"))
      throw new Error(
        "Invalid email format"
      )

    if (data.password.length < 6)
      throw new Error(
        "Password too short"
      )

    return this.repo.signup(data)
  }
}