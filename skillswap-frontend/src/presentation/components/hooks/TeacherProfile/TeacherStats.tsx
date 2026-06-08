import { Users, Video, Star, BookOpen } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"

interface Props { profile: TeacherProfile }

export default function TeacherStats({ profile }: Props) {
  const stats = [
    { icon: <Users  size={22} />, value: profile.totalStudents,        label: "Students",  color: "purple", sub: "Active learners"      },
    { icon: <Video  size={22} />, value: profile.totalSessions,        label: "Sessions",  color: "blue",   sub: "Completed sessions"   },
    { icon: <Star   size={22} />, value: profile.rating.toFixed(1),    label: "Rating",    color: "amber",  sub: "Average score"        },
    { icon: <BookOpen size={22}/>, value: profile.skillsToTeach.length, label: "Skills",   color: "green",  sub: "Topics covered"       },
  ]

  return (
    <div className="tp-stats">
      {stats.map(s => (
        <div className={`tp-stat tp-stat-${s.color}`} key={s.label}>
          <div className="tp-stat-icon">{s.icon}</div>
          <div className="tp-stat-body">
            <div className="tp-stat-val">{s.value}</div>
            <div className="tp-stat-label">{s.label}</div>
            <div className="tp-stat-sub">{s.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}