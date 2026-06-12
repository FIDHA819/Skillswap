import { useEffect, useState } from "react";
import { Calendar, Clock, Play, Video, Loader2, ExternalLink } from "lucide-react";
import api from "../../../../infrastructure/api/axios";

type Session = {
  _id: string;
  title: string;
  subject: string;
  description?: string;
  type: "live" | "recorded";
  mode: "free" | "paid";
  date?: string;
  time?: string;
  durationMins: number;
  price?: number;
  meetLink?: string;
  status?: string;
  teacherId: {
    _id: string;
    fullName: string;
  };
};

const CSS = `
  .us-section { padding: 60px 0; }
  .us-container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

  .us-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px; }
  .us-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
    color: #f87171; margin-bottom: 12px; font-family: 'DM Sans', sans-serif;
  }
  .us-title {
    font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.5px;
  }
  .us-title-grad {
    background: linear-gradient(135deg, #60a5fa, #818cf8);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }

  .us-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }

  .us-card {
    background: #111827;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 22px;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    animation: usFade 0.4s ease both;
    display: flex; flex-direction: column; gap: 0;
  }
  .us-card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-3px);
    box-shadow: 0 16px 48px rgba(0,0,0,0.35);
  }

  /* top row */
  .us-card-top {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px; margin-bottom: 14px;
  }
  .us-icon {
    width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .us-icon--live     { background: rgba(239,68,68,0.12); }
  .us-icon--recorded { background: rgba(99,102,241,0.12); }

  .us-badges { display: flex; align-items: center; gap: 6px; }
  .us-badge {
    padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }
  .us-badge--live    { background: rgba(239,68,68,0.12); color: #f87171; }
  .us-badge--soon    { background: rgba(99,102,241,0.12); color: #a5b4fc; }
  .us-badge--free    { background: rgba(34,197,94,0.12);  color: #4ade80; }
  .us-badge--paid    { background: rgba(251,191,36,0.12); color: #fbbf24; }

  .us-subject {
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: #6366f1;
    font-family: 'DM Sans', sans-serif; margin-bottom: 4px;
  }
  .us-name {
    font-size: 16px; font-weight: 700; color: #f8fafc; margin-bottom: 6px;
    font-family: 'DM Sans', sans-serif; line-height: 1.3;
  }
  .us-teacher {
    font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 5px;
  }
  .us-teacher-link { color: #a5b4fc; text-decoration: none; cursor: pointer; }
  .us-teacher-link:hover { color: #c4b5fd; }

  /* meta row */
  .us-meta {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    padding: 12px 0; margin: 12px 0;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .us-meta-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif;
  }
  .us-meta-item--date { color: #22d3ee; }
  .us-meta-item--time { color: #a5b4fc; }

  /* join button */
  .us-join-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border-radius: 12px; border: none;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.25s; margin-top: 14px;
    text-decoration: none;
  }
  .us-join-btn--live {
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: #fff; box-shadow: 0 4px 16px rgba(239,68,68,0.3);
  }
  .us-join-btn--live:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(239,68,68,0.45); }
  .us-join-btn--free {
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff; box-shadow: 0 4px 16px rgba(16,185,129,0.25);
  }
  .us-join-btn--free:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,0.35); }
  .us-join-btn--paid {
    background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3); color: #fbbf24;
  }
  .us-join-btn--paid:hover { background: rgba(251,191,36,0.2); }
  .us-join-btn--soon {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #475569;
    cursor: not-allowed;
  }

  /* empty */
  .us-empty {
    grid-column: 1 / -1;
    display: flex; flex-direction: column; align-items: center;
    padding: 60px 20px; gap: 12px; color: #334155;
    font-family: 'DM Sans', sans-serif; text-align: center;
  }

  @keyframes usFade {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .us-container { padding: 0 20px; }
    .us-title { font-size: 24px; }
    .us-grid { grid-template-columns: 1fr; }
    .us-head { flex-direction: column; align-items: flex-start; gap: 8px; }
  }
`;

