import { useState, useEffect } from "react";
import { BookOpen, ArrowRight, ChevronRight, X, Users, Star, Search, Loader2, ArrowLeft } from "lucide-react";
import api from "../../../../infrastructure/api/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type SkillItem = {
  _id: string;
  name: string;
  description?: string;
  teachers: string[]; // ObjectId array from DB
};

type TeacherProfile = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  profile: {
    photoUrl?: string;
    headline?: string;
    bio?: string;
    country?: string;
    rating?: number;
    totalStudents?: number;
    totalSessions?: number;
  } | null;
};

// ─── Static data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "React",        icon: "⚛️", color: "#61dafb" },
  { name: "UI/UX Design", icon: "🎨", color: "#a78bfa" },
  { name: "Photoshop",    icon: "🖼️", color: "#31a8ff" },
  { name: "Excel",        icon: "📊", color: "#1d7a45" },
  { name: "Marketing",    icon: "📣", color: "#f59e0b" },
  { name: "Python",       icon: "🐍", color: "#ffd43b" },
  { name: "Figma",        icon: "✏️", color: "#ff7262" },
  { name: "Branding",     icon: "💎", color: "#ec4899" },
];

const EMOJI_MAP: Record<string, string> = {
  React: "⚛️", "Next.js": "▲", "Vue.js": "💚", Angular: "🔴",
  TypeScript: "📘", JavaScript: "🟨", CSS: "🎨", "Tailwind CSS": "🌊",
  "Node.js": "🟩", Express: "🚂", Django: "🐍", Python: "🐍",
  MongoDB: "🍃", PostgreSQL: "🐘", MySQL: "🐬", Redis: "❤️",
  Docker: "🐳", Kubernetes: "☸️", AWS: "☁️", Flutter: "💙",
  "React Native": "📱", Swift: "🍎", Kotlin: "🟣", Figma: "🎯",
  "Machine Learning": "🤖", "Data Science": "📊", GraphQL: "🔮",
  Go: "🔵", Rust: "🦀", Java: "☕", Firebase: "🔥", Linux: "🐧",
  PHP: "🐘", WordPress: "📝", Blockchain: "⛓️", "UI/UX Design": "🎨",
  Photoshop: "🖼️", Excel: "📊", Marketing: "📣", Branding: "💎",
};

