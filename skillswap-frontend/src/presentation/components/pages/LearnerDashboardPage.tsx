import { useEffect, useState } from "react"
import LearnerHomeRouter from "../../components/pages/LearnerhomeRouter"

export default function LearnerDashboardPage() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {

  const token = localStorage.getItem("token")

  fetch("http://localhost:5000/me", {

    headers: {
      Authorization: `Bearer ${token}`
    }

  })
    .then(res => res.json())
    .then(data => setUser(data))

}, [])

  if (!user) return <p>Loading dashboard...</p>

  return <LearnerHomeRouter user={user} />

}