import "../../styles/teacherDashboard.css";
import {
  LayoutDashboard, CalendarDays, Users, Star,
  User, BookOpen, Settings, MessageSquare,
  Bell, ChevronRight, Repeat2,
} from "lucide-react"
import { useAuth } from "../../../../contexts/AuthContext"
// import type { Page } from "../../../../domain/enti.i../../domai.i../../domai.i../../domaities/teacher"

interface Props {
  page: Page
  setPage: (p: Page) => void
  totalUnread: number
}

const MENU: { id: Page; label: string; Icon: React.ElementType }[] = [
  { id: "overview",  label: "Overview",   Icon: LayoutDashboard },
  { id: "sessions",  label: "Sessions",   Icon: CalendarDays    },
  { id: "requests",  label: "Requests",   Icon: Bell            },
  { id: "students",  label: "Students",   Icon: Users           },
  { id: "chat",      label: "Chat",       Icon: MessageSquare   },
  { id: "reviews",   label: "Reviews",    Icon: Star            },
  { id: "skills",    label: "Skills",     Icon: BookOpen        },
  { id: "profile",   label: "Profile",    Icon: User            },
  { id: "settings",  label: "Settings",   Icon: Settings        },
]

export default function TeacherSidebar({ page, setPage, totalUnread }: Props) {
  const { user } = useAuth()
  const initial = user?.fullName?.charAt(0)?.toUpperCase() || "T"

  return (
    <aside className="td-sidebar">
      {/* Brand */}
      <div className="td-brand">
        <div className="td-brand-logo">
          <Repeat2 size={22} />
        </div>
        <div>
          <h2>SkillSwap</h2>
          <p>Teacher Studio</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="td-nav">
        {MENU.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`td-nav-btn${page === id ? " active" : ""}`}
            onClick={() => setPage(id)}
            aria-current={page === id ? "page" : undefined}
          >
            <div className="td-nav-left">
              <Icon size={17} />
              <span>{label}</span>
            </div>
            <div className="td-nav-right">
              {id === "chat" && totalUnread > 0 && (
                <span className="td-nav-badge">{totalUnread}</span>
              )}
              {page === id && <ChevronRight size={14} />}
            </div>
          </button>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="td-sb-profile">
        <div className="td-sb-av">
          {user?.photoUrl
            ? <img src={user.photoUrl} alt="" />
            : initial
          }
        </div>
        <div className="td-sb-info">
          <h4>{user?.fullName || "Teacher"}</h4>
          <p>{user?.email || "teacher"}</p>
        </div>
      </div>
    </aside>
  )
}