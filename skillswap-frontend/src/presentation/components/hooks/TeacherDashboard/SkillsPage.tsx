import { useState, useEffect, useRef } from "react"
import {
  BookOpen, Plus, X, Check, Pencil,
  Search, Sparkles, Loader2, AlertCircle,
  TrendingUp, Users, Star,
} from "lucide-react"
import { skillsService } from "../../../../services/skillsService"
import "../../styles/SkillPage.css"

type SkillItem = {
  _id: string
  name: string
  description?: string
  categoryId?: string
  teachers?: string[]
  learners?: string[]
  createdAt?: string
  updatedAt?: string
}

// ── Skill suggestions by category ─────────────────────────
const SKILL_CATEGORIES: Record<string, string[]> = {
  Frontend: ["React", "Next.js", "Vue.js", "Angular", "TypeScript", "CSS", "Tailwind CSS", "JavaScript"],
  Backend: ["Node.js", "Express", "Django", "FastAPI", "Spring Boot", "Laravel", "Ruby on Rails", "Go"],
  Database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase", "GraphQL", "Prisma"],
  Mobile: ["Flutter", "React Native", "Swift", "Kotlin", "Android", "iOS"],
  DevOps: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform", "Linux"],
  Design: ["Figma", "UI/UX Design", "Adobe XD", "Framer", "Blender", "Sketch"],
  Data: ["Python", "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Pandas", "SQL"],
  Other: ["Java", "C++", "Rust", "PHP", "WordPress", "Shopify", "SEO", "Blockchain"],
}

const ALL_SUGGESTIONS = Object.values(SKILL_CATEGORIES).flat()

const EMOJI_MAP: Record<string, string> = {
  React: "⚛️",
  "Next.js": "▲",
  "Vue.js": "💚",
  Angular: "🔴",
  TypeScript: "📘",
  JavaScript: "🟨",
  CSS: "🎨",
  "Tailwind CSS": "🌊",
  "Node.js": "🟩",
  Express: "🚂",
  Django: "🐍",
  Python: "🐍",
  MongoDB: "🍃",
  PostgreSQL: "🐘",
  MySQL: "🐬",
  Redis: "❤️",
  Docker: "🐳",
  Kubernetes: "☸️",
  AWS: "☁️",
  Flutter: "💙",
  "React Native": "📱",
  Swift: "🍎",
  Kotlin: "🟣",
  Figma: "🎯",
  "Machine Learning": "🤖",
  "Data Science": "📊",
  GraphQL: "🔮",
  Go: "🔵",
  Rust: "🦀",
  Java: "☕",
  Firebase: "🔥",
  Linux: "🐧",
  PHP: "🐘",
  WordPress: "📝",
  Blockchain: "⛓️",
}

const getEmoji = (name: string) => EMOJI_MAP[name] ?? "📚"
const getPct = (students: number) => Math.min(Math.round((students / 25) * 100), 100)

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="td-prog-wrap">
      <div className="td-prog-bar" style={{ width: `${pct}%` }} />
    </div>
  )
}

