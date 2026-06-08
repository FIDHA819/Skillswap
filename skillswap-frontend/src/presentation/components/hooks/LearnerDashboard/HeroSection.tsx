import { ArrowRight, Play, Users, BookOpen, Star, TrendingUp, Award, Sparkles } from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext"
const CSS = `
  .ss-hero {
    padding-top: 160px; padding-bottom: 120px;
    position: relative; overflow: hidden;
  }
  .ss-hero__blob1 {
    position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
    width: 800px; height: 800px; pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%);
  }
  .ss-hero__blob2 {
    position: absolute; top: 100px; right: -200px;
    width: 500px; height: 500px; border-radius: 50%; pointer-events: none;
    background: radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%);
    animation: blobMove 8s ease-in-out infinite;
  }
  .ss-hero__grid {
    max-width: 1280px; margin: 0 auto; padding: 0 40px;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center; position: relative; z-index: 1;
  }
  .ss-hero__left { animation: fadeUp 0.7s ease forwards; }
  .ss-hero__chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px;
    font-weight: 500; border: 1px solid;
    background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.25);
    color: #60a5fa; margin-bottom: 24px;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-hero__h1 {
    font-family: 'Clash Display', sans-serif;
    font-size: clamp(44px, 5vw, 64px);
    font-weight: 700; line-height: 1.08; letter-spacing: -1.5px;
    color: #f8fafc; margin-bottom: 24px;
  }
  .ss-hero__p {
    font-size: 17px; line-height: 1.7; color: #94a3b8;
    margin-bottom: 40px; max-width: 420px;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-hero__actions { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
  .ss-hero__btn-primary {
    background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff;
    border: none; padding: 14px 28px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
    cursor: pointer; transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .ss-hero__btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(59,130,246,0.35);
    background: linear-gradient(135deg, #60a5fa, #818cf8);
  }
  .ss-hero__btn-ghost {
    background: transparent; border: 1px solid rgba(255,255,255,0.12);
    color: #94a3b8; padding: 12px 22px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    cursor: pointer; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .ss-hero__btn-ghost:hover { border-color: #3b82f6; color: #60a5fa; }
  .ss-hero__stats { display: flex; gap: 12px; flex-wrap: wrap; }
  .ss-hero__stat {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 18px; border-radius: 100px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
  }
  .ss-hero__stat-label { font-size: 13px; color: #94a3b8; }
  .ss-hero__stat-val   { font-size: 13px; font-weight: 600; color: #f8fafc; }

  /* ── RIGHT FLOATING UI ── */
  .ss-hero__right {
    position: relative; height: 480px;
    animation: fadeUp 0.8s 0.2s ease both;
  }
  .ss-hero__main-card {
    position: absolute; top: 40px; left: 20px; right: 20px;
    border-radius: 24px; padding: 28px;
    background: rgba(17,24,39,0.75);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.07);
    animation: float 5s ease-in-out infinite;
  }
  .ss-hero__card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .ss-hero__card-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: rgba(139,92,246,0.2); border: 1.5px solid rgba(139,92,246,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 16px; color: #a78bfa;
  }
  .ss-hero__card-name { font-size: 16px; font-weight: 600; color: #f8fafc; font-family: 'DM Sans', sans-serif; }
  .ss-hero__card-sub  { font-size: 13px; color: #94a3b8; font-family: 'DM Sans', sans-serif; }
  .ss-hero__live-chip {
    margin-left: auto; display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 100px; font-size: 11px; font-weight: 600;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); color: #a78bfa;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-hero__bar-track {
    height: 8px; border-radius: 100px;
    background: rgba(255,255,255,0.05); margin-bottom: 8px;
  }
  .ss-hero__bar-fill {
    width: 72%; height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
  }
  .ss-hero__bar-labels {
    display: flex; justify-content: space-between;
    font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif;
  }
  .ss-hero__badge {
    position: absolute;
    border-radius: 16px; padding: 12px 18px;
    display: flex; align-items: center; gap: 10px;
    background: rgba(17,24,39,0.75);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.07);
  }
  .ss-hero__badge--skills {
    bottom: 120px; left: 0;
    animation: float 4s 1s ease-in-out infinite;
  }
  .ss-hero__badge--award {
    bottom: 50px; right: 10px;
    animation: float 6s 2s ease-in-out infinite;
  }
  .ss-hero__badge--score {
    top: 0; right: -10px;
    flex-direction: column; align-items: flex-start;
    animation: float 5s 0.5s ease-in-out infinite;
  }
  .ss-hero__badge-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(59,130,246,0.15);
    display: flex; align-items: center; justify-content: center;
  }
  .ss-hero__badge-title { font-size: 13px; font-weight: 600; color: #f8fafc; font-family: 'DM Sans', sans-serif; }
  .ss-hero__badge-sub   { font-size: 12px; color: #94a3b8; font-family: 'DM Sans', sans-serif; }
  .ss-hero__score-label { font-size: 11px; color: #64748b; font-family: 'DM Sans', sans-serif; margin-bottom: 2px; }
  .ss-hero__score-val {
    font-family: 'Clash Display', sans-serif; font-size: 28px; font-weight: 700;
    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes blobMove {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }

  @media (max-width: 900px) {
    .ss-hero__grid { grid-template-columns: 1fr; gap: 60px; }
    .ss-hero__right { height: 360px; }
    .ss-hero { padding-top: 120px; }
  }
`;

