import { Trophy, Star, Zap, Award, Users } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"

interface Props { profile: TeacherProfile }

export default function TeacherAchievements({ profile }: Props) {
  const badges = [
    profile.totalSessions >= 100 && { icon: <Trophy size={18} />, label: "Top Mentor",      desc: "100+ sessions completed", color: "amber"  },
    profile.totalStudents >= 50  && { icon: <Users  size={18} />, label: "Student Magnet",  desc: "50+ active students",     color: "blue"   },
    profile.rating >= 4.5        && { icon: <Star   size={18} />, label: "Top Rated",       desc: "Rating above 4.5",        color: "yellow" },
    profile.kycVerified          && { icon: <Award  size={18} />, label: "Verified Pro",    desc: "Identity verified",       color: "green"  },
    profile.skillsToTeach.length >= 5 && { icon: <Zap size={18} />, label: "Skill Expert", desc: "5+ skills listed",        color: "purple" },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; desc: string; color: string }[]

  if (badges.length === 0) {
    return (
      <div className="tp-card">
        <div className="tp-card-title"><Trophy size={15} />Achievements</div>
        <p className="tp-muted" style={{ textAlign:"center", padding:"16px 0" }}>
          Complete more sessions to earn badges!
        </p>
      </div>
    )
  }

  return (
    <div className="tp-card">
      <div className="tp-card-title" style={{ marginBottom: 16 }}>
        <Trophy size={15} />
        Achievements
      </div>
      <div className="tp-badges">
        {badges.map(b => (
          <div key={b.label} className={`tp-badge tp-badge-${b.color}`}>
            <div className="tp-badge-icon">{b.icon}</div>
            <div>
              <div className="tp-badge-label">{b.label}</div>
              <div className="tp-badge-desc">{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}