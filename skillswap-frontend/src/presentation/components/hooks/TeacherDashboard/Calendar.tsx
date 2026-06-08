import { CalendarDays } from "lucide-react"
import { TdCard, TdCardHead } from "../../../../shared/utils/UI"

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const SESSION_DAYS = new Set([5, 8, 12, 14, 19, 21, 22, 26, 28])
const TODAY = 26

function buildDays() {
  const startDay = new Date(2026, 4, 1).getDay()
  const rows: { day: number; type: "prev" | "curr" }[] = []
  for (let i = 0; i < startDay; i++)
    rows.push({ day: 30 - startDay + 1 + i, type: "prev" })
  for (let d = 1; d <= 31; d++)
    rows.push({ day: d, type: "curr" })
  return rows
}

export default function Calendar() {
  const days = buildDays()

  return (
    <TdCard>
      <TdCardHead icon={<CalendarDays size={14} />} title="Calendar — May 2026" />

      <div className="td-cal-head">
        {DAY_NAMES.map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="td-cal-grid">
        {days.map((d, i) => (
          <div
            key={i}
            className={[
              "td-cal-cell",
              d.type === "prev" ? "prev" : "",
              d.type === "curr" && d.day === TODAY ? "today" : "",
              d.type === "curr" && SESSION_DAYS.has(d.day) ? "has-session" : "",
            ].filter(Boolean).join(" ")}
          >
            {d.day}
          </div>
        ))}
      </div>

      <div className="td-cal-legend">
        <span className="td-cal-dot" />
        <span>Session days</span>
      </div>
    </TdCard>
  )
}