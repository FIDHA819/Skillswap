import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const logoImg = "/assets/logo.png";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

  .ln-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 40px;
    transition: all 0.3s ease;
  }
  .ln-nav--scrolled {
    background: rgba(4,8,15,0.92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .ln-nav--top {
    background: transparent;
  }
  .ln-nav__inner {
    max-width: 1280px; margin: 0 auto;
    height: 72px; display: flex; align-items: center; justify-content: space-between;
  }

  /* logo */
  .ln-logo {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
  }
  .ln-logo__img {
    width: 38px; height: 38px; border-radius: 10px; object-fit: cover;
  }
  .ln-logo__text {
    font-family: 'Clash Display', sans-serif; font-weight: 700;
    font-size: 20px; color: #f8fafc; letter-spacing: -0.3px;
  }

  /* nav links */
  .ln-links { display: flex; gap: 2px; }
  .ln-links__a {
    padding: 8px 16px; border-radius: 100px;
    font-size: 14px; color: #94a3b8; text-decoration: none;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .ln-links__a:hover { color: #f8fafc; background: rgba(255,255,255,0.06); }

  /* cta */
  .ln-cta { display: flex; align-items: center; gap: 10px; }
  .ln-btn-ghost {
    padding: 9px 20px; border-radius: 100px;
    background: transparent; border: 1px solid rgba(255,255,255,0.14);
    color: #cbd5e1; font-size: 14px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; text-decoration: none;
    transition: all 0.2s; display: inline-flex; align-items: center;
  }
  .ln-btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: #f8fafc; }
  .ln-btn-solid {
    padding: 9px 22px; border-radius: 100px;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    color: #fff; border: none; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center;
    transition: all 0.3s; box-shadow: 0 4px 18px rgba(99,102,241,0.3);
  }
  .ln-btn-solid:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(99,102,241,0.45);
  }

  @media (max-width: 768px) {
    .ln-nav { padding: 0 20px; }
    .ln-links { display: none; }
  }
`;

const LINKS = [
  { label: "Home",     href: "#" },
  { label: "Explore",  href: "#explore" },
  { label: "About",    href: "#about" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <nav className={`ln-nav ${scrolled ? "ln-nav--scrolled" : "ln-nav--top"}`}>
        <div className="ln-nav__inner">

          <Link to="/" className="ln-logo">
            <img src={logoImg} alt="SkillSwap" className="ln-logo__img" />
            <span className="ln-logo__text">SkillSwap</span>
          </Link>

          <div className="ln-links">
            {LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="ln-links__a">{label}</a>
            ))}
          </div>

          <div className="ln-cta">
            <Link to="/login"  className="ln-btn-ghost">Login</Link>
            <Link to="/signup" className="ln-btn-solid">Join Now</Link>
          </div>

        </div>
      </nav>
    </>
  );
}