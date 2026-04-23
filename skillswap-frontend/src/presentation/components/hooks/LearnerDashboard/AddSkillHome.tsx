import { useNavigate } from "react-router-dom"

export default function AddSkillsHome() {

  const navigate = useNavigate()

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-xl w-full bg-white/60 backdrop-blur-lg shadow-xl rounded-2xl p-10 text-center">

        <h1 className="text-3xl font-bold text-blue-600">

          Add Your Skills 🎯

        </h1>

        <p className="text-gray-600 mt-4">

          Tell us what you can teach and what you want to learn.
          We'll find the best matches for you.

        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">

          <div className="bg-white shadow rounded-lg px-4 py-3">

            🎨 Graphic Design

          </div>

          <div className="bg-white shadow rounded-lg px-4 py-3">

            💻 React Development

          </div>

          <div className="bg-white shadow rounded-lg px-4 py-3">

            📷 Photography

          </div>

          <div className="bg-white shadow rounded-lg px-4 py-3">

            📈 Digital Marketing

          </div>

        </div>

        <button

          onClick={() => navigate("/profile/skills")}

          className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition"

        >

          Add My Skills

        </button>

      </div>

    </div>

  )

}