function fmtDate(date?: string, time?: string) {
  if (!date) return null;
  try {
    const d = new Date(`${date}T${time ?? "00:00"}`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  } catch { return date; }
}

function isLiveNow(date?: string, time?: string, durationMins = 60) {
  if (!date || !time) return false;
  try {
    const start = new Date(`${date}T${time}:00`).getTime();
    const end   = start + durationMins * 60000;
    const now   = Date.now();
    return now >= start && now <= end;
  } catch { return false; }
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Fetch live upcoming sessions from all connected teachers
    api.get("/session/learner/upcoming")
      .then(r => setSessions(r.data ?? []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <section className="us-section">
        <div className="us-container">

          <div className="us-head">
            <div>
              <div className="us-chip">
                <Calendar size={12} /> Upcoming Sessions
              </div>
              <h2 className="us-title">
                Your <span className="us-title-grad">Sessions</span>
              </h2>
            </div>
          </div>

          <div className="us-grid">
            {loading ? (
              <div style={{ gridColumn:"1/-1", display:"flex", justifyContent:"center", padding:"48px 0" }}>
                <Loader2 size={28} style={{ animation:"spin 1s linear infinite", color:"#6366f1" }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : sessions.length === 0 ? (
              <div className="us-empty">
                <Calendar size={32} />
                <div style={{ color:"#94a3b8", fontWeight:600, fontSize:16 }}>No upcoming sessions</div>
                <div>Connect with teachers to see their sessions here</div>
              </div>
            ) : (
              sessions.map((s, i) => {
                const live   = isLiveNow(s.date, s.time, s.durationMins);
                const dated  = fmtDate(s.date, s.time);
                const teacher = s.teacherId;

                const btnClass = live
                  ? "us-join-btn us-join-btn--live"
                  : s.mode === "free"
                  ? "us-join-btn us-join-btn--free"
                  : s.mode === "paid"
                  ? "us-join-btn us-join-btn--paid"
                  : "us-join-btn us-join-btn--soon";

                return (
                  <div
                    key={s._id}
                    className="us-card"
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    {/* top row */}
                    <div className="us-card-top">
                      <div className={`us-icon us-icon--${s.type}`}>
                        {s.type === "live" ? "📡" : "🎬"}
                      </div>
                      <div className="us-badges">
                        {live && <span className="us-badge us-badge--live">🔴 Live</span>}
                        {!live && s.type === "live" && <span className="us-badge us-badge--soon">⏰ Upcoming</span>}
                        <span className={`us-badge us-badge--${s.mode}`}>
                          {s.mode === "free" ? "Free" : `₹${s.price}`}
                        </span>
                      </div>
                    </div>

                    {/* content */}
                    {s.subject && <div className="us-subject">{s.subject}</div>}
                    <div className="us-name">{s.title}</div>
                    <div className="us-teacher">
                      By&nbsp;
                      <a
                        className="us-teacher-link"
                        href={`/teacher/${teacher?._id}`}
                        onClick={e => { e.preventDefault(); window.location.href = `/teacher/${teacher?._id}`; }}
                      >
                        {teacher?.fullName ?? "Unknown"}
                        <ExternalLink size={10} style={{ marginLeft:3, display:"inline" }} />
                      </a>
                    </div>

                    {/* meta */}
                    <div className="us-meta">
                      {dated && (
                        <span className="us-meta-item us-meta-item--date">
                          <Calendar size={12} /> {dated}
                        </span>
                      )}
                      {s.time && (
                        <span className="us-meta-item us-meta-item--time">
                          <Clock size={12} /> {s.time}
                        </span>
                      )}
                      <span className="us-meta-item">
                        <Clock size={12} /> {s.durationMins} min
                      </span>
                    </div>

                    {/* join / watch button */}
                    {s.meetLink && (live || s.mode === "free") ? (
                      <a href={s.meetLink} target="_blank" rel="noreferrer" className={btnClass}>
                        <Play size={14} />
                        {live ? "Join Live Now" : "Join Session"}
                      </a>
                    ) : s.type === "recorded" && s.meetLink ? (
                      <a href={s.meetLink} target="_blank" rel="noreferrer" className={`us-join-btn us-join-btn--free`}>
                        <Video size={14} /> Watch Now
                      </a>
                    ) : (
                      <button className="us-join-btn us-join-btn--soon" disabled>
                        <Clock size={14} />
                        {live ? "No link yet" : "Not started yet"}
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}