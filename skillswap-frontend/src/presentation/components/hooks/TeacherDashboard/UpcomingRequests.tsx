import { Bell, ArrowRight, Check, X } from "lucide-react"
import { TdAvatar, TdCard, TdCardHead, TdEmpty } from "../../../../shared/utils/UI"
import type { Request, Page } from "../../../../domain/entities/teacher"

interface Props {
  requests: Request[]
  onAccept: (id: number) => void
  onDecline: (id: number) => void
  limit?: number
  onNavigate?: (p: Page) => void
}

export default function UpcomingRequests({ requests, onAccept, onDecline, limit, onNavigate }: Props) {
  const visible = limit ? requests.slice(0, limit) : requests

  return (
    <TdCard>
      <TdCardHead
        icon={<Bell size={14} />}
        title="Requests"
        action={
          onNavigate && (
            <button className="td-link-btn" onClick={() => onNavigate("requests")}>
              View all <ArrowRight size={11} />
            </button>
          )
        }
      />

      {visible.length === 0
        ? <TdEmpty text="All caught up — no pending requests!" />
        : visible.map(r => (
          <div className="td-req-row" key={r.id}>
            <TdAvatar initials={r.initials} color={r.color} />
            <div className="td-req-info">
              <span className="td-req-name">{r.name}</span>
              <span className="td-req-skill">
                Wants: {r.skill} · <em>{r.note}</em>
              </span>
            </div>
            <div className="td-req-actions">
              <button className="td-btn-accept" onClick={() => onAccept(r.id)}>
                <Check size={11} /> Accept
              </button>
              <button className="td-btn-decline" onClick={() => onDecline(r.id)}>
                <X size={11} />
              </button>
            </div>
          </div>
        ))
      }
    </TdCard>
  )
}