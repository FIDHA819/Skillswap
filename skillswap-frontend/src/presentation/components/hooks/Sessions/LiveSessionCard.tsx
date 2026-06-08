import { Video, Clock, Users, Calendar, Trash2, ExternalLink, Lock, Wifi } from "lucide-react"
import type { LiveSession } from "../types/session.types"

interface Props {
  session: LiveSession
  onDelete: (id: string) => void
  onJoin: (link: string) => void
}

const STATUS_MAP = {
  live:      { cls: "ss-badge-live",      label: "Live Now"   },
  upcoming:  { cls: "ss-badge-upcoming",  label: "Upcoming"   },
  completed: { cls: "ss-badge-completed", label: "Completed"  },
  cancelled: { cls: "ss-badge-cancelled", label: "Cancelled"  },
}

function formatDate(dateStr: string, time: string) {
  const d = new Date(`${dateStr}T${time}`)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
}

export default function LiveSessionCard({ session, onDelete, onJoin }: Props) {
  const { cls, label } = STATUS_MAP[session.status]
  const pct = session.maxStudents
    ? Math.round(session.enrolledCount / session.maxStudents * 100)
    : 0

  return (
    <div className={`ss-card ${session.status === "live" ? "ss-card-live" : ""}`}>
      {/* Top row */}
      <div className="ss-card-top">
        <div className="ss-card-badges">
          <span className={`ss-badge ${cls}`}>{label}</span>
          <span className={`ss-badge ${session.mode === "paid" ? "ss-badge-paid" : "ss-badge-free"}`}>
            {session.mode === "paid" ? <><Lock size={9} /> ₹{session.price}</> : "Free"}
          </span>
          <span className="ss-badge ss-badge-subject">{session.subject}</span>
        </div>
        <button className="ss-card-del" onClick={() => onDelete(session.id)} title="Delete session">
          <Trash2 size={13} />
        </button>
      </div>

      {/* Title */}
      <h3 className="ss-card-title">{session.title}</h3>
      <p className="ss-card-desc">{session.description}</p>

      {/* Meta */}
      <div className="ss-card-meta">
        <span><Calendar size={12} />{formatDate(session.date, session.time)}</span>
        <span><Clock   size={12} />{session.durationMins} min</span>
        <span><Users   size={12} />{session.enrolledCount}{session.maxStudents ? `/${session.maxStudents}` : ""} enrolled</span>
      </div>

      {/* Enrollment bar */}
      {session.maxStudents && (
        <div className="ss-enroll-bar-wrap">
          <div className="ss-enroll-bar" style={{ width: `${pct}%` }} />
        </div>
      )}

      {/* Student avatars */}
      {session.studentInitials && session.studentInitials.length > 0 && (
        <div className="ss-student-avs">
          {session.studentInitials.slice(0, 5).map((ini, i) => (
            <div key={i} className="ss-mini-av" style={{ zIndex: 5 - i }}>{ini}</div>
          ))}
          {session.enrolledCount > 5 && (
            <div className="ss-mini-av ss-mini-more">+{session.enrolledCount - 5}</div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="ss-card-actions">
        {session.status === "live" && session.meetLink && (
          <button className="ss-join-btn" onClick={() => onJoin(session.meetLink!)}>
            <Wifi size={13} /> Join Now
          </button>
        )}
        {session.status === "upcoming" && session.meetLink && (
          <button className="ss-meet-btn" onClick={() => window.open(session.meetLink, "_blank")}>
            <ExternalLink size={13} /> Open Meet Link
          </button>
        )}
        {session.status === "upcoming" && !session.meetLink && (
          <button className="ss-meet-btn dimmed" disabled>
            <Video size={13} /> Meet link pending
          </button>
        )}
        {session.status === "completed" && (
          <span className="ss-completed-tag">
            <Users size={12} /> {session.enrolledCount} attended
          </span>
        )}
      </div>
    </div>
  )
}