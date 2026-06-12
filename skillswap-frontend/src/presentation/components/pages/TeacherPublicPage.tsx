import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Users, Clock, Globe, BookOpen,
  Video, Calendar, Lock, Unlock, UserPlus, CheckCircle,
  Loader2, Play, MapPin,
} from "lucide-react";
import api from "../../../infrastructure/api/axios";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotifications } from "../../../contexts/NotificationContext";

// ── Types ─────────────────────────────────────────────────────────────────────

type TeacherData = {
  user: { _id: string; fullName: string; email: string; role: string };
  profile: {
    photoUrl?: string; headline?: string; bio?: string;
    country?: string; language?: string; rating?: number;
    totalStudents?: number; totalSessions?: number; hourlyRate?: number;
    skillsToTeach?: string[]; availability?: string[];
  } | null;
  liveSessions: Session[];
  recordedSessions: Session[];
  skills: string[];
};

type Session = {
  _id: string; title: string; subject: string; description: string;
  type: "live" | "recorded"; mode: "free" | "paid";
  date?: string; time?: string; durationMins: number;
  price?: number; status?: string; enrolledCount?: number;
  meetLink?: string; videoUrl?: string;
};

type ConnectStatus = "none" | "pending" | "accepted" | "declined" | "loading";

// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Syne:wght@500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .tp-root {
    min-height: 100vh; background: #04080f;
    font-family: 'DM Sans', sans-serif; color: #f8fafc;
  }

  /* ── HERO ── */
  .tp-hero {
    position: relative; padding: 80px 0 0; overflow: hidden;
  }
  .tp-hero-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 50% -10%, rgba(99,102,241,0.15), transparent);
  }
  .tp-back {
    position: absolute; top: 24px; left: 24px;
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; border-radius: 100px; padding: 8px 16px;
    font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .tp-back:hover { background: rgba(255,255,255,0.09); color: #f8fafc; }

  .tp-hero-inner {
    max-width: 1100px; margin: 0 auto; padding: 0 32px 48px;
    display: flex; align-items: flex-end; gap: 32px;
    animation: tpFadeUp 0.5s ease both;
  }

  /* avatar */
  .tp-avatar-wrap { position: relative; flex-shrink: 0; }
  .tp-avatar {
    width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
    border: 3px solid rgba(99,102,241,0.4);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.2), 0 8px 32px rgba(0,0,0,0.5);
  }
  .tp-avatar-fallback {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, #1e1b4b, #312e81);
    border: 3px solid rgba(99,102,241,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif; font-size: 38px; font-weight: 700;
    color: #818cf8;
  }
  .tp-role-badge {
    position: absolute; bottom: 4px; right: -4px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; padding: 3px 7px; border-radius: 100px;
    border: 2px solid #04080f;
  }

  /* hero text */
  .tp-hero-info { flex: 1; min-width: 0; }
  .tp-name {
    font-family: 'Clash Display', sans-serif; font-size: 32px; font-weight: 700;
    letter-spacing: -0.5px; color: #f8fafc; margin-bottom: 4px;
  }
  .tp-headline { font-size: 15px; color: #94a3b8; margin-bottom: 12px; }
  .tp-meta-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
  .tp-meta-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif;
  }
  .tp-rating { color: #fbbf24 !important; font-weight: 600; }

  /* connect button area */
  .tp-hero-cta { flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .tp-connect-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 12px 24px; border-radius: 100px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; border: none; cursor: pointer; font-size: 15px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; transition: all 0.3s;
    box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  }
  .tp-connect-btn:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 12px 32px rgba(99,102,241,0.5);
  }
  .tp-connect-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .tp-connect-btn--pending {
    background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3);
    color: #fbbf24; box-shadow: none;
  }
  .tp-connect-btn--accepted {
    background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3);
    color: #4ade80; box-shadow: none;
  }
  .tp-connect-login-hint { font-size: 12px; color: #475569; text-align: right; }

  /* ── BODY ── */
  .tp-body { max-width: 1100px; margin: 0 auto; padding: 0 32px 80px; }
  .tp-grid { display: grid; grid-template-columns: 1fr 340px; gap: 28px; }

  /* ── SECTIONS ── */
  .tp-section { margin-bottom: 28px; animation: tpFadeUp 0.5s ease both; }
  .tp-section-title {
    font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; color: #475569;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .tp-section-title::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0.06), transparent);
  }

  /* bio card */
  .tp-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 22px;
  }
  .tp-bio { font-size: 14px; color: #94a3b8; line-height: 1.7; }

  /* skills */
  .tp-skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .tp-skill-tag {
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
    color: #a5b4fc;
  }

  /* session card */
  .tp-session-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 20px; margin-bottom: 12px;
    transition: all 0.2s;
  }
  .tp-session-card:hover { border-color: rgba(99,102,241,0.25); transform: translateX(3px); }

  .tp-session-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .tp-session-icon {
    width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .tp-session-icon--live     { background: rgba(239,68,68,0.12); }
  .tp-session-icon--recorded { background: rgba(99,102,241,0.12); }

  .tp-session-info { flex: 1; min-width: 0; }
  .tp-session-name {
    font-size: 15px; font-weight: 600; color: #f8fafc; margin-bottom: 2px;
  }
  .tp-session-sub { font-size: 13px; color: #64748b; }

  .tp-session-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
  .tp-badge {
    display: flex; align-items: center; gap: 4px;
    padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 600;
  }
  .tp-badge--free    { background: rgba(34,197,94,0.12); color: #4ade80; }
  .tp-badge--paid    { background: rgba(251,191,36,0.12); color: #fbbf24; }
  .tp-badge--live    { background: rgba(239,68,68,0.12); color: #f87171; }
  .tp-badge--upcoming{ background: rgba(99,102,241,0.12); color: #a5b4fc; }
  .tp-badge--duration{ background: rgba(255,255,255,0.05); color: #64748b; }
  .tp-badge--date    { background: rgba(6,182,212,0.1); color: #22d3ee; }

  .tp-join-btn {
    display: flex; align-items: center; gap: 6px; margin-top: 12px;
    padding: 9px 18px; border-radius: 100px; cursor: pointer;
    font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    border: none; transition: all 0.2s;
  }
  .tp-join-btn--free {
    background: linear-gradient(135deg, #059669, #10b981);
    color: #fff; box-shadow: 0 4px 14px rgba(16,185,129,0.3);
  }
  .tp-join-btn--paid {
    background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3);
    color: #fbbf24;
  }

  /* sidebar */
  .tp-sidebar { }
  .tp-stat-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 22px; margin-bottom: 16px;
  }
  .tp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .tp-stat { text-align: center; }
  .tp-stat-val {
    font-family: 'Clash Display', sans-serif; font-size: 26px; font-weight: 700;
    color: #f8fafc; line-height: 1;
    background: linear-gradient(135deg, #60a5fa, #818cf8);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .tp-stat-label { font-size: 12px; color: #475569; margin-top: 4px; }

  .tp-rate-val {
    font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 700;
    color: #fbbf24; text-align: center; margin-bottom: 4px;
  }
  .tp-rate-label { font-size: 12px; color: #475569; text-align: center; }

  /* empty state */
  .tp-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 32px 20px; color: #334155; font-size: 13px; text-align: center;
    gap: 8px;
  }

  @keyframes tpFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    .tp-hero-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    .tp-hero-cta { align-items: flex-start; }
    .tp-grid { grid-template-columns: 1fr; }
    .tp-body { padding: 0 16px 60px; }
  }
`;

// ── helpers ───────────────────────────────────────────────────────────────────

function fmtDate(date?: string, time?: string) {
  if (!date) return null;
  try {
    const d = new Date(`${date}T${time ?? "00:00"}`);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      + (time ? ` · ${time}` : "");
  } catch { return date; }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TeacherPublicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { fetchAll } = useNotifications();

  const [data, setData]         = useState<TeacherData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>("none");
  const [connectLoading, setConnectLoading] = useState(false);
  const [toast, setToast]       = useState<{ msg: string; ok: boolean } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  // ── Load teacher data ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    api.get(`/teacher/${id}`)
      .then((r) => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setPageLoading(false));
  }, [id]);

  // ── Load connection status ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !id) return;
    api.get(`/connections/status/${id}`)
      .then((r) => setConnectStatus(r.data.status))
      .catch(() => {});
  }, [isAuthenticated, id]);

  // ── Connect ─────────────────────────────────────────────────────────────────
  const handleConnect = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (connectLoading || connectStatus === "pending" || connectStatus === "accepted") return;

    setConnectLoading(true);
    try {
      await api.post(`/connections/${id}`, { message: "" });
      setConnectStatus("pending");
      fetchAll(); // refresh notification bell for the student side
      showToast("Connection request sent!", true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to connect";
      if (msg === "Already connected" || msg === "Connection already exists") {
        setConnectStatus("pending");
      }
      showToast(msg, false);
    } finally {
      setConnectLoading(false);
    }
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Render states ───────────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="tp-root" style={{ display: "grid", placeItems: "center", height: "100vh" }}>
          <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "#6366f1" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <style>{CSS}</style>
        <div className="tp-root" style={{ display: "grid", placeItems: "center", height: "100vh", gap: 12 }}>
          <div style={{ textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#f8fafc", marginBottom: 4 }}>
              Teacher not found
            </div>
            <button className="tp-back" style={{ position: "static", marginTop: 16 }} onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Go back
            </button>
          </div>
        </div>
      </>
    );
  }

  const { user: teacher, profile, liveSessions, recordedSessions, skills } = data;
  const isOwnProfile = user?._id === teacher._id || user?.id === teacher._id;

  const photoUrl = profile?.photoUrl
    ? `${API_URL}/${profile.photoUrl.replace(/\\/g, "/")}`
    : null;
  const initial = teacher.fullName?.charAt(0)?.toUpperCase() ?? "T";

  const connectBtnContent = () => {
    if (connectLoading) return <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>;
    if (connectStatus === "pending")  return <><Clock size={15} /> Pending</>;
    if (connectStatus === "accepted") return <><CheckCircle size={15} /> Connected</>;
    return <><UserPlus size={15} /> Connect</>;
  };

  const connectBtnClass = () => {
    if (connectStatus === "pending")  return "tp-connect-btn tp-connect-btn--pending";
    if (connectStatus === "accepted") return "tp-connect-btn tp-connect-btn--accepted";
    return "tp-connect-btn";
  };

  return (
    <>
      <style>{CSS}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── toast ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, padding: "12px 22px", borderRadius: 100,
          background: toast.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          border: `1px solid ${toast.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          color: toast.ok ? "#4ade80" : "#f87171",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {toast.msg}
        </div>
      )}

      <div className="tp-root">

        {/* ── HERO ── */}
        <div className="tp-hero">
          <div className="tp-hero-glow" />
          <button className="tp-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>

          <div className="tp-hero-inner">
            {/* Avatar */}
            <div className="tp-avatar-wrap">
              {photoUrl
                ? <img src={photoUrl} alt={teacher.fullName} className="tp-avatar" />
                : <div className="tp-avatar-fallback">{initial}</div>
              }
              <span className="tp-role-badge">Teacher</span>
            </div>

            {/* Name + meta */}
            <div className="tp-hero-info">
              <div className="tp-name">{teacher.fullName}</div>
              {profile?.headline && <div className="tp-headline">{profile.headline}</div>}
              <div className="tp-meta-row">
                {profile?.country && (
                  <span className="tp-meta-chip">
                    <MapPin size={13} /> {profile.country}
                  </span>
                )}
                {profile?.language && (
                  <span className="tp-meta-chip">
                    <Globe size={13} /> {profile.language}
                  </span>
                )}
                {profile?.rating !== undefined && profile.rating > 0 && (
                  <span className="tp-meta-chip tp-rating">
                    <Star size={13} /> {profile.rating.toFixed(1)}
                  </span>
                )}
                {profile?.totalStudents !== undefined && (
                  <span className="tp-meta-chip">
                    <Users size={13} /> {profile.totalStudents} students
                  </span>
                )}
                {profile?.totalSessions !== undefined && (
                  <span className="tp-meta-chip">
                    <BookOpen size={13} /> {profile.totalSessions} sessions
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            {!isOwnProfile && (
              <div className="tp-hero-cta">
                <button
                  className={connectBtnClass()}
                  onClick={handleConnect}
                  disabled={connectLoading || connectStatus === "accepted"}
                >
                  {connectBtnContent()}
                </button>
                {!isAuthenticated && (
                  <div className="tp-connect-login-hint">Login to connect</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="tp-body">
          <div className="tp-grid">

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Bio */}
              {profile?.bio && (
                <div className="tp-section" style={{ animationDelay: "0.1s" }}>
                  <div className="tp-section-title"><BookOpen size={12} /> About</div>
                  <div className="tp-card">
                    <div className="tp-bio">{profile.bio}</div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="tp-section" style={{ animationDelay: "0.15s" }}>
                  <div className="tp-section-title"><Star size={12} /> Skills</div>
                  <div className="tp-skills-wrap">
                    {skills.map((s) => (
                      <span key={s} className="tp-skill-tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Sessions */}
              <div className="tp-section" style={{ animationDelay: "0.2s" }}>
                <div className="tp-section-title">
                  <Video size={12} /> Live Sessions
                </div>
                {liveSessions.length === 0 ? (
                  <div className="tp-empty">
                    <Calendar size={24} />
                    No upcoming live sessions
                  </div>
                ) : (
                  liveSessions.map((s) => (
                    <div key={s._id} className="tp-session-card">
                      <div className="tp-session-top">
                        <div className="tp-session-icon tp-session-icon--live">📡</div>
                        <div className="tp-session-info">
                          <div className="tp-session-name">{s.title}</div>
                          <div className="tp-session-sub">{s.subject}</div>
                        </div>
                      </div>
                      {s.description && (
                        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>
                          {s.description}
                        </div>
                      )}
                      <div className="tp-session-badges">
                        <span className={`tp-badge tp-badge--${s.mode}`}>
                          {s.mode === "free" ? <Unlock size={11} /> : <Lock size={11} />}
                          {s.mode === "free" ? "Free" : `₹${s.price}`}
                        </span>
                        <span className={`tp-badge tp-badge--${s.status ?? "upcoming"}`}>
                          {s.status === "live" ? "🔴 Live Now" : "⏰ Upcoming"}
                        </span>
                        <span className="tp-badge tp-badge--duration">
                          <Clock size={11} /> {s.durationMins} min
                        </span>
                        {fmtDate(s.date, s.time) && (
                          <span className="tp-badge tp-badge--date">
                            <Calendar size={11} /> {fmtDate(s.date, s.time)}
                          </span>
                        )}
                      </div>
                      {s.meetLink && (
                        <a href={s.meetLink} target="_blank" rel="noreferrer">
                          <button className={`tp-join-btn tp-join-btn--${s.mode}`}>
                            <Play size={13} />
                            {s.mode === "free" ? "Join Free" : "Join Session"}
                          </button>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Recorded Sessions */}
              <div className="tp-section" style={{ animationDelay: "0.25s" }}>
                <div className="tp-section-title">
                  <Play size={12} /> Recorded Lectures
                </div>
                {recordedSessions.length === 0 ? (
                  <div className="tp-empty">
                    <Video size={24} />
                    No recorded lectures yet
                  </div>
                ) : (
                  recordedSessions.map((s) => (
                    <div key={s._id} className="tp-session-card">
                      <div className="tp-session-top">
                        <div className="tp-session-icon tp-session-icon--recorded">🎬</div>
                        <div className="tp-session-info">
                          <div className="tp-session-name">{s.title}</div>
                          <div className="tp-session-sub">{s.subject}</div>
                        </div>
                      </div>
                      {s.description && (
                        <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginBottom: 8 }}>
                          {s.description}
                        </div>
                      )}
                      <div className="tp-session-badges">
                        <span className={`tp-badge tp-badge--${s.mode}`}>
                          {s.mode === "free" ? <Unlock size={11} /> : <Lock size={11} />}
                          {s.mode === "free" ? "Free" : `₹${s.price}`}
                        </span>
                        <span className="tp-badge tp-badge--duration">
                          <Clock size={11} /> {s.durationMins} min
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div className="tp-sidebar">

              {/* Stats */}
              <div className="tp-stat-card" style={{ animation: "tpFadeUp 0.5s 0.1s ease both" }}>
                <div className="tp-section-title" style={{ marginBottom: 18 }}>Stats</div>
                <div className="tp-stats-grid">
                  <div className="tp-stat">
                    <div className="tp-stat-val">{profile?.totalStudents ?? 0}</div>
                    <div className="tp-stat-label">Students</div>
                  </div>
                  <div className="tp-stat">
                    <div className="tp-stat-val">{profile?.totalSessions ?? 0}</div>
                    <div className="tp-stat-label">Sessions</div>
                  </div>
                  <div className="tp-stat">
                    <div className="tp-stat-val">{liveSessions.length}</div>
                    <div className="tp-stat-label">Live</div>
                  </div>
                  <div className="tp-stat">
                    <div className="tp-stat-val">{recordedSessions.length}</div>
                    <div className="tp-stat-label">Recorded</div>
                  </div>
                </div>
              </div>

              {/* Hourly rate */}
              {profile?.hourlyRate !== undefined && profile.hourlyRate > 0 && (
                <div className="tp-stat-card" style={{ animation: "tpFadeUp 0.5s 0.15s ease both" }}>
                  <div className="tp-rate-val">₹{profile.hourlyRate}<span style={{ fontSize: 14, color: "#64748b" }}>/hr</span></div>
                  <div className="tp-rate-label">Session Rate</div>
                </div>
              )}

              {/* Free sessions count callout */}
              {liveSessions.filter((s) => s.mode === "free").length > 0 && (
                <div style={{
                  animation: "tpFadeUp 0.5s 0.2s ease both",
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: 16, padding: "18px 20px", marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Unlock size={14} style={{ color: "#4ade80" }} />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#4ade80", fontSize: 13 }}>
                      Free Sessions Available
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {liveSessions.filter((s) => s.mode === "free").length} free live session
                    {liveSessions.filter((s) => s.mode === "free").length !== 1 ? "s" : ""} upcoming
                  </div>
                </div>
              )}

              {/* Paid sessions callout */}
              {liveSessions.filter((s) => s.mode === "paid").length > 0 && (
                <div style={{
                  animation: "tpFadeUp 0.5s 0.25s ease both",
                  background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
                  borderRadius: 16, padding: "18px 20px", marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Lock size={14} style={{ color: "#fbbf24" }} />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fbbf24", fontSize: 13 }}>
                      Paid Sessions
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    {liveSessions.filter((s) => s.mode === "paid").length} paid session
                    {liveSessions.filter((s) => s.mode === "paid").length !== 1 ? "s" : ""} available
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}