export default function HeroSection() {
const { user } = useAuth()

const initial =
  user?.fullName
    ?.charAt(0)
    ?.toUpperCase() || "T"
  return (

    <>
      <style>{CSS}</style>
      
      <section className="ss-hero">
        <div className="ss-hero__blob1" />
        <div className="ss-hero__blob2" />

        <div className="ss-hero__grid">
          {/* ── LEFT ── */}
          <div className="ss-hero__left">
            <div className="ss-hero__chip">
              <Sparkles size={13} /> New: AI-Powered Matching
            </div>

            <h1 className="ss-hero__h1">
              Swap Skills.<br />
              <span style={{
                background: "linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#c084fc 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Learn Together.</span><br />
              Grow Faster.
            </h1>

            <p className="ss-hero__p">
              Connect with expert teachers, share what you know, and unlock a world
              of peer-to-peer learning — completely free.
            </p>

            <div className="ss-hero__actions">
              <button className="ss-hero__btn-primary">
                Complete Profile <ArrowRight size={16} />
              </button>
              <button className="ss-hero__btn-ghost">
                <Play size={14} /> Watch Demo
              </button>
            </div>

            <div className="ss-hero__stats">
              {[
                { Icon: Users,    label: "Active learners", value: "12.4k" },
                { Icon: BookOpen, label: "Skills",          value: "340+"  },
                { Icon: Star,     label: "Avg. rating",     value: "4.9"   },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="ss-hero__stat">
                  <Icon size={15} color="#60a5fa" />
                  <span className="ss-hero__stat-label">{label}</span>
                  <span className="ss-hero__stat-val">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="ss-hero__right">
            {/* Main session card */}
            <div className="ss-hero__main-card">
              <div className="ss-hero__card-top">
               <div className="ss-hero__card-avatar">

  {user?.photoUrl ? (

    <img
      src={user.photoUrl}
      alt={user.fullName}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />

  ) : (

    initial

  )}

</div>
                <div>
                 <div className="ss-hero__card-name">
  {user?.fullName || "Learner"}
</div>

<div className="ss-hero__card-sub">
  {user?.email || ""}
</div>
                </div>
                <div className="ss-hero__live-chip">⚡ Live</div>
              </div>
              <div className="ss-hero__bar-track">
                <div className="ss-hero__bar-fill" />
              </div>
              <div className="ss-hero__bar-labels">
                <span>Session progress</span><span>72%</span>
              </div>
            </div>

            {/* Skills badge */}
            <div className="ss-hero__badge ss-hero__badge--skills">
              <div className="ss-hero__badge-icon">
                <TrendingUp size={18} color="#8cb6e9" />
              </div>
              <div>
                <div className="ss-hero__badge-title">Skills Learned</div>
                <div className="ss-hero__badge-sub">+3 this week</div>
              </div>
            </div>

            {/* Award badge */}
            <div className="ss-hero__badge ss-hero__badge--award">
              <Award size={20} color="#fbbf24" />
              <div className="ss-hero__badge-title">Top Learner 🏆</div>
            </div>

            {/* Match score */}
            <div className="ss-hero__badge ss-hero__badge--score">
              <div className="ss-hero__score-label">Match Score</div>
              <div className="ss-hero__score-val">98%</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}