import { useEffect, useState } from "react";
import { Users, Star, MapPin, ExternalLink, Loader2, BookOpen } from "lucide-react";
import api from "../../../../infrastructure/api/axios";
import { useNavigate } from "react-router-dom";

type ConnectedTeacher = {
  connectionId: string;
  connectedAt:  string;
  teacher: {
    _id: string;
    fullName: string;
    email: string;
    profile: {
      photoUrl?: string;
      headline?: string;
      country?: string;
      rating?: number;
      totalStudents?: number;
    } | null;
    skills: string[];
  };
};

const CSS = `
  .ct-root { padding: 100px 0 60px; background: #04080f; min-height: 100vh; }
  .ct-inner { max-width: 1000px; margin: 0 auto; padding: 0 32px; }
  .ct-head { margin-bottom: 36px; animation: ctFade 0.5s ease both; }
  .ct-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
    color: #a5b4fc; margin-bottom: 14px; font-family: 'DM Sans', sans-serif;
  }
  .ct-title { font-family: 'Clash Display', sans-serif; font-size: 30px; font-weight: 700; color: #f8fafc; letter-spacing: -0.5px; margin-bottom: 4px; }
  .ct-sub   { font-size: 14px; color: #475569; font-family: 'DM Sans', sans-serif; }
  .ct-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .ct-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 20px;
    transition: all 0.25s; animation: ctFade 0.4s ease both;
  }
  .ct-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
  .ct-card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 14px; }
  .ct-avatar { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(99,102,241,0.3); flex-shrink: 0; }
  .ct-avatar-fb {
    width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg,#1e1b4b,#312e81);
    border: 2px solid rgba(99,102,241,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #818cf8;
  }
  .ct-info { flex: 1; min-width: 0; }
  .ct-name { font-size: 15px; font-weight: 600; color: #f8fafc; margin-bottom: 2px; font-family: 'DM Sans', sans-serif; }
  .ct-headline { font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ct-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
  .ct-meta-item { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif; }
  .ct-rating { color: #fbbf24 !important; font-weight: 600; }
  .ct-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
  .ct-skill-tag { padding: 3px 9px; border-radius: 100px; font-size: 11px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); color: #a5b4fc; font-family: 'DM Sans', sans-serif; }
  .ct-view-btn {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    width: 100%; padding: 9px; border-radius: 12px;
    background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
    color: #a5b4fc; font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .ct-view-btn:hover { background: rgba(99,102,241,0.2); }
  .ct-empty { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; gap: 12px; color: #334155; font-family: 'DM Sans', sans-serif; text-align: center; }
  @keyframes ctFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @media (max-width: 640px) { .ct-inner { padding: 0 16px; } .ct-grid { grid-template-columns: 1fr; } }
`;

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export default function ConnectedTeachers() {
  const [teachers, setTeachers] = useState<ConnectedTeacher[]>([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/connections/my-teachers")
      .then(r => setTeachers(r.data))
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="ct-root">
        <div className="ct-inner">
          <div className="ct-head">
            <div className="ct-chip"><Users size={12} /> My Teachers</div>
            <div className="ct-title">Connected Teachers</div>
            <div className="ct-sub">Teachers you're connected with</div>
          </div>

          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:"60px 0" }}>
              <Loader2 size={28} style={{ animation:"spin 1s linear infinite", color:"#6366f1" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : teachers.length === 0 ? (
            <div className="ct-empty">
              <Users size={32} />
              <div style={{ color:"#94a3b8", fontWeight:600, fontSize:16 }}>No connected teachers yet</div>
              <div>Browse teachers and send a connection request to get started</div>
            </div>
          ) : (
            <div className="ct-grid">
              {teachers.map(({ connectionId, teacher }, i) => {
                const photo = teacher.profile?.photoUrl
                  ? `${API_URL}/${teacher.profile.photoUrl.replace(/\\/g, "/")}`
                  : null;
                const initial = teacher.fullName?.charAt(0)?.toUpperCase() ?? "T";

                return (
                  <div key={connectionId} className="ct-card" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="ct-card-top">
                      {photo
                        ? <img src={photo} alt={teacher.fullName} className="ct-avatar" />
                        : <div className="ct-avatar-fb">{initial}</div>
                      }
                      <div className="ct-info">
                        <div className="ct-name">{teacher.fullName}</div>
                        {teacher.profile?.headline && (
                          <div className="ct-headline">{teacher.profile.headline}</div>
                        )}
                      </div>
                    </div>

                    <div className="ct-meta">
                      {teacher.profile?.country && (
                        <span className="ct-meta-item"><MapPin size={11} /> {teacher.profile.country}</span>
                      )}
                      {(teacher.profile?.rating ?? 0) > 0 && (
                        <span className="ct-meta-item ct-rating"><Star size={11} /> {teacher.profile!.rating!.toFixed(1)}</span>
                      )}
                      {(teacher.profile?.totalStudents ?? 0) > 0 && (
                        <span className="ct-meta-item"><Users size={11} /> {teacher.profile!.totalStudents} students</span>
                      )}
                    </div>

                    {teacher.skills.length > 0 && (
                      <div className="ct-skills">
                        {teacher.skills.slice(0, 4).map(s => (
                          <span key={s} className="ct-skill-tag">{s}</span>
                        ))}
                        {teacher.skills.length > 4 && (
                          <span className="ct-skill-tag">+{teacher.skills.length - 4}</span>
                        )}
                      </div>
                    )}

                    <button className="ct-view-btn" onClick={() => navigate(`/teacher/${teacher._id}`)}>
                      <ExternalLink size={13} /> View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}