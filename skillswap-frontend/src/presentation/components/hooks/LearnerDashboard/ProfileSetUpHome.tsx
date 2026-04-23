import { useNavigate } from "react-router-dom"

export default function ProfileSetupHome() {

  const navigate = useNavigate()

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-xl w-full bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-10 text-center">

        <h1 className="text-3xl font-bold text-blue-600">

          Complete Your Profile 🚀

        </h1>

        <p className="text-gray-600 mt-4">

          Tell us a little about yourself so SkillSwap can match you
          with the right learners and teachers.

        </p>

        <div className="mt-8 space-y-4 text-left">

          <div className="flex gap-3 items-center">

            ✅ Add your name & bio

          </div>

          <div className="flex gap-3 items-center">

            ✅ Upload profile picture

          </div>

          <div className="flex gap-3 items-center">

            ✅ Choose learning interests

          </div>

        </div>

        <button

          onClick={() => navigate("/profile/setup")}

          className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition"

        >

          Complete Profile

        </button>

      </div>

    </div>

  )

}