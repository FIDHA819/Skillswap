import { useEffect, useState } from "react";
import { Users, ArrowRight, Loader2, ExternalLink } from "lucide-react";
import { TdCard, TdCardHead, TdEmpty } from "../../../../shared/utils/UI";
import api from "../../../../infrastructure/api/axios";
import { useNavigate } from "react-router-dom";
import type { Page } from "../../../../domain/entities/teacher";

type ConnectedStudent = {
  connectionId: string;
  connectedAt: string;
  student: {
    _id: string;
    fullName: string;
    email: string;
    profile: {
      photoUrl?: string;
      country?: string;
      headline?: string;
    } | null;
  };
};

interface Props {
  limit?: number;
  onNavigate?: (p: Page) => void;
  onOpenChat?: (studentId: number) => void; // kept for compat — unused
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const COLORS = ["#6366f1","#3b82f6","#ec4899","#10b981","#f59e0b","#8b5cf6"];
function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % COLORS.length;
  return COLORS[h];
}
function getInitials(name: string) {
  return name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}

export default function Students({ limit, onNavigate }: Props) {
  const [students, setStudents] = useState<ConnectedStudent[]>([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/connections/my-students")
      .then(r => setStudents(r.data))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = limit ? students.slice(0, limit) : students;

  return (
    <TdCard>
      <TdCardHead
        icon={<Users size={14} />}
        title={`Students${students.length > 0 ? ` (${students.length})` : ""}`}
        action={
          onNavigate && (
            <button className="td-link-btn" onClick={() => onNavigate("students")}>
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
        <TdEmpty text="No connected students yet." />
      ) : (
        visible.map(({ connectionId, student, connectedAt }) => {
          const color = colorFor(student._id);
          const photo = student.profile?.photoUrl
            ? `${API_URL}/${student.profile.photoUrl.replace(/\\/g, "/")}`
            : null;
          const since = new Date(connectedAt).toLocaleDateString("en-US", { month:"short", day:"numeric" });

          return (
            <div className="td-student-row" key={connectionId}>
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
              <div className="td-student-info">
                <div className="td-student-top">
                  <span className="td-student-name">{student.fullName}</span>
                  <span style={{ fontSize:11, color:"#475569", fontFamily:"'DM Sans',sans-serif" }}>
                    since {since}
                  </span>
                </div>
                <span className="td-student-skill">
                  {student.profile?.headline || student.email}
                  {student.profile?.country ? ` · ${student.profile.country}` : ""}
                </span>
              </div>
              <button
                className="td-chat-btn"
                title="View profile"
                onClick={() => navigate(`/teacher/${student._id}`)}
                style={{ display:"flex", alignItems:"center", gap:4 }}
              >
                <ExternalLink size={13} />
              </button>
            </div>
          );
        })
      )}
    </TdCard>
  );
}