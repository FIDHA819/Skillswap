import { useAuth } from "../../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import LearnerHomeRouter from "../../components/pages/LearnerhomeRouter"

export default function LearnerDashboardPage() {
  const { loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user && !user.profileCompleted) {
      navigate("/profile/create")
    }
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        Loading...
      </div>
    )
  }

  // Don't render dashboard until profile check resolves
  if (!user?.profileCompleted) return null

  return <LearnerHomeRouter user={user} />
}