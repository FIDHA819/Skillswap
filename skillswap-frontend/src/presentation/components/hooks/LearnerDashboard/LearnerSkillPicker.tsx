import { useEffect, useRef, useState } from "react";
import { Plus, X, Check, Search, Loader2, BookOpen, Sparkles } from "lucide-react";
import api from "../../../../infrastructure/api/axios";

// Same categories as teacher skill picker — consistent UX
const SKILL_CATEGORIES: Record<string, string[]> = {
  Frontend: ["React","Next.js","Vue.js","Angular","TypeScript","CSS","Tailwind CSS","JavaScript"],
  Backend:  ["Node.js","Express","Django","FastAPI","Spring Boot","Laravel","Go"],
  Database: ["MongoDB","PostgreSQL","MySQL","Redis","Firebase","GraphQL"],
  Mobile:   ["Flutter","React Native","Swift","Kotlin","Android","iOS"],
  DevOps:   ["Docker","Kubernetes","AWS","GCP","CI/CD","Linux"],
  Design:   ["Figma","UI/UX Design","Adobe XD","Blender"],
  Data:     ["Python","Machine Learning","Data Science","TensorFlow","Pandas","SQL"],
  Other:    ["Java","C++","Rust","PHP","WordPress","SEO","Blockchain","Excel","Marketing"],
};
const ALL_SUGGESTIONS = Object.values(SKILL_CATEGORIES).flat();

const EMOJI_MAP: Record<string,string> = {
  React:"⚛️","Next.js":"▲","Vue.js":"💚",Angular:"🔴",TypeScript:"📘",JavaScript:"🟨",
  CSS:"🎨","Tailwind CSS":"🌊","Node.js":"🟩",Express:"🚂",Django:"🐍",Python:"🐍",
  MongoDB:"🍃",PostgreSQL:"🐘",MySQL:"🐬",Redis:"❤️",Docker:"🐳",Kubernetes:"☸️",
  AWS:"☁️",Flutter:"💙","React Native":"📱",Swift:"🍎",Kotlin:"🟣",Figma:"🎯",
  "Machine Learning":"🤖","Data Science":"📊",GraphQL:"🔮",Go:"🔵",Rust:"🦀",
  Java:"☕",Firebase:"🔥",Linux:"🐧",PHP:"🐘",WordPress:"📝",Blockchain:"⛓️",
  "UI/UX Design":"🎨",Excel:"📊",Marketing:"📣",SQL:"🗄️",
};
const getEmoji = (n:string) => EMOJI_MAP[n] ?? "📚";

const CSS = `
  .lsp-wrap { }
  .lsp-saved-row {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;
  }
  .lsp-tag {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 6px 12px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
    color: #a5b4fc; font-family: 'DM Sans', sans-serif;
  }
  .lsp-tag-del {
    background: none; border: none; cursor: pointer; color: #6366f1;
    padding: 0; display: flex; align-items: center; transition: color 0.15s;
  }
  .lsp-tag-del:hover { color: #f87171; }
  .lsp-add-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px;
    background: rgba(255,255,255,0.04); border: 1px dashed rgba(255,255,255,0.12);
    color: #64748b; font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .lsp-add-btn:hover { border-color: rgba(99,102,241,0.4); color: #a5b4fc; }

  /* modal */
  .lsp-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(4,8,15,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: lspFadeIn 0.2s ease;
  }
  @keyframes lspFadeIn { from{opacity:0} to{opacity:1} }
  .lsp-modal {
    width: 100%; max-width: 640px; max-height: 86vh;
    background: #0d1117; border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
    animation: lspSlide 0.25s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes lspSlide { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  .lsp-modal-head {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 22px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .lsp-modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#f8fafc; margin:0 0 2px; }
  .lsp-modal-sub   { font-size:13px; color:#475569; font-family:'DM Sans',sans-serif; }
  .lsp-modal-close { width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .lsp-modal-close:hover { background:rgba(255,255,255,0.1); color:#f8fafc; }
  .lsp-search-wrap { padding:12px 24px; border-bottom:1px solid rgba(255,255,255,0.05); position:relative; }
  .lsp-search-icon { position:absolute; left:40px; top:50%; transform:translateY(-50%); color:#475569; }
  .lsp-search {
    width:100%; padding:9px 14px 9px 34px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08);
    border-radius:10px; color:#f8fafc; font-size:14px;
    font-family:'DM Sans',sans-serif; outline:none; transition:all 0.2s;
  }
  .lsp-search:focus { border-color:rgba(99,102,241,0.4); }
  .lsp-search::placeholder { color:#475569; }
  .lsp-tabs { display:flex; gap:6px; padding:10px 24px; flex-wrap:wrap; border-bottom:1px solid rgba(255,255,255,0.05); }
  .lsp-tab { padding:5px 12px; border-radius:100px; font-size:12px; font-weight:500; cursor:pointer; border:none; background:rgba(255,255,255,0.04); color:#64748b; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .lsp-tab.active { background:rgba(99,102,241,0.15); color:#a5b4fc; border:1px solid rgba(99,102,241,0.25); }
  .lsp-selected-row { padding:10px 24px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; flex-wrap:wrap; gap:6px; }
  .lsp-sel-chip { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.2); color:#a5b4fc; font-size:12px; font-family:'DM Sans',sans-serif; }
  .lsp-sel-x { background:none; border:none; cursor:pointer; color:#6366f1; padding:0; display:flex; align-items:center; }
  .lsp-body { flex:1; overflow-y:auto; padding:16px 24px; }
  .lsp-body::-webkit-scrollbar { width:3px; }
  .lsp-body::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.07); border-radius:2px; }
  .lsp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:8px; }
  .lsp-skill-btn {
    display:flex; align-items:center; gap:8px; padding:11px 13px;
    border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
    color:#e2e8f0; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:500;
    transition:all 0.2s; text-align:left;
  }
  .lsp-skill-btn:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.3); transform:translateY(-1px); }
  .lsp-skill-btn.selected { background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.4); color:#a5b4fc; }
  .lsp-footer { padding:14px 24px; border-top:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:space-between; }
  .lsp-footer-hint { font-size:12px; color:#475569; font-family:'DM Sans',sans-serif; }
  .lsp-footer-actions { display:flex; gap:8px; }
  .lsp-btn-cancel { padding:9px 18px; border-radius:100px; background:transparent; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; transition:all 0.2s; }
  .lsp-btn-cancel:hover { border-color:rgba(255,255,255,0.2); color:#f8fafc; }
  .lsp-btn-save { padding:9px 20px; border-radius:100px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; transition:all 0.2s; }
  .lsp-btn-save:disabled { opacity:0.6; cursor:not-allowed; }
  .lsp-btn-save:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 18px rgba(99,102,241,0.35); }
`;

