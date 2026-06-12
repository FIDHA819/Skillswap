import { useEffect, useState } from "react";
import { Star, Users, MapPin, UserPlus, CheckCircle, Clock, Loader2, Sparkles } from "lucide-react";
import api from "../../../../infrastructure/api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

type Teacher = {
  _id: string;
  fullName: string;
  role: string;
  profile: {
    photoUrl?: string;
    headline?: string;
    country?: string;
    rating?: number;
    totalStudents?: number;
  } | null;
};

type ConnectMap = Record<string, "none"|"pending"|"accepted"|"loading">;

const EMOJI_MAP: Record<string,string> = {
  React:"⚛️","Next.js":"▲",Python:"🐍",Figma:"🎯","UI/UX Design":"🎨",
  JavaScript:"🟨",TypeScript:"📘",MongoDB:"🍃",Docker:"🐳","Machine Learning":"🤖",
};
const getEmoji = (n:string) => EMOJI_MAP[n] ?? "📚";

const CSS = `
  .rt-section { padding: 60px 0; }
  .rt-container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  .rt-head { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; }
  .rt-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 14px; border-radius:100px; font-size:13px; font-weight:500;
    background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.25);
    color:#a5b4fc; margin-bottom:12px; font-family:'DM Sans',sans-serif;
  }
  .rt-title { font-family:'Syne',sans-serif; font-size:32px; font-weight:700; color:#f8fafc; letter-spacing:-0.5px; }
  .rt-title-grad { background:linear-gradient(135deg,#60a5fa,#818cf8 50%,#c084fc); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .rt-skill-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:32px; }
  .rt-skill-tab {
    display:flex; align-items:center; gap:6px; padding:7px 16px; border-radius:100px;
    border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03);
    color:#64748b; font-size:13px; font-weight:500; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:all 0.2s;
  }
  .rt-skill-tab:hover { border-color:rgba(99,102,241,0.3); color:#a5b4fc; }
  .rt-skill-tab.active { background:rgba(99,102,241,0.12); border-color:rgba(99,102,241,0.35); color:#a5b4fc; }
  .rt-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  .rt-card {
    background:#111827; border:1px solid rgba(255,255,255,0.07);
    border-radius:20px; padding:20px; transition:all 0.25s;
    animation:rtFade 0.4s ease both;
  }
  .rt-card:hover { border-color:rgba(99,102,241,0.25); transform:translateY(-3px); box-shadow:0 12px 36px rgba(0,0,0,0.3); }
  .rt-card-top { display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .rt-avatar { width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid rgba(99,102,241,0.3); flex-shrink:0; }
  .rt-avatar-fb {
    width:52px; height:52px; border-radius:50%; flex-shrink:0;
    background:linear-gradient(135deg,#1e1b4b,#312e81);
    border:2px solid rgba(99,102,241,0.3);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#818cf8;
  }
  .rt-name { font-size:15px; font-weight:600; color:#f8fafc; margin-bottom:2px; font-family:'DM Sans',sans-serif; }
  .rt-headline { font-size:12px; color:#64748b; font-family:'DM Sans',sans-serif; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rt-meta { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:14px; }
  .rt-meta-item { display:flex; align-items:center; gap:4px; font-size:12px; color:#64748b; font-family:'DM Sans',sans-serif; }
  .rt-rating { color:#fbbf24 !important; font-weight:600; }
  .rt-btn-row { display:flex; gap:8px; }
  .rt-view-btn {
    flex:1; padding:8px; border-radius:10px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
    color:#94a3b8; font-size:13px; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s;
  }
  .rt-view-btn:hover { background:rgba(255,255,255,0.08); color:#f8fafc; }
  .rt-connect-btn {
    flex:1.2; padding:8px; border-radius:10px; border:none;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    color:#fff; font-size:13px; font-weight:600; cursor:pointer;
    font-family:'DM Sans',sans-serif; display:flex; align-items:center; justify-content:center; gap:5px;
    transition:all 0.2s; box-shadow:0 4px 12px rgba(99,102,241,0.25);
  }
  .rt-connect-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(99,102,241,0.4); }
  .rt-connect-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .rt-connect-btn--pending { background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.3); color:#fbbf24; box-shadow:none; }
  .rt-connect-btn--accepted { background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); color:#4ade80; box-shadow:none; }
  .rt-empty { display:flex; flex-direction:column; align-items:center; padding:40px 20px; gap:10px; color:#334155; font-family:'DM Sans',sans-serif; text-align:center; }
  @keyframes rtFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @media (max-width:768px) { .rt-container{padding:0 20px;} .rt-title{font-size:24px;} .rt-grid{grid-template-columns:1fr;} }
`;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

interface Props {
  learnerSkills: string[];
}

