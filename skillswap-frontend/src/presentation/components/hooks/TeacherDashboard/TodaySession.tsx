import { useState } from "react"
import {
  CalendarDays, ArrowRight, Video,
  Clock, Users, Filter, Search,
  Wifi, CheckCircle2, XCircle, CalendarOff
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────
type SessionStatus  = "live" | "soon" | "scheduled" | "completed" | "cancelled"
type AvatarColor    = "purple" | "green" | "amber" | "red" | "blue"

interface Session {
  id: string
  title: string
  skill: string
  time: string       // "HH:MM AM/PM"
  date: string       // ISO date
  duration: string   // "60 min"
  status: SessionStatus
  name: string       // student name
  initials: string
  color: AvatarColor
  meetLink?: string
  enrolledCount?: number
}

interface Props {
  sessions?: Session[]
  limit?: number
  showFull?: boolean
  onNavigate?: (page: string) => void
}

// ── Status config ──────────────────────────────────────────
const STATUS_CFG: Record<SessionStatus, {
  dotCls: string
  badgeCls: string
  label: string
  icon: React.ReactNode
}> = {
  live:      { dotCls: "td-dot-live",      badgeCls: "badge-live",  label: "Live Now",   icon: <Wifi         size={9}  /> },
  soon:      { dotCls: "td-dot-soon",      badgeCls: "badge-soon",  label: "In 1h",      icon: <Clock        size={9}  /> },
  scheduled: { dotCls: "td-dot-scheduled", badgeCls: "badge-sched", label: "Scheduled",  icon: <CalendarDays size={9}  /> },
  completed: { dotCls: "td-dot-completed", badgeCls: "badge-done",  label: "Completed",  icon: <CheckCircle2 size={9}  /> },
  cancelled: { dotCls: "td-dot-cancelled", badgeCls: "badge-cancel",label: "Cancelled",  icon: <XCircle      size={9}  /> },
}

// ── Mock fallback data ─────────────────────────────────────
const MOCK: Session[] = [
  {
    id: "s1", name: "Arjun Mehta",  initials: "AM", color: "purple",
    title: "React Hooks Deep Dive", skill: "React",
    time: "10:00 AM", date: new Date().toISOString().split("T")[0],
    duration: "60 min", status: "live",
    meetLink: "https://meet.google.com/new", enrolledCount: 12,
  },
  {
    id: "s2", name: "Sneha Patel",  initials: "SP", color: "green",
    title: "Figma UI Components",   skill: "UI/UX Design",
    time: "12:30 PM", date: new Date().toISOString().split("T")[0],
    duration: "45 min", status: "soon",
    meetLink: "https://meet.google.com/new", enrolledCount: 7,
  },
  {
    id: "s3", name: "Rahul Singh",  initials: "RS", color: "amber",
    title: "Python List Comprehensions", skill: "Python",
    time: "03:00 PM", date: new Date().toISOString().split("T")[0],
    duration: "60 min", status: "scheduled",
    enrolledCount: 5,
  },
  {
    id: "s4", name: "Meera Nair",   initials: "MN", color: "red",
    title: "TypeScript Generics",   skill: "TypeScript",
    time: "05:30 PM", date: new Date().toISOString().split("T")[0],
    duration: "45 min", status: "scheduled",
    enrolledCount: 9,
  },
  {
    id: "s5", name: "Anil Kumar",   initials: "AK", color: "blue",
    title: "Node.js REST APIs",     skill: "Node.js",
    time: "09:00 AM", date: new Date().toISOString().split("T")[0],
    duration: "90 min", status: "completed",
    enrolledCount: 18,
  },
]

// ── Sub-components ─────────────────────────────────────────
function TdAvatar({ initials, color, size = "md" }: { initials: string; color: AvatarColor; size?: "sm"|"md"|"lg" }) {
  return <div className={`td-av td-av-${color} td-av-${size}`}>{initials}</div>
}

function SessionBadge({ status }: { status: SessionStatus }) {
  const { badgeCls, label, icon } = STATUS_CFG[status]
  return (
    <span className={`td-badge ${badgeCls}`}>
      {icon}{label}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────
export default function TodaySessions({
  sessions = MOCK,
  limit = 4,
  showFull = false,
  onNavigate,
}: Props) {
  const [filter, setFilter] = useState<"all"|SessionStatus>("all")
  const [search, setSearch] = useState("")

  // Apply filter + search
  const filtered = sessions.filter(s => {
    const matchFilter = filter === "all" || s.status === filter
    const matchSearch = search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.skill.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const visible = showFull ? filtered : filtered.slice(0, limit)

  // Summary counts
  const liveCount      = sessions.filter(s => s.status === "live").length
  const upcomingCount  = sessions.filter(s => s.status === "soon" || s.status === "scheduled").length
  const completedCount = sessions.filter(s => s.status === "completed").length

  const formatTime = (t: string) => (showFull ? t : t.split(" ")[0])

  return (
    <div className="td-box tds-root">

      {/* ── Card header ──────────────────────────────────── */}
      <div className="td-box-head">
        <h3>
          <span className="td-box-icon"><CalendarDays size={14} /></span>
          Today's Sessions
        </h3>
        {onNavigate && (
          <button className="td-link-btn" onClick={() => onNavigate("sessions")}>
            View all <ArrowRight size={11} />
          </button>
        )}
      </div>

      {/* ── Summary pills ────────────────────────────────── */}
      <div className="tds-summary">
        <div className="tds-pill tds-pill-live">
          <span className="tds-pill-dot tds-dot-live" />
          <strong>{liveCount}</strong>
          <span>Live</span>
        </div>
        <div className="tds-pill tds-pill-up">
          <span className="tds-pill-dot tds-dot-up" />
          <strong>{upcomingCount}</strong>
          <span>Upcoming</span>
        </div>
        <div className="tds-pill tds-pill-done">
          <span className="tds-pill-dot tds-dot-done" />
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>
      </div>

      {/* ── Search + filter (full view only) ─────────────── */}
      {showFull && (
        <div className="tds-controls">
          <div className="tds-search-wrap">
            <Search size={12} className="tds-search-icon" />
            <input
              className="tds-search"
              placeholder="Search sessions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="tds-filters">
            {(["all","live","soon","scheduled","completed"] as const).map(f => (
              <button
                key={f}
                className={`tds-filter-btn${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : STATUS_CFG[f as SessionStatus]?.label ?? f}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Session list ─────────────────────────────────── */}
      {visible.length === 0 ? (
        <div className="tds-empty">
          <CalendarOff size={28} />
          <p>No sessions match your filter</p>
        </div>
      ) : (
        <div className="tds-list">
          {visible.map(s => {
            const { dotCls } = STATUS_CFG[s.status]
            return (
              <div
                key={s.id}
                className={`td-session-row${showFull ? " full" : ""}${s.status === "live" ? " tds-row-live" : ""}${s.status === "completed" ? " tds-row-done" : ""}`}
              >
                {/* Time */}
                <span className="td-session-time">{formatTime(s.time)}</span>

                {/* Status dot */}
                <span className={`td-dot ${dotCls}`} />

                {/* Avatar */}
                <TdAvatar initials={s.initials} color={s.color} size="sm" />

                {/* Info */}
                <div className="td-session-info">
                  <span className="td-session-name">{s.title}</span>
                  <span className="td-session-skill">
                    {s.name}
                    {showFull && (
                      <>
                        &nbsp;·&nbsp;{s.skill}&nbsp;·&nbsp;{s.duration}
                        {s.enrolledCount !== undefined && (
                          <span className="tds-enrolled">
                            <Users size={10} />{s.enrolledCount}
                          </span>
                        )}
                      </>
                    )}
                    {!showFull && <>&nbsp;·&nbsp;{s.skill}</>}
                  </span>
                </div>

                {/* Badge */}
                <SessionBadge status={s.status} />

                {/* Join button — live only */}
                {s.status === "live" && (
                  <button
                    className="td-join-btn"
                    onClick={() => window.open(s.meetLink || "https://meet.google.com/new", "_blank")}
                  >
                    <Video size={11} />
                    {showFull ? "Join Meet" : "Join"}
                  </button>
                )}

                {/* Duration chip — full view, non-live */}
                {showFull && s.status !== "live" && s.status !== "cancelled" && s.status !== "completed" && (
                  <span className="tds-duration">
                    <Clock size={10} />{s.duration}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Show more link (compact mode) ────────────────── */}
      {!showFull && sessions.length > limit && (
        <button className="tds-show-more" onClick={() => onNavigate?.("sessions")}>
          +{sessions.length - limit} more sessions today
        </button>
      )}
    </div>
  )
}