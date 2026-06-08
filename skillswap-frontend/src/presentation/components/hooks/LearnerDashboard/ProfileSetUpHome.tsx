import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../../contexts/AuthContext'
import { useEffect } from "react"

export default function ProfileSetupHome() {

  const navigate = useNavigate()
  const { user } = useAuth()

  /*
  ─────────────────────────────
  Redirect if already completed
  ─────────────────────────────
  */

  useEffect(() => {

    if (user?.profileCompleted) {

      navigate("/dashboard")

    }

  }, [user, navigate])


  /*
  ─────────────────────────────
  Profile progress calculation
  ─────────────────────────────
  */

  const stepsCompleted = [

    user?.fullName,
    user?.photo,
    user?.skillsToLearn?.length > 0

  ].filter(Boolean).length

  const progressPercent = Math.round((stepsCompleted / 3) * 100)


  return (

    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-blue-50">

      <div className="max-w-xl w-full bg-white shadow-2xl rounded-3xl p-10 text-center border border-gray-100">

        {/* Heading */}

        <h1 className="text-4xl font-bold text-gray-900">

          Complete Your Profile 🚀

        </h1>


        {/* Subtitle */}

        <p className="text-gray-600 mt-4 text-lg">

          Tell us about yourself so SkillSwap can match you with the
          right learners and teachers.

        </p>


        {/* Progress indicator */}

        <div className="mt-6">

          <div className="w-full bg-gray-200 h-2 rounded-full">

            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />

          </div>

          <p className="text-sm text-gray-500 mt-2">

            Profile completion: {progressPercent}%

          </p>

        </div>


        {/* Checklist */}

        <div className="mt-8 space-y-4 text-left">

          <div className="flex items-center gap-3 text-gray-700">

            <span className="text-green-500 text-lg">

              {user?.fullName ? "✔" : "○"}

            </span>

            Add your name & bio

          </div>


          <div className="flex items-center gap-3 text-gray-700">

            <span className="text-green-500 text-lg">

              {user?.photo ? "✔" : "○"}

            </span>

            Upload profile picture

          </div>


          <div className="flex items-center gap-3 text-gray-700">

            <span className="text-green-500 text-lg">

              {user?.skillsToLearn?.length ? "✔" : "○"}

            </span>

            Choose learning interests

          </div>

        </div>


        {/* CTA Button */}

        <button

          onClick={() => navigate("/profile/create")}

          className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg font-semibold transition duration-200"

        >

          Continue Setup →

        </button>


        {/* Helper text */}

        <p className="text-sm text-gray-400 mt-4">

          Takes less than 2 minutes ⏱️

        </p>

      </div>

    </div>

  )

}