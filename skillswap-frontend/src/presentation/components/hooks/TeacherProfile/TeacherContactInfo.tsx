import { useState ,useEffect} from "react"
import { Mail, MapPin, Globe, Pencil, Check, X, Phone } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

export default function TeacherContactInfo({ profile, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [country, setCountry] = useState(profile.country || "")
const [language, setLanguage] = useState(profile.language || "")
useEffect(() => {
  setCountry(profile.country || "")
  setLanguage(profile.language || "")
}, [profile.country, profile.language])
  const [saving,   setSaving]   = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await teacherService.updateProfile({ country, language })
      onUpdate({ country, language })
      setEditing(false)
    } finally { setSaving(false) }
  }

  return (
    <div className="tp-card">
      <div className="tp-card-head">
        <div className="tp-card-title"><Mail size={15} />Contact Info</div>
        {!editing && (
          <button className="tp-icon-btn" onClick={() => setEditing(true)}><Pencil size={14} /></button>
        )}
      </div>

      {editing ? (
        <div className="tp-edit-block">
          <label className="tp-label">Country</label>
          <input className="tp-input" value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. India" />
          <label className="tp-label" style={{ marginTop:10 }}>Language</label>
          <input className="tp-input" value={language} onChange={e => setLanguage(e.target.value)} placeholder="e.g. English, Malayalam" />
          <div className="tp-edit-actions">
            <button className="tp-btn-save" onClick={save} disabled={saving}>
              {saving ? <span className="tp-spin-xs" /> : <Check size={13} />} Save
            </button>
            <button className="tp-btn-cancel" onClick={() => { setCountry(profile.country); setLanguage(profile.language); setEditing(false) }}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="tp-contact-rows">
          <div className="tp-contact-row">
            <Mail size={14} />
            <span>{profile.email || "—"}</span>
          </div>
          <div className="tp-contact-row">
            <MapPin size={14} />
            <span>{profile.country || "—"}</span>
          </div>
          <div className="tp-contact-row">
            <Globe size={14} />
            <span>{profile.language || "—"}</span>
          </div>
        </div>
      )}
    </div>
  )
}