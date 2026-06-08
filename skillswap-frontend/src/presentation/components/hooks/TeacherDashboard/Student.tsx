import { Users, ArrowRight, MessageSquare } from "lucide-react"
import { TdAvatar, StudentBadge, ProgressBar, TdCard, TdCardHead, TdEmpty } from "../../../../shared/utils/UI"
import type { Student, Page } from "../../../../domain/entities/teacher"

interface Props {
  students: Student[]
  limit?: number
  onNavigate?: (p: Page) => void
  onOpenChat?: (studentId: number) => void
}

export default function Students({ students, limit, onNavigate, onOpenChat }: Props) {
  const visible = limit ? students.slice(0, limit) : students

  return (
    <TdCard>
      <TdCardHead
        icon={<Users size={14} />}
        title="Students"
        action={
          onNavigate && (
            <button className="td-link-btn" onClick={() => onNavigate("students")}>
              View all <ArrowRight size={11} />
            </button>
          )
        }
      />

      {visible.length === 0
        ? <TdEmpty text="No students yet." />
        : visible.map(s => (
          <div className="td-student-row" key={s.id}>
            <TdAvatar initials={s.initials} color={s.color} />
            <div className="td-student-info">
              <div className="td-student-top">
                <span className="td-student-name">{s.name}</span>
                <StudentBadge status={s.status} />
              </div>
              <span className="td-student-skill">{s.skill} · {s.sessions} sessions</span>
              <ProgressBar pct={s.progress} />
            </div>
            {onOpenChat && (
              <button
                className="td-chat-btn"
                title={`Chat with ${s.name}`}
                onClick={() => onOpenChat(s.id)}
              >
                <MessageSquare size={14} />
              </button>
            )}
          </div>
        ))
      }
    </TdCard>
  )
}