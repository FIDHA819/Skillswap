import { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock } from "lucide-react"
import { SVGProps } from "react"

import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaLinkedin } from "react-icons/fa"

import Header from "../hooks/Header"
import Footer from "../hooks/Footer"

import { useLogin } from "../hooks/Auth/UseLogin"

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

export default function LoginPage() {

  const { login, loading, error } = useLogin()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: FormEvent) => {

    e.preventDefault()

    const ok = await login({
      email,
      password
    })

    if (ok) {
      window.location.href = "/dashboard"
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google"
  }

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/auth/github"
  }

  const handleLinkedinLogin = () => {
    window.location.href = "http://localhost:5000/auth/linkedin"
  }

  return (

    <div
      className="relative w-full min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImg})`,
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

          <h1 className="text-3xl font-extrabold text-white text-center mb-1 tracking-tight leading-8">
            Skill
            <span className="text-blue-200">
              Swap
            </span>
          </h1>

          <p className="text-[15px] font-medium text-white/90 mb-5 text-center">
            Login Your Account
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-5 w-full"
          >

            <InputField
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Email Address"
            />

            <InputField
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Password"
            />

            <div className="text-right text-sm">
  <Link
    to="/forgot-password"
    className="text-blue-300 hover:text-white underline"
  >
    Forgot password?
  </Link>
</div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            {error && (
              <p className="text-red-400 text-sm text-center">
                {error}
              </p>
            )}

            {/* Divider */}

            <div className="w-full flex items-center gap-2 my-2">
              <div className="flex-1 h-[1px] bg-white/30" />
              <span className="text-white text-xs">OR</span>
              <div className="flex-1 h-[1px] bg-white/30" />
            </div>

            {/* Social Login Buttons */}

            <div className="flex justify-center gap-5">

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow hover:scale-110 transition"
              >
                <FcGoogle size={26} />
              </button>

              <button
                type="button"
                onClick={handleGithubLogin}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-black shadow hover:scale-110 transition"
              >
                <FaGithub size={22} color="white" />
              </button>

              <button
                type="button"
                onClick={handleLinkedinLogin}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0A66C2] shadow hover:scale-110 transition"
              >
                <FaLinkedin size={22} color="white" />
              </button>

            </div>
           
 <p className="text-center text-white/90 text-sm mt-4">
  If you are new?{" "}
  <Link
    to="/signup"
    className="underline text-blue-300 hover:text-white font-semibold"
  >
    Sign Up
  </Link>
</p>
   

          </form>

        </div>

      </main>

      <Footer />

    </div>

  )

}