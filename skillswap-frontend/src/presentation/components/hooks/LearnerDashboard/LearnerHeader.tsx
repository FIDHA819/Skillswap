import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Bell, MessageCircle, ChevronDown, Search,
  LogOut, UserCircle, Pencil, Settings, Sparkles,
} from "lucide-react";

const CSS = `
  .ss-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 40px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    transition: all 0.4s ease;
  }
  .ss-header--scrolled {
    background: rgba(4,8,15,0.92);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .ss-header--top {
    background: rgba(4,8,15,0.5);
    border-bottom: 1px solid transparent;
  }
  .ss-header__inner {
    max-width: 1280px; margin: 0 auto;
    height: 72px; display: flex; align-items: center; justify-content: space-between;
  }
  .ss-header__left  { display: flex; align-items: center; gap: 36px; }
  .ss-header__right { display: flex; align-items: center; gap: 12px; }

  .ss-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .ss-logo__img {
    width: 40px; height: 40px; border-radius: 10px; object-fit: cover;
  }
  .ss-logo__text {
    font-family: 'Clash Display', sans-serif; font-weight: 700;
    font-size: 20px; color: #f8fafc; letter-spacing: -0.3px;
  }

  .ss-nav { display: flex; gap: 2px; }
  .ss-nav__link {
    padding: 8px 16px; border-radius: 100px;
    font-size: 14px; font-weight: 400; color: #94a3b8;
    text-decoration: none; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    background: transparent;
  }
  .ss-nav__link:hover { color: #f8fafc; background: rgba(255,255,255,0.06); }

  .ss-search {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 100px; padding: 9px 18px;
    width: 240px; transition: all 0.3s;
  }
  .ss-search:focus-within {
    border-color: rgba(59,130,246,0.4);
    background: rgba(59,130,246,0.05);
  }
  .ss-search input {
    background: transparent; border: none; outline: none;
    font-size: 14px; color: #f8fafc; width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-search input::placeholder { color: #64748b; }

  .ss-switch-btn {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: #fff; border: none;
    padding: 9px 20px; border-radius: 100px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.3s;
    white-space: nowrap;
  }
  .ss-switch-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59,130,246,0.35);
  }

  .ss-icon-btn {
    position: relative; width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    color: #94a3b8; transition: all 0.2s;
    text-decoration: none;
  }
  .ss-icon-btn:hover { color: #f8fafc; border-color: rgba(255,255,255,0.14); }
  .ss-icon-btn__badge {
    position: absolute; top: -6px; right: -6px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff; font-size: 10px; font-weight: 700;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #04080f;
  }

  .ss-user-pill {
    display: flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 100px; padding: 4px 12px 4px 4px;
    cursor: pointer; transition: all 0.2s;
  }
  .ss-user-pill:hover  { border-color: rgba(255,255,255,0.14); }
  .ss-user-pill--open  { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }

  .ss-user-photo {
    width: 32px; height: 32px; border-radius: 50%;
    object-fit: cover; border: 1.5px solid rgba(59,130,246,0.5);
    flex-shrink: 0;
  }
  .ss-user-initial {
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(59,130,246,0.18);
    border: 1.5px solid rgba(59,130,246,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 12px; color: #60a5fa; flex-shrink: 0;
  }
  .ss-user-name {
    font-size: 13px; color: #f8fafc; font-weight: 500;
    max-width: 90px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-chevron {
    color: #64748b; transition: transform 0.25s ease; flex-shrink: 0;
  }
  .ss-chevron--open { transform: rotate(180deg); }

  .ss-dropdown {
    position: absolute; right: 0; top: calc(100% + 8px);
    width: 224px;
    background: #111827;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 16px; overflow: hidden;
    animation: ssFadeIn 0.18s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55);
    z-index: 200;
  }
  @keyframes ssFadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  .ss-dropdown__header {
    padding: 14px 16px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 10px;
  }
  .ss-dropdown__photo {
    width: 38px; height: 38px; border-radius: 50%;
    object-fit: cover; border: 1.5px solid rgba(59,130,246,0.4); flex-shrink: 0;
  }
  .ss-dropdown__initial {
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(59,130,246,0.18); border: 1.5px solid rgba(59,130,246,0.35);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #60a5fa;
    flex-shrink: 0;
  }
  .ss-dropdown__name {
    font-size: 13px; font-weight: 600; color: #f8fafc;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-dropdown__email {
    font-size: 11px; color: #64748b;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-dropdown__body { padding: 6px 0; }
  .ss-dropdown__item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; text-align: left;
    padding: 10px 16px; background: transparent;
    border: none; color: #94a3b8;
    font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .ss-dropdown__item:hover { background: rgba(255,255,255,0.05); color: #f8fafc; }
  .ss-dropdown__divider { border: none; border-top: 1px solid rgba(255,255,255,0.07); margin: 4px 0; }
  .ss-dropdown__logout {
    display: flex; align-items: center; gap: 10px;
    width: 100%; text-align: left;
    padding: 10px 16px; background: transparent;
    border: none; color: #f87171;
    font-size: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .ss-dropdown__logout:hover { background: rgba(239,68,68,0.08); }
`;

