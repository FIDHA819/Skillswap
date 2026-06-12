import { useEffect, useState } from "react";
import { Bell, ArrowRight, Check, X, Loader2, UserPlus } from "lucide-react";
import { TdCard, TdCardHead, TdEmpty } from "../../../../shared/utils/UI";
import api from "../../../../infrastructure/api/axios";
import type { Page } from "../../../../domain/entities/teacher";

type ConnectionRequest = {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
  };
  studentProfile: {
    photoUrl?: string;
    country?: string;
    headline?: string;
  } | null;
  message?: string;
  createdAt: string;
};

interface Props {
  limit?: number;
  onNavigate?: (p: Page) => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

function getInitials(name: string) {
  return name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}

const COLORS = ["#6366f1","#3b82f6","#ec4899","#10b981","#f59e0b","#8b5cf6"];
function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}

export default function UpcomingRequests({ limit, onNavigate }: Props) {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/connections/requests");
      setRequests(res.data);
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleAccept = async (connectionId: string) => {
    setActing(connectionId);
    try {
      await api.patch(`/connections/${connectionId}/accept`);
      setRequests(prev => prev.filter(r => r._id !== connectionId));
    } catch {}
    finally { setActing(null); }
  };

  const handleDecline = async (connectionId: string) => {
    setActing(connectionId);
    try {
      await api.patch(`/connections/${connectionId}/decline`);
      setRequests(prev => prev.filter(r => r._id !== connectionId));
    } catch {}
    finally { setActing(null); }
  };

  const visible = limit ? requests.slice(0, limit) : requests;

  return (
    <TdCard>
      <TdCardHead
        icon={<Bell size={14} />}
        title={`Requests${requests.length > 0 ? ` (${requests.length})` : ""}`}
        action={
          onNavigate && (
            <button className="td-link-btn" onClick={() => onNavigate("requests")}>
              View all <ArrowRight size={11} />
            </button>
          )
        }
      />

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"32px 0" }}>
          <Loader2 size={22} style={{ animation:"spin 1s linear infinite", color:"#6366f1" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : visible.length === 0 ? (
        <TdEmpty text="All caught up — no pending requests!" />
      ) : (
        visible.map(r => {
          const student = r.studentId;
          const color   = colorFor(student._id);
          const photo   = r.studentProfile?.photoUrl
            ? `${API_URL}/${r.studentProfile.photoUrl.replace(/\\/g, "/")}`
            : null;

          return (
            <div className="td-req-row" key={r._id}>
              {photo
                ? <img src={photo} alt={student.fullName} style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", flexShrink:0, border:`2px solid ${color}40` }} />
                : (
                  <div style={{
                    width:36, height:36, borderRadius:"50%", flexShrink:0,
                    background:`linear-gradient(135deg,${color},#0f172a)`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:12, fontWeight:700, color:"#fff"
                  }}>
                    {getInitials(student.fullName)}
                  </div>
                )
              }
              <div className="td-req-info">
                <span className="td-req-name">{student.fullName}</span>
                <span className="td-req-skill">
                  {r.studentProfile?.headline || student.email}
                  {r.message ? ` · "${r.message}"` : ""}
                </span>
              </div>
              <div className="td-req-actions">
                <button
                  className="td-btn-accept"
                  disabled={acting === r._id}
                  onClick={() => handleAccept(r._id)}
                >
                  {acting === r._id
                    ? <Loader2 size={10} style={{ animation:"spin 1s linear infinite" }} />
                    : <Check size={11} />
                  }
                  Accept
                </button>
                <button
                  className="td-btn-decline"
                  disabled={acting === r._id}
                  onClick={() => handleDecline(r._id)}
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </TdCard>
  );
}