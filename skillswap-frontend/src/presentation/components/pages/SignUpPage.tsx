


import React, { useState, FormEvent } from "react"
import { Link } from "react-router-dom"
import { Mail, Lock, User, CheckCircle, AlertTriangle ,Eye,EyeOff } from "lucide-react"
import { SVGProps } from "react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { FaLinkedin } from "react-icons/fa"
import { useNavigate} from "react-router-dom"

import Header from "../hooks/Header"
import Footer from "../hooks/Footer"
import { useSignup } from "../hooks/Auth/SignUpUseCase"



type Message = {
  type: "error" | "success"
  text: string
}

interface InputFieldProps {
  icon: React.FC<SVGProps<SVGSVGElement>>
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  showToggle?: boolean
  toggleVisibility?: () => void
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type,
  value,
  onChange,
  placeholder,
  showToggle,
  toggleVisibility,
}) => (
  <div className="relative w-full">
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />

    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full h-12 pl-11 pr-11 rounded-xl bg-white/20 placeholder-gray-300 text-sm outline-none border border-white/30 focus:border-blue-400 transition-all duration-300 shadow-sm backdrop-blur-sm text-white"
    />

    {showToggle && (
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
      >
        {type === "password" ? <Eye /> : <EyeOff />}
      </button>
    )}
  </div>
)

const logoImg = "/assets/logo.png"
const bgImg = "/assets/bg.jpeg"



const MessageDisplay: React.FC<{ message: Message | null }> = ({
  message,
}) => {
  if (!message) return null

  const Icon =
    message.type === "error"
      ? AlertTriangle
      : CheckCircle
      
      

  return (
   
    <div
      className={`w-full p-3 rounded-xl flex items-center gap-2 text-[15px] font-medium mt-2 mb-2 ${
        message.type === "error"
          ? "bg-red-50/50 text-red-700 border border-red-200"
          : "bg-green-50/50 text-green-700 border border-green-200"
      }`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{message.text}</span>
    </div>
  )
}
const handleGoogleSignup = () => {
  window.location.href =
    "http://localhost:5000/auth/google"
}

const handleGithubSignup = () => {
  window.location.href =
    "http://localhost:5000/auth/github"
}


const SignupPage: React.FC = () => {
   const navigate=useNavigate()
  const [fullName, setFullName] =
    useState("")

  const [email, setEmail] =
    useState("")
const [showPassword, setShowPassword] = useState(false)
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] =
    useState("")

  const [confirmPwd, setConfirmPwd] =
    useState("")

  const [message, setMessage] =
    useState<Message | null>(null)

  const { signup, loading } =
    useSignup()

  const handleSignup = async (
    e: FormEvent
  ) => {
    e.preventDefault()

    setMessage(null)

    if (password !== confirmPwd) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      })
      return
    }
    if (!email.includes("@")) {
  setMessage({
    type: "error",
    text: "Enter valid email address",
  })
  return
}
if (password.length < 6) {
  setMessage({
    type: "error",
    text: "Password must be at least 6 characters",
  })
  return
}

    try {
     await signup({
  fullName,
  email,
  password,
  confirmPassword: confirmPwd
})

localStorage.setItem("otpExpiry",
  String(Date.now() + 60000)
)
localStorage.setItem("otpEmail", email)

setMessage({
  type: "success",
  text: "Signup successful! OTP sent."
})

setTimeout(() => {
 navigate("/verify-otp?mode=signup")
}, 800)
    } catch (error: any) {

  const backendMessage =
    error.response?.data?.message

  setMessage({
    type: "error",
    text: backendMessage || "Signup failed"
  })
}
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
            Create Your Account
          </p>

          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-5 w-full"
          >
            <InputField
              icon={User}
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Full Name"
            />

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
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Password"
  showToggle
  toggleVisibility={() =>
    setShowPassword(!showPassword)
  }
/>

<InputField
  icon={Lock}
  type={showConfirmPassword ? "text" : "password"}
  value={confirmPwd}
  onChange={(e) => setConfirmPwd(e.target.value)}
  placeholder="Confirm Password"
  showToggle
  toggleVisibility={() =>
    setShowConfirmPassword(!showConfirmPassword)
  }
/>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-12 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : "Sign Up"}
            </button>

           <MessageDisplay message={message} />
<div className="w-full flex items-center gap-2 my-2">
  <div className="flex-1 h-[1px] bg-white/30" />
  <span className="text-white text-xs">OR</span>
  <div className="flex-1 h-[1px] bg-white/30" />
</div>

<div className="flex justify-center gap-5 mt-2">

  {/* Google */}
  <button
    type="button"
    onClick={handleGoogleSignup}
    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow hover:scale-105 transition"
  >
    <FcGoogle size={26} />
  </button>

  {/* GitHub */}
  <button
    type="button"
    onClick={handleGithubSignup}
    className="w-12 h-12 flex items-center justify-center rounded-xl bg-black shadow hover:scale-105 transition"
  >
    <FaGithub size={22} color="white" />
  </button>


</div>
<p className="text-center text-white/90 text-sm mt-2">
  Already have an account?{" "}
 <Link 
    to='/login'
    className="underline text-blue-300 hover:text-white font-semibold"
 >
    Log In
  </Link>
</p>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignupPage
