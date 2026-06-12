import { Link } from "react-router-dom";

const CSS = `
  .ft-root {
    background: #04080f;
    border-top: 1px solid rgba(255,255,255,0.07);
    font-family: 'DM Sans', sans-serif;
  }
  .ft-main {
    max-width: 1280px; margin: 0 auto;
    padding: 64px 40px 48px;
    display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr; gap: 48px;
  }

  /* brand */
  .ft-brand__logo { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 16px; }
  .ft-brand__img  { width: 36px; height: 36px; border-radius: 9px; object-fit: cover; }
  .ft-brand__name {
    font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700;
    color: #f8fafc; letter-spacing: -0.3px;
  }
  .ft-brand__desc { font-size: 14px; color: #475569; line-height: 1.7; max-width: 280px; }
  .ft-brand__socials { display: flex; gap: 10px; margin-top: 20px; }
  .ft-social {
    width: 36px; height: 36px; border-radius: 9px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; transition: all 0.2s; text-decoration: none;
  }
  .ft-social:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

  /* columns */
  .ft-col__title {
    font-size: 12px; font-weight: 700; letter-spacing: 0.09em;
    text-transform: uppercase; color: #475569; margin-bottom: 18px;
  }
  .ft-col__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .ft-col__link {
    font-size: 14px; color: #64748b; text-decoration: none; transition: color 0.2s;
  }
  .ft-col__link:hover { color: #f8fafc; }

  /* bottom */
  .ft-bottom {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 20px 40px;
    max-width: 1280px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ft-copy { font-size: 13px; color: #334155; }
  .ft-bottom-links { display: flex; gap: 20px; }
  .ft-bottom-link { font-size: 13px; color: #334155; text-decoration: none; transition: color 0.2s; }
  .ft-bottom-link:hover { color: #94a3b8; }

  @media (max-width: 900px) {
    .ft-main { grid-template-columns: 1fr 1fr; gap: 36px; padding: 48px 20px 36px; }
    .ft-bottom { flex-direction: column; gap: 12px; padding: 16px 20px; text-align: center; }
  }
  @media (max-width: 560px) {
    .ft-main { grid-template-columns: 1fr; }
  }
`;

const logoImg = "/assets/logo.png";

export default function Footer() {
  return (
    <>
      <style>{CSS}</style>
      <footer className="ft-root">
        <div className="ft-main">

          {/* Brand */}
          <div>
            <Link to="/" className="ft-brand__logo">
              <img src={logoImg} alt="SkillSwap" className="ft-brand__img" />
              <span className="ft-brand__name">SkillSwap</span>
            </Link>
            <p className="ft-brand__desc">
              Learn faster by exchanging skills with real people.
              Teach what you know. Learn what you need.
            </p>
            <div className="ft-brand__socials">
              <a className="ft-social" href="#" aria-label="Website">🌐</a>
              <a className="ft-social" href="#" aria-label="LinkedIn">💼</a>
              <a className="ft-social" href="#" aria-label="Instagram">📸</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="ft-col__title">Product</div>
            <ul className="ft-col__list">
              <li><Link to="/"        className="ft-col__link">Home</Link></li>
              <li><Link to="/explore" className="ft-col__link">Explore Skills</Link></li>
              <li><Link to="/dashboard" className="ft-col__link">Dashboard</Link></li>
              <li><Link to="/leaderboard" className="ft-col__link">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <div className="ft-col__title">Support</div>
            <ul className="ft-col__list">
              <li><a href="#" className="ft-col__link">Help Center</a></li>
              <li><a href="#" className="ft-col__link">Privacy Policy</a></li>
              <li><a href="#" className="ft-col__link">Terms &amp; Conditions</a></li>
              <li><a href="#" className="ft-col__link">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="ft-col__title">Contact</div>
            <ul className="ft-col__list">
              <li>
                <a href="mailto:skill-swap@gmail.com" className="ft-col__link">
                  skill-swap@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:09874567221" className="ft-col__link">
                  +91 98745 67221
                </a>
              </li>
              <li><a href="#" className="ft-col__link">Live Chat</a></li>
            </ul>
          </div>

        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="ft-bottom">
            <span className="ft-copy">© {new Date().getFullYear()} SkillSwap. All rights reserved.</span>
            <div className="ft-bottom-links">
              <a href="#" className="ft-bottom-link">Privacy</a>
              <a href="#" className="ft-bottom-link">Terms</a>
              <a href="#" className="ft-bottom-link">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}