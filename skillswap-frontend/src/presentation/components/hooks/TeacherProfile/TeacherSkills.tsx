import { useState,useEffect } from "react"
import { Code2, Plus, X, Check, Pencil } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"
import { SKILL_SUGGESTIONS } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

export default function TeacherSkills({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [skills,  setSkills]  = useState<string[]>(profile.skillsToTeach)
  useEffect(() => {
  setSkills(profile.skillsToTeach || [])
}, [profile.skillsToTeach])
  const [input,   setInput]   = useState("")
  const [saving,  setSaving]  = useState(false)

  const add = (skill: string) => {
    const s = skill.trim()
    if (!s || skills.includes(s)) return
    setSkills([...skills, s])
    setInput("")
  }

  const remove = (s: string) => setSkills(skills.filter(x => x !== s))

  const save = async () => {
    setSaving(true)
    try {
      await teacherService.updateProfile({ skillsToTeach: skills })
      onUpdate({ skillsToTeach: skills })
      setEditing(false)
    } finally { setSaving(false) }
  }

  const cancel = () => {
    setSkills(profile.skillsToTeach)
    setInput("")
    setEditing(false)
  }

  const suggestions = SKILL_SUGGESTIONS.filter(
    s => !skills.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  ).slice(0, 8)

  return (
    <div className="tp-card">
      <div className="tp-card-head">
        <div className="tp-card-title"><Code2 size={15} />Skills I Teach</div>
        {!editing && (
          <button className="tp-icon-btn" onClick={() => setEditing(true)}>
            <Pencil size={14} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="tp-edit-block">
          {/* Current skills */}
          <div className="tp-skill-tags editing">
            {skills.map(s => (
              <span key={s} className="tp-skill-tag editing">
                {s}
                <button onClick={() => remove(s)}><X size={10} /></button>
              </span>
            ))}
          </div>

          {/* Input */}
          <div className="tp-skill-input-row">
            <input
              className="tp-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add(input)}
              placeholder="Type a skill and press Enter…"
            />
            <button className="tp-add-btn" onClick={() => add(input)} disabled={!input.trim()}>
              <Plus size={14} />
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="tp-suggestions">
              <span className="tp-suggestions-label">Suggestions:</span>
              {suggestions.map(s => (
                <button key={s} className="tp-suggestion" onClick={() => add(s)}>
                  + {s}
                </button>
              ))}
            </div>
          )}

          <div className="tp-edit-actions">
            <button className="tp-btn-save" onClick={save} disabled={saving}>
              {saving ? <span className="tp-spin-xs" /> : <Check size={13} />}
              Save
            </button>
            <button className="tp-btn-cancel" onClick={cancel}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="tp-skill-tags">
          {profile.skillsToTeach.length > 0
            ? profile.skillsToTeach.map(s => (
                <span key={s} className="tp-skill-tag">{s}</span>
              ))
            : <span className="tp-muted">No skills added yet.</span>
          }
        </div>
      )}
    </div>
  )
}