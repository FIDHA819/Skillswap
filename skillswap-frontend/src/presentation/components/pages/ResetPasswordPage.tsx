import { useState, FormEvent } from "react"
import { Lock } from "lucide-react"
import { SVGProps } from "react"
import Header from "../hooks/Header"
import Footer from "../hooks/Footer"
import { useResetPassword } from "../hooks/Auth/UserResetPassword"

const logoImg = "/assets/logo.png"
const bgImg = "/assets/bg.jpeg"

interface InputFieldProps {
  icon: React.FC<SVGProps<SVGSVGElement>>
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
}) => (
  <div className="relative w-full">

    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />

    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/20 placeholder-gray-300 text-sm outline-none border border-white/30 focus:border-blue-400 transition-all duration-300 shadow-sm backdrop-blur-sm text-white"
    />

  </div>
)

export default function SetNewPasswordPage() {

  const { resetPassword, loading } = useResetPassword()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const email =
    localStorage.getItem("resetEmail")

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault()

    setError("")

    if (!password || !confirmPassword) {

      setError("All fields required")
      return

    }

    if (password.length < 6) {

      setError("Password must be at least 6 characters")
      return

    }

    if (password !== confirmPassword) {

      setError("Passwords do not match")
      return

    }

    try {

      await resetPassword({

        email,
        password

      })

      localStorage.removeItem("resetEmail")

      window.location.href = "/login"

    } catch (err: any) {

      setError(
        err.message ||
        "Failed to reset password"
      )

    }

  }

  return (

    <div
      className="relative w-full min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImg})`
      }}
    >

      <Header />

      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">

        <div className="relative w-full max-w-md rounded-3xl px-8 py-10 flex flex-col items-center bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">

          <img
            src={logoImg}
            alt="Logo"
            className="w-12 h-12 mb-3 rounded-full border-2 border-blue-100 shadow-md"
          />

          <h1 className="text-3xl font-extrabold text-white text-center mb-1">

            Set
            <span className="text-blue-200">
              Password
            </span>

          </h1>

          <p className="text-[15px] font-medium text-white/90 mb-5 text-center">

            Enter your new password

          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 w-full"
          >

            <InputField
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="New Password"
            />

            <InputField
              icon={Lock}
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              placeholder="Confirm Password"
            />

            {error && (

              <p className="text-red-400 text-sm text-center">

                {error}

              </p>

            )}

            <button
              disabled={loading}
              className="mt-2 w-full h-12 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition disabled:opacity-60"
            >

              {loading
                ? "Resetting..."
                : "Set New Password"}

            </button>

          </form>

        </div>

      </main>

      <Footer />

    </div>

  )

}