const getEmoji = (name: string) => EMOJI_MAP[name] ?? "📚";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  .cats { padding: 100px 0; }
  .cats__container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

  /* header */
  .cats__top {
    display: flex; justify-content: space-between;
    align-items: flex-end; margin-bottom: 48px;
  }
  .cats__chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.25);
    color: #22d3ee; margin-bottom: 16px; font-family: 'DM Sans', sans-serif;
  }
  .cats__h2 {
    font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 700;
    letter-spacing: -0.8px; color: #f8fafc; line-height: 1.2;
  }
  .cats__h2-grad {
    background: linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #c084fc 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .cats__view-all {
    display: flex; align-items: center; gap: 6px;
    font-size: 14px; color: #60a5fa; text-decoration: none; cursor: pointer;
    background: none; border: none;
    transition: gap 0.2s; font-family: 'DM Sans', sans-serif; white-space: nowrap;
  }
  .cats__view-all:hover { gap: 10px; }

  /* category grid */
  .cats__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  .cats__card {
    padding: 24px; border-radius: 20px; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.07);
    background: #111827;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    animation: catFadeUp 0.5s ease both;
  }
  .cats__card:hover { transform: translateY(-3px); }
  .cats__icon  { font-size: 32px; margin-bottom: 12px; }
  .cats__name  { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; font-family: 'DM Sans', sans-serif; }
  .cats__count { font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif; }
  .cats__explore {
    margin-top: 14px; display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
  }

  @keyframes catFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── OVERLAY ── */
  .cats__overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(4,8,15,0.8);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: catOverlayIn 0.2s ease;
  }
  @keyframes catOverlayIn {
    from { opacity: 0; } to { opacity: 1; }
  }

  /* ── PANEL (shared by skill-list + teacher-list) ── */
  .cats__panel {
    width: 100%; max-width: 760px; max-height: 88vh;
    background: #0d1117; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 28px;
    display: flex; flex-direction: column;
    overflow: hidden;
    animation: catPanelIn 0.25s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes catPanelIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .cats__panel-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px 20px; flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .cats__panel-back {
    display: flex; align-items: center; gap: 8px;
    background: none; border: none; cursor: pointer;
    color: #60a5fa; font-size: 14px; font-family: 'DM Sans', sans-serif;
    padding: 0;
  }
  .cats__panel-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    color: #f8fafc; margin: 0;
  }
  .cats__panel-sub {
    font-size: 13px; color: #475569; margin-top: 2px;
    font-family: 'DM Sans', sans-serif;
  }
  .cats__panel-close {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
  }
  .cats__panel-close:hover { background: rgba(255,255,255,0.1); color: #f8fafc; }

  /* search */
  .cats__search-wrap {
    padding: 16px 28px; border-bottom: 1px solid rgba(255,255,255,0.05);
    position: relative; flex-shrink: 0;
  }
  .cats__search-icon { position: absolute; left: 44px; top: 50%; transform: translateY(-50%); color: #475569; }
  .cats__search {
    width: 100%; padding: 10px 16px 10px 36px;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: #f8fafc; font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s;
  }
  .cats__search:focus { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.05); }
  .cats__search::placeholder { color: #475569; }

  /* ── ALL SKILLS GRID ── */
  .cats__skills-body { flex: 1; overflow-y: auto; padding: 20px 28px; }
  .cats__skills-body::-webkit-scrollbar { width: 4px; }
  .cats__skills-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  .cats__skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
  .cats__skill-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 14px 16px; border-radius: 14px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    color: #e2e8f0; cursor: pointer; text-align: left;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    transition: all 0.2s;
  }
  .cats__skill-btn:hover {
    background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3);
    transform: translateY(-2px);
  }
  .cats__skill-emoji { font-size: 20px; flex-shrink: 0; }
  .cats__skill-info {}
  .cats__skill-label { display: block; }
  .cats__skill-tc {
    font-size: 11px; color: #475569; margin-top: 2px; display: block;
  }

  /* ── TEACHER LIST ── */
  .cats__teachers-body { flex: 1; overflow-y: auto; padding: 20px 28px; }
  .cats__teachers-body::-webkit-scrollbar { width: 4px; }
  .cats__teachers-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  .cats__teacher-card {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 18px; border-radius: 16px;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    margin-bottom: 12px; transition: all 0.2s; cursor: pointer;
    animation: catFadeUp 0.35s ease both;
  }
  .cats__teacher-card:hover {
    background: rgba(99,102,241,0.07); border-color: rgba(99,102,241,0.2);
    transform: translateX(4px);
  }
  .cats__teacher-avatar {
    width: 52px; height: 52px; border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(99,102,241,0.3); flex-shrink: 0;
  }
  .cats__teacher-fallback {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg,#1e1b4b,#312e81);
    border: 2px solid rgba(99,102,241,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    color: #818cf8; flex-shrink: 0;
  }
  .cats__teacher-info { flex: 1; min-width: 0; }
  .cats__teacher-name {
    font-size: 16px; font-weight: 600; color: #f8fafc;
    font-family: 'DM Sans', sans-serif; margin-bottom: 2px;
  }
  .cats__teacher-headline {
    font-size: 13px; color: #94a3b8; font-family: 'DM Sans', sans-serif;
    margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cats__teacher-meta {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  }
  .cats__teacher-badge {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif;
  }
  .cats__teacher-book {
    margin-left: auto; flex-shrink: 0;
    padding: 8px 16px; border-radius: 100px;
    background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc; font-size: 13px; font-weight: 500;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all 0.2s;
  }
  .cats__teacher-book:hover { background: rgba(99,102,241,0.25); }

  /* empty / loading states */
  .cats__state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 60px 20px;
    color: #475569; font-family: 'DM Sans', sans-serif; font-size: 14px;
    text-align: center;
  }
  .cats__state svg { color: #334155; }

  @media (max-width: 768px) {
    .cats { padding: 60px 0; }
    .cats__container { padding: 0 20px; }
    .cats__top { flex-direction: column; align-items: flex-start; gap: 16px; }
    .cats__h2 { font-size: 28px; }
    .cats__panel { border-radius: 20px; }
    .cats__panel-head { padding: 20px 20px 16px; }
    .cats__search-wrap { padding: 12px 20px; }
    .cats__search-icon { left: 36px; }
    .cats__skills-body, .cats__teachers-body { padding: 16px 20px; }
    .cats__skills-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

type PanelState =
  | { mode: "closed" }
  | { mode: "all-skills" }
  | { mode: "teachers"; skillName: string; fromAll: boolean };

export default function CategoriesGrid() {
  const [active, setActive] = useState<number | null>(null);
  const [panel, setPanel] = useState<PanelState>({ mode: "closed" });

  // all skills for the "View All" panel
  const [allSkills, setAllSkills] = useState<SkillItem[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");

  // teachers for a specific skill
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

  // ── Fetch all skills when "View All" is opened ──────────────────────────────
  const openAllSkills = async () => {
    setPanel({ mode: "all-skills" });
    setSkillSearch("");
    if (allSkills.length > 0) return; // already loaded
    setSkillsLoading(true);
    try {
      const res = await api.get("/skills/all");
      setAllSkills(res.data);
    } catch {
      setAllSkills([]);
    } finally {
      setSkillsLoading(false);
    }
  };

  // ── Fetch teachers for a skill ───────────────────────────────────────────────
  const openTeachers = async (skillName: string, fromAll = false) => {
    setPanel({ mode: "teachers", skillName, fromAll });
    setTeachers([]);
    setTeachersLoading(true);
    try {
      const res = await api.get(`/skills/${encodeURIComponent(skillName)}/teachers`);
      setTeachers(res.data.teachers ?? []);
    } catch {
      setTeachers([]);
    } finally {
      setTeachersLoading(false);
    }
  };

  // ── Close ────────────────────────────────────────────────────────────────────
  const closePanel = () => {
    setPanel({ mode: "closed" });
    setActive(null);
  };

  // ── Category card click ──────────────────────────────────────────────────────
  const handleCategoryClick = (catName: string, idx: number) => {
    setActive(active === idx ? null : idx);
    openTeachers(catName, false);
  };

  // ── Filtered skills for search ───────────────────────────────────────────────
  const filteredSkills = skillSearch.trim()
    ? allSkills.filter(s => s.name.toLowerCase().includes(skillSearch.toLowerCase()))
    : allSkills;

  return (
    <>
      <style>{CSS}</style>

      <section className="cats">
        <div className="cats__container">

          {/* ── header ── */}
          <div className="cats__top">
            <div>
              <div className="cats__chip"><BookOpen size={13} /> Browse Categories</div>
              <h2 className="cats__h2">
                What do you want to<br />
                <span className="cats__h2-grad">master next?</span>
              </h2>
            </div>
            <button className="cats__view-all" onClick={openAllSkills}>
              View all <ArrowRight size={14} />
            </button>
          </div>

          {/* ── category grid ── */}
          <div className="cats__grid">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                className="cats__card"
                onClick={() => handleCategoryClick(cat.name, i)}
                style={{
                  animationDelay: `${i * 0.07}s`,
                  background:  active === i ? `${cat.color}12` : "#111827",
                  borderColor: active === i ? `${cat.color}40` : "rgba(255,255,255,0.07)",
                  boxShadow:   active === i ? `0 0 0 1px ${cat.color}20` : "none",
                }}
              >
                <div className="cats__icon">{cat.icon}</div>
                <div className="cats__name">{cat.name}</div>
                <div className="cats__count">
                  {/* teacher count will come from DB — show placeholder for now */}
                  Tap to explore
                </div>
                {active === i && (
                  <div className="cats__explore" style={{ color: cat.color }}>
                    See teachers <ChevronRight size={13} />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── OVERLAY PANEL ── */}
      {panel.mode !== "closed" && (
        <div className="cats__overlay" onClick={e => e.target === e.currentTarget && closePanel()}>
          <div className="cats__panel">

            {/* ── ALL SKILLS panel ── */}
            {panel.mode === "all-skills" && (
              <>
                <div className="cats__panel-head">
                  <div>
                    <h2 className="cats__panel-title">All Skills</h2>
                    <p className="cats__panel-sub">Click any skill to see available teachers</p>
                  </div>
                  <button className="cats__panel-close" onClick={closePanel}><X size={16} /></button>
                </div>

                <div className="cats__search-wrap">
                  <Search size={14} className="cats__search-icon" />
                  <input
                    className="cats__search"
                    placeholder="Search skills…"
                    value={skillSearch}
                    onChange={e => setSkillSearch(e.target.value)}
                  />
                </div>

                <div className="cats__skills-body">
                  {skillsLoading ? (
                    <div className="cats__state">
                      <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
                      Loading skills…
                    </div>
                  ) : filteredSkills.length === 0 ? (
                    <div className="cats__state">
                      <Search size={28} />
                      No skills found
                    </div>
                  ) : (
                    <div className="cats__skills-grid">
                      {filteredSkills.map(skill => (
                        <button
                          key={skill._id}
                          className="cats__skill-btn"
                          onClick={() => openTeachers(skill.name, true)}
                        >
                          <span className="cats__skill-emoji">{getEmoji(skill.name)}</span>
                          <span className="cats__skill-info">
                            <span className="cats__skill-label">{skill.name}</span>
                            <span className="cats__skill-tc">
                              {skill.teachers?.length ?? 0} teacher{skill.teachers?.length !== 1 ? "s" : ""}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── TEACHERS panel ── */}
            {panel.mode === "teachers" && (
              <>
                <div className="cats__panel-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {panel.fromAll && (
                      <button
                        className="cats__panel-back"
                        onClick={openAllSkills}
                      >
                        <ArrowLeft size={14} /> All skills
                      </button>
                    )}
                    <div>
                      <h2 className="cats__panel-title">
                        {getEmoji(panel.skillName)} {panel.skillName}
                      </h2>
                      <p className="cats__panel-sub">Teachers available for this skill</p>
                    </div>
                  </div>
                  <button className="cats__panel-close" onClick={closePanel}><X size={16} /></button>
                </div>

                <div className="cats__teachers-body">
                  {teachersLoading ? (
                    <div className="cats__state">
                      <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
                      Finding teachers…
                    </div>
                  ) : teachers.length === 0 ? (
                    <div className="cats__state">
                      <Users size={28} />
                      <div>
                        <strong style={{ color: "#94a3b8" }}>No teachers yet</strong>
                        <p style={{ marginTop: 4 }}>Be the first to teach {panel.skillName}!</p>
                      </div>
                    </div>
                  ) : (
                    teachers.map((teacher, i) => {
                      const photoUrl = teacher.profile?.photoUrl
                        ? `${API_URL}/${teacher.profile.photoUrl.replace(/\\/g, "/")}`
                        : null;
                      const initial = teacher.fullName?.charAt(0)?.toUpperCase() ?? "T";

                      return (
                        <div
                          key={teacher._id}
                          className="cats__teacher-card"
                          style={{ animationDelay: `${i * 0.06}s` }}
                        >
                          {photoUrl
                            ? <img src={photoUrl} alt={teacher.fullName} className="cats__teacher-avatar" />
                            : <div className="cats__teacher-fallback">{initial}</div>
                          }

                          <div className="cats__teacher-info">
                            <div className="cats__teacher-name">{teacher.fullName}</div>
                            {teacher.profile?.headline && (
                              <div className="cats__teacher-headline">{teacher.profile.headline}</div>
                            )}
                            <div className="cats__teacher-meta">
                              {teacher.profile?.country && (
                                <span className="cats__teacher-badge">
                                  🌍 {teacher.profile.country}
                                </span>
                              )}
                              {teacher.profile?.totalStudents !== undefined && (
                                <span className="cats__teacher-badge">
                                  <Users size={11} /> {teacher.profile.totalStudents} students
                                </span>
                              )}
                              {teacher.profile?.rating !== undefined && teacher.profile.rating > 0 && (
                                <span className="cats__teacher-badge">
                                  <Star size={11} /> {teacher.profile.rating.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            className="cats__teacher-book"
                            onClick={e => {
                              e.stopPropagation();
                              // navigate to teacher profile or booking
                              window.location.href = `/teacher/${teacher._id}`;
                            }}
                          >
                            View
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}