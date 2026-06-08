import { useState, useEffect } from "react"
import { Plus, Wifi, Play, LayoutGrid, List, Search, Filter } from "lucide-react"

import CreateSessionModal from "../hooks/Sessions/CreateSessionmodal"
import LiveSessionCard    from "../hooks/Sessions/LiveSessionCard"
import VideoLectureCard   from "../hooks/Sessions/Videolecturecard"

import { sessionService, MOCK_LIVE, MOCK_VIDEOS } from "../../../services/SessionService"
import type { LiveSession, VideoLecture } from "../../../domain/entities/session"

import "../styles/Sessions.css"

interface Props {
  kycVerified?: boolean
  bankAdded?:   boolean
}

type Tab    = "live" | "recorded"
type ViewMode = "grid" | "list"

export default function SessionsPage({ kycVerified = false, bankAdded = false }: Props) {
  const [tab,          setTab]          = useState<Tab>("live")
  const [viewMode,     setViewMode]     = useState<ViewMode>("grid")
  const [modalOpen,    setModalOpen]    = useState(false)
const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
const [lectures, setLectures] = useState<VideoLecture[]>([])

useEffect(() => {
  loadSessions()
}, [])

const loadSessions = async () => {
  try {
    setLoading(true)

    const [liveData, lectureData] = await Promise.all([
      sessionService.getLiveSessions(),
      sessionService.getVideoLectures(),
    ])

    setLiveSessions(liveData)
    setLectures(lectureData)

  } catch (error) {
    console.error("Failed to load sessions", error)
  } finally {
    setLoading(false)
  }
}
  const [loading,      setLoading]      = useState(false)
  const [search,       setSearch]       = useState("")
  const [filterMode,   setFilterMode]   = useState<"all"|"free"|"paid">("all")

  // Stats
  const liveCount     = liveSessions.filter(s => s.status === "live").length
  const upcomingCount = liveSessions.filter(s => s.status === "upcoming").length
  const totalEnrolled = liveSessions.reduce((n, s) => n + s.enrolledCount, 0)

  const handleDelete = async (id: string) => {
    try {
      await sessionService.deleteSession(id)
    } catch { /* ignore in mock */ }
    setLiveSessions(p => p.filter(s => s.id !== id))
    setLectures(p => p.filter(l => l.id !== id))
  }

  const handleJoin = (link: string) => window.open(link, "_blank")

  // Filter helpers
  const filterLive = liveSessions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                        s.subject.toLowerCase().includes(search.toLowerCase())
    const matchMode   = filterMode === "all" || s.mode === filterMode
    return matchSearch && matchMode
  })

  const filterLectures = lectures.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
                        l.subject.toLowerCase().includes(search.toLowerCase())
    const matchMode   = filterMode === "all" || l.mode === filterMode
    return matchSearch && matchMode
  })
  console.log("Modal Open:", modalOpen)
console.log("SESSIONS PAGE MOUNTED")
if (loading) {
  return (
    <div className="ss-loading">
      Loading sessions...
    </div>
  )
}
  return (
    
    <div className="ss-page">
 
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="ss-header">
        <div>
          <h1 className="ss-title">Sessions</h1>
          <p className="ss-sub">Manage your live classes and video lectures</p>
        </div>
        <button className="ss-create-btn" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> Create Session
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="ss-stats">
        <div className="ss-stat ss-stat-green">
          <div className="ss-stat-icon"><Wifi size={18} /></div>
          <div>
            <div className="ss-stat-val">{liveCount}</div>
            <div className="ss-stat-label">Live Now</div>
          </div>
        </div>
        <div className="ss-stat ss-stat-blue">
          <div className="ss-stat-icon"><Filter size={18} /></div>
          <div>
            <div className="ss-stat-val">{upcomingCount}</div>
            <div className="ss-stat-label">Upcoming</div>
          </div>
        </div>
        <div className="ss-stat ss-stat-purple">
          <div className="ss-stat-icon"><Play size={18} /></div>
          <div>
            <div className="ss-stat-val">{lectures.length}</div>
            <div className="ss-stat-label">Video Lectures</div>
          </div>
        </div>
        <div className="ss-stat ss-stat-amber">
          <div className="ss-stat-icon"><Plus size={18} /></div>
          <div>
            <div className="ss-stat-val">{totalEnrolled}</div>
            <div className="ss-stat-label">Total Enrolled</div>
          </div>
        </div>
      </div>

      {/* ── Tabs + Controls ─────────────────────────────────── */}
      <div className="ss-controls">
        <div className="ss-tabs">
          <button className={`ss-tab${tab === "live" ? " active" : ""}`} onClick={() => setTab("live")}>
            <Wifi size={14} /> Live Sessions
            <span className="ss-tab-count">{liveSessions.length}</span>
          </button>
          <button className={`ss-tab${tab === "recorded" ? " active" : ""}`} onClick={() => setTab("recorded")}>
            <Play size={14} /> Video Lectures
            <span className="ss-tab-count">{lectures.length}</span>
          </button>
        </div>

        <div className="ss-right-controls">
          {/* Search */}
          <div className="ss-search-wrap">
            <Search size={13} className="ss-search-icon" />
            <input
              className="ss-search"
              placeholder="Search sessions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Mode filter */}
          <div className="ss-filter-btns">
            {(["all","free","paid"] as const).map(m => (
              <button
                key={m}
                className={`ss-filter-btn${filterMode === m ? " active" : ""}`}
                onClick={() => setFilterMode(m)}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="ss-view-toggle">
            <button className={`ss-view-btn${viewMode === "grid" ? " active" : ""}`} onClick={() => setViewMode("grid")}>
              <LayoutGrid size={14} />
            </button>
            <button className={`ss-view-btn${viewMode === "list" ? " active" : ""}`} onClick={() => setViewMode("list")}>
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      {tab === "live" ? (
        filterLive.length === 0 ? (
          <div className="ss-empty">
            <Wifi size={36} />
            <h3>No live sessions yet</h3>
            <p>Create your first live session and start teaching!</p>
            <button className="ss-create-btn" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Create Live Session
            </button>
          </div>
        ) : (
          <div className={`ss-grid${viewMode === "list" ? " ss-list" : ""}`}>
            {filterLive.map(s => (
              <LiveSessionCard key={s.id} session={s} onDelete={handleDelete} onJoin={handleJoin} />
            ))}
          </div>
        )
      ) : (
        filterLectures.length === 0 ? (
          <div className="ss-empty">
            <Play size={36} />
            <h3>No video lectures yet</h3>
            <p>Upload your first recorded lecture for students to watch anytime.</p>
            <button className="ss-create-btn" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Upload Lecture
            </button>
          </div>
        ) : (
          <div className={`ss-grid${viewMode === "list" ? " ss-list" : ""}`}>
            {filterLectures.map(l => (
              <VideoLectureCard key={l.id} lecture={l} onDelete={handleDelete} />
            ))}
          </div>
        )
      )}

      {/* ── Modal ───────────────────────────────────────────── */}
      {modalOpen && (
    <CreateSessionModal
  onClose={() => setModalOpen(false)}
  onCreated={loadSessions}
  kycVerified={kycVerified}
  bankAdded={bankAdded}
/>
      )}
    </div>
  )
}