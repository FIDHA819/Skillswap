import { useState, FormEvent, useEffect } from "react"
import { CheckCircle, AlertTriangle } from "lucide-react"

import Header from "../hooks/Header"
import Footer from "../hooks/Footer"

import { useVerifyOtp } from "../hooks/Auth/VerifyOtp"

const logoImg = "/assets/logo.png"
const bgImg = "/assets/bg.jpeg"

type Message = {
  type: "error" | "success"
  text: string
}

export default function VerifyOtpPage() {

  const { verifyOtp, resendOtp, loading } = useVerifyOtp()

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [message, setMessage] = useState<Message | null>(null)
  const [timer, setTimer] = useState(60)

  const email = localStorage.getItem("otpEmail") || ""

  // ✅ countdown timer
  useEffect(() => {

    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)

  }, [timer])

  // ✅ handle OTP input
  const handleChange = (index: number, value: string) => {

    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      next?.focus()
    }
  }

  // ✅ submit OTP
  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault()

    setMessage(null)

    const otpValue = otp.join("")

    try {

      const ok = await verifyOtp({
        email,
        otp: otpValue
      })

      if (ok) {

        setMessage({
          type: "success",
          text: "OTP verified successfully!"
        })

        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)

      }

    } catch (err: any) {

      setMessage({
        type: "error",
        text: err.message || "Invalid OTP"
      })

    }

  }

  // ✅ resend OTP
  const handleResend = async () => {

    setMessage(null)

    try {

      await resendOtp({ email })

      setMessage({
        type: "success",
        text: "OTP resent successfully"
      })

      setTimer(60)

    } catch {

      setMessage({
        type: "error",
        text: "Failed to resend OTP"
      })

    }

  }

  return (

    <div
      className="relative w-full min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">

        <div className="w-full max-w-md rounded-3xl px-8 py-10 flex flex-col items-center bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">

          <img
            src={logoImg}
            alt="Logo"
            className="w-12 h-12 mb-3 rounded-full border-2 border-blue-100 shadow-md"
          />

          <h1 className="text-3xl font-extrabold text-white text-center mb-2">
            Verify OTP
          </h1>

          <p className="text-white/90 text-sm mb-4 text-center">
            Enter the 6-digit code sent to
            <br />
            <span className="text-blue-300 font-bold">
              {email}
            </span>
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 items-center w-full"
          >

            <div className="flex gap-2">

              {otp.map((digit, i) => (

                <input
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  onChange={(e) =>
                    handleChange(i, e.target.value)
                  }
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-white/20 text-white border border-white/30 outline-none"
                />

              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-green-600 text-white rounded-xl font-bold"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {message && (

              <div className={`flex items-center gap-2 text-sm ${
                message.type === "error"
                  ? "text-red-400"
                  : "text-green-400"
              }`}>

                {message.type === "error"
                  ? <AlertTriangle size={18} />
                  : <CheckCircle size={18} />}

                {message.text}

              </div>

            )}

            <div className="text-sm text-white mt-2">

              {timer > 0 ? (

                <>Resend in <b>{timer}s</b></>

              ) : (

                <button
                  type="button"
                  onClick={handleResend}
                  className="underline text-blue-300"
                >
                  Resend OTP
                </button>

              )}

            </div>

          </form>

        </div>

      </main>

      <Footer />

    </div>

  )

}