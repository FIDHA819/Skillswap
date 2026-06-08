import { Star } from "lucide-react"
import type { AvatarColor } from "../../domain/entities/teacher"

// ── Avatar ────────────────────────────────────────────────
export function TdAvatar({
  initials,
  color,
  size = "md",
}: {
  initials: string
  color: AvatarColor
  size?: "sm" | "md" | "lg"
}) {
  return (
    <div className={`td-av td-av-${color} td-av-${size}`}>
      {initials}
    </div>
  )
}

// ── Status dot ────────────────────────────────────────────
export function SessionDot({ status }: { status: string }) {
  return <span className={`td-dot td-dot-${status}`} />
}

// ── Session badge ─────────────────────────────────────────
export function SessionBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    live:      { cls: "badge-live",  label: "Live now" },
    soon:      { cls: "badge-soon",  label: "In 1h" },
    scheduled: { cls: "badge-sched", label: "Scheduled" },
  }
  const { cls, label } = map[status] ?? map.scheduled
  return <span className={`td-badge ${cls}`}>{label}</span>
}

// ── Student status badge ──────────────────────────────────
export function StudentBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "badge-live", New: "badge-soon", Pending: "badge-sched",
  }
  return <span className={`td-badge ${map[status] ?? "badge-sched"}`}>{status}</span>
}

// ── Stars ─────────────────────────────────────────────────
export function Stars({ count }: { count: number }) {
  return (
    <div className="td-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i} size={12}
          fill={i < count ? "#f59e0b" : "none"}
          color={i < count ? "#f59e0b" : "#334155"}
        />
      ))}
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────
export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="td-prog-wrap">
      <div className="td-prog-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

// ── Section card wrapper ──────────────────────────────────
export function TdCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`td-box ${className}`}>{children}</div>
}

// ── Card header row ───────────────────────────────────────
export function TdCardHead({
  icon,
  title,
  action,
}: {
  icon?: React.ReactNode
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="td-box-head">
      <h3>
        {icon && <span className="td-box-icon">{icon}</span>}
        {title}
      </h3>
      {action && <div>{action}</div>}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────
export function TdEmpty({ text }: { text: string }) {
  return <p className="td-empty">{text}</p>
}