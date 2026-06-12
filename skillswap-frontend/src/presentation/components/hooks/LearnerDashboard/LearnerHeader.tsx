import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  ChevronDown, Search, LogOut, UserCircle,
  Pencil, Settings, Sparkles,
} from "lucide-react";
import NotificationBell from "../../../components/hooks/LearnerDashboard/NotificationBell";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=Syne:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

  .lh-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 40px;
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    transition: all 0.3s ease;
  }
  .lh-header--scrolled {
    background: rgba(4,8,15,0.93);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .lh-header--top { background: rgba(4,8,15,0.55); border-bottom: 1px solid transparent; }

  .lh-inner {
    max-width: 1280px; margin: 0 auto;
    height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .lh-left  { display: flex; align-items: center; gap: 32px; }
  .lh-right { display: flex; align-items: center; gap: 10px; }

  /* logo */
  .lh-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .lh-logo__img  { width: 38px; height: 38px; border-radius: 10px; object-fit: cover; }
  .lh-logo__text {
    font-family: 'Clash Display', sans-serif; font-weight: 700;
    font-size: 20px; color: #f8fafc; letter-spacing: -0.3px;
  }

  /* nav */
  .lh-nav { display: flex; gap: 2px; }
  .lh-nav__a {
    padding: 8px 16px; border-radius: 100px;
    font-size: 14px; color: #94a3b8; text-decoration: none;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .lh-nav__a:hover { color: #f8fafc; background: rgba(255,255,255,0.06); }

  /* search */
  .lh-search {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; padding: 9px 18px; width: 220px; transition: all 0.3s;
  }
  .lh-search:focus-within {
    border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.05); width: 260px;
  }
  .lh-search input {
    background: transparent; border: none; outline: none;
    font-size: 14px; color: #f8fafc; width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .lh-search input::placeholder { color: #64748b; }

  /* switch btn */
  .lh-switch {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: #fff; border: none; padding: 9px 18px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.3s; white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }
  .lh-switch:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }

  /* user pill */
  .lh-pill {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px; padding: 4px 12px 4px 4px;
    cursor: pointer; transition: all 0.2s;
  }
  .lh-pill:hover, .lh-pill--open { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.16); }
  .lh-pill__photo {
    width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
    border: 1.5px solid rgba(99,102,241,0.4); flex-shrink: 0;
  }
  .lh-pill__init {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(99,102,241,0.15); border: 1.5px solid rgba(99,102,241,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: #818cf8; flex-shrink: 0;
  }
  .lh-pill__name {
    font-size: 13px; color: #f8fafc; font-weight: 500;
    max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .lh-chevron { color: #64748b; transition: transform 0.25s; flex-shrink: 0; }
  .lh-chevron--open { transform: rotate(180deg); }

  /* dropdown */
  .lh-drop {
    position: absolute; right: 0; top: calc(100% + 8px);
    width: 224px; background: #111827;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55); z-index: 200;
    animation: lhFadeIn 0.18s ease;
  }
  @keyframes lhFadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }

  .lh-drop__head {
    padding: 14px 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 10px;
  }
  .lh-drop__photo {
    width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
    border: 1.5px solid rgba(99,102,241,0.35); flex-shrink: 0;
  }
  .lh-drop__init {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(99,102,241,0.15); border: 1.5px solid rgba(99,102,241,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #818cf8; flex-shrink: 0;
  }
  .lh-drop__name {
    font-size: 13px; font-weight: 600; color: #f8fafc;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .lh-drop__email { font-size: 11px; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .lh-drop__body { padding: 6px 0; }
  .lh-drop__item {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 10px 16px; background: transparent; border: none;
    color: #94a3b8; font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s; text-align: left;
  }
  .lh-drop__item:hover { background: rgba(255,255,255,0.05); color: #f8fafc; }
  .lh-drop__divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0; }
  .lh-drop__logout {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 10px 16px; background: transparent; border: none;
    color: #f87171; font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .lh-drop__logout:hover { background: rgba(239,68,68,0.08); }

  @media (max-width: 900px) {
    .lh-header { padding: 0 16px; }
    .lh-nav { display: none; }
    .lh-search { width: 160px; }
    .lh-search:focus-within { width: 180px; }
  }
`;

export default function LearnerHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleLogout = () => { setDropOpen(false); logout(); navigate("/"); };

  const firstName = user?.fullName?.split(" ")[0] || "You";
  const initial   = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  const photoSrc = user?.photoUrl
    ? `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/${user.photoUrl.replace(/\\/g, "/")}`
    : null;

  return (
    <>
      <style>{CSS}</style>
      <header className={`lh-header ${scrolled ? "lh-header--scrolled" : "lh-header--top"}`}>
        <div className="lh-inner">

          {/* LEFT */}
          <div className="lh-left">
            <Link to="/dashboard" className="lh-logo">
              <img src="/assets/logo.png" alt="SkillSwap" className="lh-logo__img" />
              <span className="lh-logo__text">SkillSwap</span>
            </Link>
            <nav className="lh-nav">
              {[
                { label: "Home",        to: "/dashboard"   },
                { label: "Explore",     to: "/explore"     },
                { label: "Leaderboard", to: "/leaderboard" },
              ].map(({ label, to }) => (
                <Link key={to} to={to} className="lh-nav__a">{label}</Link>
              ))}
            </nav>
          </div>

          {/* CENTER */}
          <div className="lh-search">
            <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
            <input placeholder="Search skills, teachers…" />
          </div>

          {/* RIGHT */}
          <div className="lh-right">
            <button className="lh-switch" onClick={() => navigate("/teacher/dashboard")}>
              <Sparkles size={13} /> Teach
            </button>

            {/* Notification bell from context */}
            <NotificationBell />

            {/* User dropdown */}
            <div style={{ position: "relative" }} ref={dropRef}>
              <button
                className={`lh-pill ${dropOpen ? "lh-pill--open" : ""}`}
                onClick={() => setDropOpen((o) => !o)}
              >
                {photoSrc
                  ? <img src={photoSrc} alt={user?.fullName} className="lh-pill__photo" />
                  : <div className="lh-pill__init">{initial}</div>
                }
                <span className="lh-pill__name">{firstName}</span>
                <ChevronDown size={13} className={`lh-chevron ${dropOpen ? "lh-chevron--open" : ""}`} />
              </button>

              {dropOpen && (
                <div className="lh-drop">
                  <div className="lh-drop__head">
                    {photoSrc
                      ? <img src={photoSrc} alt={user?.fullName} className="lh-drop__photo" />
                      : <div className="lh-drop__init">{initial}</div>
                    }
                    <div style={{ overflow: "hidden" }}>
                      <div className="lh-drop__name">{user?.fullName || "User"}</div>
                      <div className="lh-drop__email">{user?.email || ""}</div>
                    </div>
                  </div>
                  <div className="lh-drop__body">
                    <button className="lh-drop__item" onClick={() => { setDropOpen(false); navigate("/profile"); }}>
                      <UserCircle size={15} /> View Profile
                    </button>
                    <button className="lh-drop__item" onClick={() => { setDropOpen(false); navigate("/profile/edit"); }}>
                      <Pencil size={15} /> Edit Profile
                    </button>
                    <button className="lh-drop__item" onClick={() => { setDropOpen(false); navigate("/settings"); }}>
                      <Settings size={15} /> Settings
                    </button>
                  </div>
                  <hr className="lh-drop__divider" />
                  <button className="lh-drop__logout" onClick={handleLogout}>
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}