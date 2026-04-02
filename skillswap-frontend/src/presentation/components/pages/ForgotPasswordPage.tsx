import { useState, FormEvent } from "react"
import { Mail } from "lucide-react"
import { SVGProps } from "react" 
import Header from "../hooks/Header"
import Footer from "../hooks/Footer"
import { useForgotPassword } from '../hooks/Auth/UserForgotPassword'

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
      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/20 text-white border border-white/30"
    />
  </div>
)

export default function ForgotPasswordPage() {

  const { requestReset, loading } = useForgotPassword()

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault()

    await requestReset(email)

    localStorage.setItem("resetEmail", email)

    window.location.href = "/reset-password"

  }

  return (

    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >

      <Header />

      <main className="flex flex-1 justify-center items-center">

        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8">

          <img
            src={logoImg}
            className="w-12 mx-auto mb-4"
          />

          <h2 className="text-white text-xl text-center mb-4">

            Reset Password

          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >

            <InputField
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />

            <button
              disabled={loading}
              className="h-12 bg-blue-600 text-white rounded-xl"
            >

              Send Reset OTP

            </button>

          </form>

          {message && (

            <p className="text-white mt-3">

              {message}

            </p>

          )}

        </div>

      </main>

      <Footer />

    </div>

  )

}