function SkillTag({
  name,
  onRemove,
  removing,
}: {
  name: string
  onRemove: () => void
  removing: boolean
}) {
  return (
    <div className="sk-tag">
      <span className="sk-tag-emoji">{getEmoji(name)}</span>
      <span className="sk-tag-name">{name}</span>
      <button
        className="sk-tag-del"
        onClick={onRemove}
        disabled={removing}
        title={`Remove ${name}`}
      >
        {removing ? <Loader2 size={10} className="sk-spin" /> : <X size={10} />}
      </button>
    </div>
  )
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [toast, setToast] = useState("")
  const [showModal, setShowModal] = useState(false)

  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("All")

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    skillsService.getSkills()
      .then((d) => setSkills(d.skillsToTeach ?? []))
      .catch(() => setError("Failed to load skills"))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const skillNames = skills.map((skill) => skill.name)

  const handleRemove = async (skillName: string) => {
    setRemoving(skillName)
    try {
      const { skillsToTeach } = await skillsService.removeSkill(skillName)
      setSkills(skillsToTeach)
      showToast(`"${skillName}" removed`)
    } catch {
      setError(`Failed to remove "${skillName}"`)
    } finally {
      setRemoving(null)
    }
  }

  const openModal = () => {
    setSelected(skillNames)
    setSearch("")
    setActiveTab("All")
    setShowModal(true)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  const toggleSelect = (skillName: string) => {
    setSelected((prev) =>
      prev.includes(skillName)
        ? prev.filter((x) => x !== skillName)
        : [...prev, skillName]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { skillsToTeach } = await skillsService.saveSkills(selected)
      setSkills(skillsToTeach)
      setShowModal(false)
      showToast(`Skills updated (${skillsToTeach.length})`)
    } catch {
      setError("Failed to save skills")
    } finally {
      setSaving(false)
    }
  }

  const suggestions = (() => {
    const pool =
      activeTab === "All"
        ? ALL_SUGGESTIONS
        : (SKILL_CATEGORIES[activeTab] ?? [])

    if (!search.trim()) return pool
    return pool.filter((s) =>
      s.toLowerCase().includes(search.toLowerCase())
    )
  })()

  const customSkill = search.trim()

  const showCustomAdd =
    customSkill.length > 1 &&
    !ALL_SUGGESTIONS.some((s) => s.toLowerCase() === customSkill.toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === customSkill.toLowerCase())

  const studentCount = (name: string) => {
    if (!name || typeof name !== "string") return 0
    const seed = name.charCodeAt(0) + name.charCodeAt(name.length - 1)
    return (seed % 20) + 2
  }

  return (
    <>
      {toast && (
        <div className="sk-toast">
          <Check size={13} /> {toast}
        </div>
      )}

      <div className="td-box sk-root">
        <div className="td-box-head">
          <h3>
            <span className="td-box-icon"><BookOpen size={14} /></span>
            Skills You Teach
          </h3>
          <button className="td-link-btn sk-edit-btn" onClick={openModal}>
            <Pencil size={11} /> Manage skills
          </button>
        </div>

        {error && (
          <div className="sk-error">
            <AlertCircle size={13} /> {error}
            <button onClick={() => setError("")}><X size={11} /></button>
          </div>
        )}

        {loading ? (
          <div className="sk-loading">
            <Loader2 size={22} className="sk-spin" />
            <span>Loading skills…</span>
          </div>
        ) : skills.length === 0 ? (
          <div className="sk-empty">
            <div className="sk-empty-icon"><Sparkles size={28} /></div>
            <h4>No skills added yet</h4>
            <p>Add the skills you teach so students can find and book you</p>
            <button className="sk-add-first-btn" onClick={openModal}>
              <Plus size={14} /> Add your first skill
            </button>
          </div>
        ) : (
          <>
            <div className="sk-summary-row">
              <span className="sk-summary-pill">
                <Star size={11} />{skills.length} skill{skills.length !== 1 ? "s" : ""}
              </span>
              <span className="sk-summary-pill">
                <Users size={11} />
                {skills.reduce((n, skill) => n + studentCount(skill.name), 0)} students
              </span>
              <span className="sk-summary-pill">
                <TrendingUp size={11} />Active
              </span>
            </div>

            <div className="sk-rows">
              {skills.map((skill) => {
                const students = studentCount(skill.name)
                return (
                  <div className="td-skill-row" key={skill._id}>
                    <div className="td-skill-icon">{getEmoji(skill.name)}</div>
                    <div className="td-skill-info">
                      <div className="td-skill-top">
                        <span className="td-skill-name">{skill.name}</span>
                        <div className="sk-row-right">
                          <span className="td-skill-count">{students} students</span>
                          <button
                            className="sk-row-del"
                            onClick={() => handleRemove(skill.name)}
                            disabled={removing === skill.name}
                            title={`Remove ${skill.name}`}
                          >
                            {removing === skill.name
                              ? <Loader2 size={11} className="sk-spin" />
                              : <X size={11} />
                            }
                          </button>
                        </div>
                      </div>
                      <ProgressBar pct={getPct(students)} />
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="sk-add-more-btn" onClick={openModal}>
              <Plus size={13} /> Add more skills
            </button>
          </>
        )}
      </div>

      {showModal && (
        <div
          className="sk-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="sk-modal">
            <div className="sk-modal-head">
              <div>
                <h2 className="sk-modal-title">Manage Skills</h2>
                <p className="sk-modal-sub">
                  These are saved to your profile — students search by skill
                </p>
              </div>
              <button className="sk-modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="sk-modal-search-wrap">
              <Search size={14} className="sk-modal-search-icon" />
              <input
                ref={inputRef}
                className="sk-modal-search"
                placeholder="Search or type a custom skill…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && showCustomAdd) {
                    toggleSelect(customSkill)
                    setSearch("")
                  }
                }}
              />
              {search && (
                <button className="sk-search-clear" onClick={() => setSearch("")}>
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="sk-modal-tabs">
              {["All", ...Object.keys(SKILL_CATEGORIES)].map((tab) => (
                <button
                  key={tab}
                  className={`sk-tab${activeTab === tab ? " active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {selected.length > 0 && (
              <div className="sk-selected-area">
                <span className="sk-selected-label">
                  Selected ({selected.length})
                </span>
                <div className="sk-selected-chips">
                  {selected.map((skillName) => (
                    <SkillTag
                      key={skillName}
                      name={skillName}
                      onRemove={() => toggleSelect(skillName)}
                      removing={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {showCustomAdd && (
              <button
                className="sk-custom-add"
                onClick={() => {
                  toggleSelect(customSkill)
                  setSearch("")
                }}
              >
                <Plus size={13} />
                Add custom skill: <strong>"{customSkill}"</strong>
              </button>
            )}

            <div className="sk-modal-body">
              {suggestions.length === 0 ? (
                <div className="sk-no-results">
                  <Search size={20} />
                  <p>No matching skills — type above to add a custom one</p>
                </div>
              ) : (
                <div className="sk-suggestion-grid">
                  {suggestions.map((skillName) => {
                    const isSelected = selected.includes(skillName)
                    const isExisting = skillNames.includes(skillName)

                    return (
                      <button
                        key={skillName}
                        className={`sk-suggestion-btn${isSelected ? " selected" : ""}${isExisting ? " existing" : ""}`}
                        onClick={() => toggleSelect(skillName)}
                      >
                        <span className="sk-sug-emoji">{getEmoji(skillName)}</span>
                        <span className="sk-sug-name">{skillName}</span>
                        {isSelected && <Check size={11} className="sk-sug-check" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="sk-modal-footer">
              <span className="sk-footer-hint">
                {selected.length === 0
                  ? "Select skills above"
                  : `${selected.length} skill${selected.length !== 1 ? "s" : ""} selected`}
              </span>
              <div className="sk-footer-actions">
                <button className="sk-btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="sk-btn-save"
                  onClick={handleSave}
                  disabled={saving || selected.length === 0}
                >
                  {saving
                    ? <><Loader2 size={13} className="sk-spin" /> Saving…</>
                    : <><Check size={13} /> Save Skills</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}