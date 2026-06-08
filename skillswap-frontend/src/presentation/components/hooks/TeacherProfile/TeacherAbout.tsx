import { useState,useEffect } from "react"
import { Pencil, Check, X, BookOpen, Briefcase } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

export default function TeacherAbout({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [bio,     setBio]     = useState(profile.bio)
  const [exp,     setExp]     = useState(String(profile.experienceYears))
  useEffect(() => {
  setBio(profile.bio || "")
  setExp(String(profile.experienceYears || 0))
}, [profile.bio, profile.experienceYears])
  const [saving,  setSaving]  = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const payload = { bio, experienceYears: Number(exp) }
      await teacherService.updateProfile(payload)
      onUpdate(payload)
      setEditing(false)
    } finally { setSaving(false) }
  }

  const cancel = () => {
    setBio(profile.bio)
    setExp(String(profile.experienceYears))
    setEditing(false)
  }

  return (
    <div className="tp-card">
      <div className="tp-card-head">
        <div className="tp-card-title">
          <BookOpen size={15} />
          About Me
        </div>
        {!editing && (
          <button className="tp-icon-btn" onClick={() => setEditing(true)} title="Edit">
            <Pencil size={14} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="tp-edit-block">
          <label className="tp-label">Bio</label>
          <textarea
            className="tp-textarea"
            value={bio}
            rows={4}
            maxLength={600}
            onChange={e => setBio(e.target.value)}
            placeholder="Tell students about yourself, your background, and teaching style…"
          />
          <div className="tp-char-count">{bio.length}/600</div>

          <label className="tp-label" style={{ marginTop: 12 }}>Years of Experience</label>
          <input
            className="tp-input"
            type="number"
            min={0}
            max={50}
            value={exp}
            onChange={e => setExp(e.target.value)}
          />

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
        <div className="tp-about-body">
          <p className="tp-about-bio">
            {profile.bio || <span className="tp-muted">No bio added yet. Click edit to add one.</span>}
          </p>
          <div
  style={{
    fontSize: "14px",
    padding: "10px",
    background: "#131d42",
    color: "white"
  }}
>
 

  <span
    style={{
      fontSize: "14px",
      color: "white"
    }}
  >
     <Briefcase size={14} />
    <strong
      style={{
        fontSize: "14px",
        color: "white"
      }}
    >
      {profile.experienceYears}
    </strong>{" "}
    years of experience
  </span>
</div>
        </div>
      )}
    </div>
  )
}