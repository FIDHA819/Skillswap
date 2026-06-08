import { Star, ArrowRight } from "lucide-react"
import { TdAvatar, Stars, TdCard, TdCardHead, TdEmpty } from "../../../../shared/utils/UI"
import type { Review, Page } from "../../../../domain/entities/teacher"

interface Props {
  reviews: Review[]
  limit?: number
  onNavigate?: (p: Page) => void
}

export default function Reviews({ reviews, limit, onNavigate }: Props) {
  const visible = limit ? reviews.slice(0, limit) : reviews
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—"

  return (
    <TdCard>
      <TdCardHead
        icon={<Star size={14} />}
        title={`Reviews · ${avg} avg`}
        action={
          onNavigate && (
            <button className="td-link-btn" onClick={() => onNavigate("reviews")}>
              View all <ArrowRight size={11} />
            </button>
          )
        }
      />

      {visible.length === 0
        ? <TdEmpty text="No reviews yet." />
        : visible.map(r => (
          <div className="td-review-row" key={r.id}>
            <div className="td-review-head">
              <TdAvatar initials={r.initials} color={r.color} size="sm" />
              <span className="td-review-name">{r.name}</span>
              <span className="td-review-date">{r.date}</span>
              <Stars count={r.rating} />
            </div>
            <p className="td-review-text">{r.text}</p>
          </div>
        ))
      }
    </TdCard>
  )
}