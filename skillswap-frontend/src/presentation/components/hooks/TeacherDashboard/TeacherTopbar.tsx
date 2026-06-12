import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import { ArrowLeft, Sparkles } from "lucide-react";
import NotificationBell from "../../../components/hooks/LearnerDashboard/NotificationBell";
import type { Page } from "../../../../domain/entities/teacher";

interface Props {
  page: Page;
  pendingCount: number;
}

const PAGE_LABELS: Record<Page, { title: string; sub: string }> = {
  overview:  { title: "Overview",        sub: "Welcome back — here's your day at a glance" },
  sessions:  { title: "Sessions",        sub: "Manage your live and recorded sessions" },
  requests:  { title: "Requests",        sub: "Students waiting for your response" },
  students:  { title: "Students",        sub: "Manage and track your learners" },
  chat:      { title: "Messages",        sub: "Chat with your students" },
  reviews:   { title: "Reviews",         sub: "Feedback from your students" },
  skills:    { title: "Skills",          sub: "Skills you teach and their engagement" },
  profile:   { title: "Profile",         sub: "Your public teacher profile" },
  settings:  { title: "Settings",        sub: "Account and notification preferences" },
  calendar:  { title: "Calendar",        sub: "Your schedule and upcoming sessions" },
};

const CSS = `
  .tt-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 32px 16px; flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: #04080f;
  }
  .tt-left {}
  .tt-title {
    font-family: 'Clash Display', sans-serif; font-size: 22px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.3px; margin: 0 0 2px;
  }
  .tt-sub {
    font-size: 13px; color: #475569; font-family: 'DM Sans', sans-serif; margin: 0;
  }
  .tt-right { display: flex; align-items: center; gap: 10px; }

  .tt-alert {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 100px;
    background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.25);
    color: #fbbf24; font-size: 12px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    animation: ttPulse 2s ease-in-out infinite;
  }
  @keyframes ttPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.2); }
    50% { box-shadow: 0 0 0 4px rgba(251,191,36,0); }
  }
  .tt-alert-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #fbbf24;
    animation: ttDot 1.5s ease-in-out infinite;
  }
  @keyframes ttDot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }

  .tt-switch {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 100px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all 0.2s;
  }
  .tt-switch:hover { background: rgba(255,255,255,0.09); color: #f8fafc; }
`;

export default function TeacherTopbar({ page, pendingCount }: Props) {
  const navigate = useNavigate();
  const { title, sub } = PAGE_LABELS[page] ?? PAGE_LABELS.overview;

  return (
    <>
      <style>{CSS}</style>
      <div className="tt-bar">
        <div className="tt-left">
          <h1 className="tt-title">{title}</h1>
          <p className="tt-sub">{sub}</p>
        </div>

        <div className="tt-right">
          {pendingCount > 0 && (
            <div className="tt-alert">
              <span className="tt-alert-dot" />
              {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
            </div>
          )}

          <NotificationBell />

          <button className="tt-switch" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={13} /> Learner Mode
          </button>
        </div>
      </div>
    </>
  );
}