export default function LearnerHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);
  console.log(user)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    setDropOpen(false);
    logout();
    navigate("/");
  };

  const firstName = user?.fullName?.split(" ")[0] || "You";
  const initial   = user?.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <style>{CSS}</style>
      <header className={`ss-header ${scrolled ? "ss-header--scrolled" : "ss-header--top"}`}>
        <div className="ss-header__inner">

          {/* ── LEFT ── */}
          <div className="ss-header__left">
            <Link to="/dashboard" className="ss-logo">
              <img src="/assets/logo.png" alt="SkillSwap" className="ss-logo__img" />
              <span className="ss-logo__text">SkillSwap</span>
            </Link>

            <nav className="ss-nav">
              {[
                { label: "Home",        to: "/dashboard"   },
                { label: "Explore",     to: "/explore"     },
                { label: "Chat",        to: "/chat"        },
                { label: "Leaderboard", to: "/leaderboard" },
              ].map(({ label, to }) => (
                <Link key={to} to={to} className="ss-nav__link">{label}</Link>
              ))}
            </nav>
          </div>

          {/* ── CENTER ── */}
          <div className="ss-search">
            <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
            <input placeholder="Search skills…" />
          </div>

          {/* ── RIGHT ── */}
          <div className="ss-header__right">
            <button className="ss-switch-btn" onClick={() => navigate("/teacher/dashboard")}>
              Switch to Teacher
            </button>

            <Link to="/chat" className="ss-icon-btn">
              <MessageCircle size={16} />
              <span className="ss-icon-btn__badge">3</span>
            </Link>

            <Link to="/notifications" className="ss-icon-btn">
              <Bell size={16} />
              <span className="ss-icon-btn__badge">2</span>
            </Link>

            {/* ── USER DROPDOWN ── */}
            <div style={{ position: "relative" }} ref={dropRef}>
              <button
                className={`ss-user-pill ${dropOpen ? "ss-user-pill--open" : ""}`}
                onClick={() => setDropOpen(!dropOpen)}
              >
                {user?.photoUrl
                  ? <img src={user?.photoUrl ||"/assets/default-avatar.png"}alt={user?.fullName} className="ss-user-photo" />
                  : <div className="ss-user-initial">{initial}</div>
                }
                <span className="ss-user-name">{firstName}</span>
                <ChevronDown size={13} className={`ss-chevron ${dropOpen ? "ss-chevron--open" : ""}`} />
              </button>

              {dropOpen && (
                <div className="ss-dropdown">
                  {/* Profile summary */}
                  <div className="ss-dropdown__header">
                    {user?.photoUrl
                      ? <img src={user?.photoUrl ||"/assets/default-avatar.png"} alt={user?.fullName} className="ss-dropdown__photo" />
                      : <div className="ss-dropdown__initial">{initial}</div>
                    }
                    <div style={{ overflow: "hidden" }}>
                      <div className="ss-dropdown__name">{user?.fullName || "User"}</div>
                      <div className="ss-dropdown__email">{user?.email || ""}</div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="ss-dropdown__body">
                    <button className="ss-dropdown__item" onClick={() => { setDropOpen(false); navigate("/profile"); }}>
                      <UserCircle size={15} /> View Profile
                    </button>
                    <button className="ss-dropdown__item" onClick={() => { setDropOpen(false); navigate("/profile/edit"); }}>
                      <Pencil size={15} /> Edit Profile
                    </button>
                    <button className="ss-dropdown__item" onClick={() => { setDropOpen(false); navigate("/settings"); }}>
                      <Settings size={15} /> Settings
                    </button>
                  </div>

                  <hr className="ss-dropdown__divider" />

                  <button className="ss-dropdown__logout" onClick={handleLogout}>
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