interface Props {
  onSkillsChange?: (skills: string[]) => void;
}

export default function LearnerSkillPicker({ onSkillsChange }: Props) {
  const [savedSkills, setSavedSkills] = useState<string[]>([]);
  const [open, setOpen]       = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch]   = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [saving, setSaving]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved skills
  useEffect(() => {
   api.get("/skills/learner/my-skills")
      .then(r => {
        const skills = (r.data.skillsToLearn ?? []).map((s: any) => typeof s === "string" ? s : s.name);
        setSavedSkills(skills);
        onSkillsChange?.(skills);
      })
      .catch(() => {});
  }, []);

  const openModal = () => {
    setSelected([...savedSkills]);
    setSearch(""); setActiveTab("All");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const toggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

  const removeFromSaved = async (name: string) => {
    const updated = savedSkills.filter(s => s !== name);
    setSavedSkills(updated);
    onSkillsChange?.(updated);
    await api.post("/skills/learner/my-skills", { skills: updated }).catch(() => {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post("/skills/learner/my-skills", { skills: selected });
      setSavedSkills(selected);
      onSkillsChange?.(selected);
      setOpen(false);
    } catch {}
    finally { setSaving(false); }
  };

  const pool = activeTab === "All" ? ALL_SUGGESTIONS : (SKILL_CATEGORIES[activeTab] ?? []);
  const filtered = search.trim()
    ? pool.filter(s => s.toLowerCase().includes(search.toLowerCase()))
    : pool;

  return (
    <>
      <style>{CSS}</style>
      <div className="lsp-wrap">
        <div className="lsp-saved-row">
          {savedSkills.map(s => (
            <span key={s} className="lsp-tag">
              {getEmoji(s)} {s}
              <button className="lsp-tag-del" onClick={() => removeFromSaved(s)}><X size={10} /></button>
            </span>
          ))}
          <button className="lsp-add-btn" onClick={openModal}>
            <Plus size={13} /> {savedSkills.length === 0 ? "Add skills to learn" : "Edit skills"}
          </button>
        </div>
      </div>

      {open && (
        <div className="lsp-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="lsp-modal">
            <div className="lsp-modal-head">
              <div>
                <h2 className="lsp-modal-title">What do you want to learn?</h2>
                <p className="lsp-modal-sub">Pick skills — we'll find teachers and videos for you</p>
              </div>
              <button className="lsp-modal-close" onClick={() => setOpen(false)}><X size={14} /></button>
            </div>

            <div className="lsp-search-wrap">
              <Search size={13} className="lsp-search-icon" />
              <input ref={inputRef} className="lsp-search" placeholder="Search skills…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="lsp-tabs">
              {["All", ...Object.keys(SKILL_CATEGORIES)].map(tab => (
                <button key={tab} className={`lsp-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
              ))}
            </div>

            {selected.length > 0 && (
              <div className="lsp-selected-row">
                {selected.map(s => (
                  <span key={s} className="lsp-sel-chip">
                    {getEmoji(s)} {s}
                    <button className="lsp-sel-x" onClick={() => toggle(s)}><X size={9} /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="lsp-body">
              <div className="lsp-grid">
                {filtered.map(name => (
                  <button
                    key={name}
                    className={`lsp-skill-btn${selected.includes(name) ? " selected" : ""}`}
                    onClick={() => toggle(name)}
                  >
                    <span style={{ fontSize:16, flexShrink:0 }}>{getEmoji(name)}</span>
                    <span>{name}</span>
                    {selected.includes(name) && <Check size={11} style={{ marginLeft:"auto", flexShrink:0, color:"#a5b4fc" }} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="lsp-footer">
              <span className="lsp-footer-hint">{selected.length} skill{selected.length !== 1 ? "s" : ""} selected</span>
              <div className="lsp-footer-actions">
                <button className="lsp-btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
                <button className="lsp-btn-save" onClick={handleSave} disabled={saving || selected.length === 0}>
                  {saving ? <><Loader2 size={12} style={{ animation:"spin 1s linear infinite" }} /> Saving…</> : <><Check size={12} /> Save Skills</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}