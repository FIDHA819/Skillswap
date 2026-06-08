import { useState } from "react";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";

const CSS = `
  .ss-cats { padding: 100px 0; }
  .ss-cats__container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  .ss-cats__top {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 48px;
  }
  .ss-cats__chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
    color: #22d3ee; margin-bottom: 16px; font-family: 'DM Sans', sans-serif;
  }
  .ss-cats__h2 {
    font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 700;
    letter-spacing: -0.8px; color: #f8fafc; line-height: 1.2;
  }
  .ss-cats__h2-grad {
    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ss-cats__view-all {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; color: #60a5fa; text-decoration: none;
    transition: gap 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
  }
  .ss-cats__view-all:hover { gap: 10px; }
  .ss-cats__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  .ss-cats__card {
    padding: 24px; border-radius: 20px; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.07);
    background: #111827;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    animation: ssCatFadeUp 0.5s ease both;
  }
  .ss-cats__card:hover { transform: translateY(-3px); }
  .ss-cats__icon  { font-size: 32px; margin-bottom: 12px; }
  .ss-cats__name  { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; font-family: 'DM Sans', sans-serif; }
  .ss-cats__count { font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif; }
  .ss-cats__explore {
    margin-top: 14px; display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
  }

  @keyframes ssCatFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .ss-cats { padding: 60px 0; }
    .ss-cats__container { padding: 0 20px; }
    .ss-cats__top { flex-direction: column; align-items: flex-start; gap: 16px; }
    .ss-cats__h2 { font-size: 28px; }
  }
`;

const CATEGORIES = [
  { name: "React",       icon: "⚛️", count: "2.4k learners", color: "#61dafb" },
  { name: "UI/UX Design",icon: "🎨", count: "1.8k learners", color: "#a78bfa" },
  { name: "Photoshop",   icon: "🖼️", count: "3.1k learners", color: "#31a8ff" },
  { name: "Excel",       icon: "📊", count: "4.2k learners", color: "#1d7a45" },
  { name: "Marketing",   icon: "📣", count: "1.5k learners", color: "#f59e0b" },
  { name: "Python",      icon: "🐍", count: "5.0k learners", color: "#ffd43b" },
  { name: "Figma",       icon: "✏️", count: "2.1k learners", color: "#ff7262" },
  { name: "Branding",    icon: "💎", count: "900 learners",  color: "#ec4899" },
];

export default function CategoriesGrid() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <style>{CSS}</style>
      <section className="ss-cats">
        <div className="ss-cats__container">
          <div className="ss-cats__top">
            <div>
              <div className="ss-cats__chip"><BookOpen size={13} /> Browse Categories</div>
              <h2 className="ss-cats__h2">
                What do you want to<br />
                <span className="ss-cats__h2-grad">master next?</span>
              </h2>
            </div>
            <a href="/explore" className="ss-cats__view-all">
              View all <ArrowRight size={14} />
            </a>
          </div>

          <div className="ss-cats__grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                className="ss-cats__card"
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  animationDelay: `${i * 0.07}s`,
                  background:     active === i ? `${cat.color}12` : "#111827",
                  borderColor:    active === i ? `${cat.color}40` : "rgba(255,255,255,0.07)",
                  boxShadow:      active === i ? `0 0 0 1px ${cat.color}20` : "none",
                }}
              >
                <div className="ss-cats__icon">{cat.icon}</div>
                <div className="ss-cats__name">{cat.name}</div>
                <div className="ss-cats__count">{cat.count}</div>
                {active === i && (
                  <div className="ss-cats__explore" style={{ color: cat.color }}>
                    Explore <ChevronRight size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}