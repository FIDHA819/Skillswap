import { Video, Bell } from "lucide-react"
import { useAuth } from "../../../../contexts/AuthContext"
import type { Page } from "../../../../domain/entities/teacher"

interface Props {
  page: Page
  pendingCount: number
}

const PAGE_LABELS: Record<Page, { title: string; sub: string }> = {
  overview: { title: "Overview", sub: "Welcome back — here's your day at a glance" },
  sessions: { title: "Today's Sessions", sub: "Your scheduled sessions for today" },
  requests: { title: "Requests", sub: "Students waiting for your response" },
  students: { title: "Students", sub: "Manage and track your learners" },
  chat: { title: "Messages", sub: "Chat with your students" },
  reviews: { title: "Reviews", sub: "Feedback from your students" },
  skills: { title: "Skills", sub: "Skills you teach and their engagement" },
  profile: { title: "Profile", sub: "Your public teacher profile" },
  settings: { title: "Settings", sub: "Account and notification preferences" },
  calendar: {
    title: "",
    sub: ""
  }
}

export default function TeacherTopbar({ page, pendingCount }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth()
  const { title, sub } = PAGE_LABELS[page] ?? PAGE_LABELS.overview

  return (
    <div className="td-topbar">
      <div className="td-topbar-left">
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>

      <div className="td-topbar-right">
        {pendingCount > 0 && (
          <div className="td-topbar-alert">
            <Bell size={14} />
            {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
          </div>
        )}
     
      </div>
    </div>
  )
}