export default function RecommendedTeachers({ learnerSkills }: Props) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSkill, setActiveSkill] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading]   = useState(false);
  const [connectMap, setConnectMap] = useState<ConnectMap>({});

  // Set default skill when learnerSkills loads
  useEffect(() => {
    if (learnerSkills.length > 0 && !activeSkill) {
      setActiveSkill(learnerSkills[0]);
    }
  }, [learnerSkills]);

  // Fetch teachers for active skill
  useEffect(() => {
    if (!activeSkill) return;
    setLoading(true);
    api.get(`/skills/${encodeURIComponent(activeSkill)}/teachers`)
      .then(r => {
        setTeachers(r.data.teachers ?? []);
        // Check connection status for each teacher
        if (isAuthenticated) {
          (r.data.teachers ?? []).forEach((t: Teacher) => {
            api.get(`/connections/status/${t._id}`)
              .then(sr => setConnectMap(m => ({ ...m, [t._id]: sr.data.status })))
              .catch(() => {});
          });
        }
      })
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  }, [activeSkill, isAuthenticated]);

  const handleConnect = async (teacherId: string) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setConnectMap(m => ({ ...m, [teacherId]: "loading" }));
    try {
      await api.post(`/connections/${teacherId}`, { message: "" });
      setConnectMap(m => ({ ...m, [teacherId]: "pending" }));
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "";
      if (msg.includes("already")) setConnectMap(m => ({ ...m, [teacherId]: "pending" }));
      else setConnectMap(m => ({ ...m, [teacherId]: "none" }));
    }
  };

  if (learnerSkills.length === 0) return null;

  return (
    <>
      <style>{CSS}</style>
      <section className="rt-section">
        <div className="rt-container">
          <div className="rt-head">
            <div>
              <div className="rt-chip"><Sparkles size={12} /> Based on your skills</div>
              <div className="rt-title">
                Recommended <span className="rt-title-grad">Teachers</span>
              </div>
            </div>
          </div>

          {/* Skill tabs */}
          <div className="rt-skill-tabs">
            {learnerSkills.map(skill => (
              <button
                key={skill}
                className={`rt-skill-tab${activeSkill === skill ? " active" : ""}`}
                onClick={() => setActiveSkill(skill)}
              >
                {getEmoji(skill)} {skill}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"40px 0" }}>
              <Loader2 size={28} style={{ animation:"spin 1s linear infinite", color:"#6366f1" }} />
            </div>
          ) : teachers.length === 0 ? (
            <div className="rt-empty">
              <Sparkles size={28} />
              <div style={{ color:"#94a3b8", fontWeight:600 }}>No teachers yet for {activeSkill}</div>
              <div>Be the first to explore this skill!</div>
            </div>
          ) : (
            <div className="rt-grid">
              {teachers.map((t, i) => {
                const photo = t.profile?.photoUrl
                  ? `${API_URL}/${t.profile.photoUrl.replace(/\\/g, "/")}`
                  : null;
                const initial = t.fullName?.charAt(0)?.toUpperCase() ?? "T";
                const status  = connectMap[t._id] ?? "none";

                return (
                  <div key={t._id} className="rt-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="rt-card-top">
                      {photo
                        ? <img src={photo} alt={t.fullName} className="rt-avatar" />
                        : <div className="rt-avatar-fb">{initial}</div>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="rt-name">{t.fullName}</div>
                        {t.profile?.headline && <div className="rt-headline">{t.profile.headline}</div>}
                      </div>
                    </div>

                    <div className="rt-meta">
                      {t.profile?.country && (
                        <span className="rt-meta-item"><MapPin size={11} /> {t.profile.country}</span>
                      )}
                      {(t.profile?.rating ?? 0) > 0 && (
                        <span className="rt-meta-item rt-rating"><Star size={11} /> {t.profile!.rating!.toFixed(1)}</span>
                      )}
                      {(t.profile?.totalStudents ?? 0) > 0 && (
                        <span className="rt-meta-item"><Users size={11} /> {t.profile!.totalStudents}</span>
                      )}
                    </div>

                    <div className="rt-btn-row">
                      <button className="rt-view-btn" onClick={() => navigate(`/teacher/${t._id}`)}>
                        View
                      </button>
                      <button
                        className={`rt-connect-btn${status === "pending" ? " rt-connect-btn--pending" : status === "accepted" ? " rt-connect-btn--accepted" : ""}`}
                        disabled={status === "loading" || status === "accepted"}
                        onClick={() => handleConnect(t._id)}
                      >
                        {status === "loading"   && <Loader2 size={12} style={{ animation:"spin 1s linear infinite" }} />}
                        {status === "none"     && <><UserPlus size={12} /> Connect</>}
                        {status === "pending"  && <><Clock size={12} /> Pending</>}
                        {status === "accepted" && <><CheckCircle size={12} /> Connected</>}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}