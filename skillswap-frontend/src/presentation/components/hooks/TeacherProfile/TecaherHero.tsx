import { useState, useRef ,useEffect} from "react"
import { Camera, Star, Video, Users, Pencil, Check, X, MapPin, Globe } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

export default function TeacherHero({ profile, onUpdate }: Props) {
  const [editHeadline, setEditHeadline] = useState(false)
const [headline, setHeadline] = useState(profile.headline || "")

useEffect(() => {
  setHeadline(profile.headline || "")
}, [profile.headline])

  const [saving, setSaving]             = useState(false)
  const [uploading, setUploading]       = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const initial = profile.fullName?.charAt(0)?.toUpperCase() || "T"

  const saveHeadline = async () => {
    setSaving(true)
    try {
      await teacherService.updateProfile({ headline })
      onUpdate({ headline })
      setEditHeadline(false)
    } finally { setSaving(false) }
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { profileImage } = await teacherService.uploadPhoto(file)
      onUpdate({ profileImage })
    } finally { setUploading(false) }
  }




  return (
    <div className="tp-hero">
      <div className="tp-hero-glow" />
      <div className="tp-hero-inner">
        {/* Avatar */}
        <div className="tp-av-wrap">
          {profile.profileImage
            ? <img src={profile.profileImage} alt={profile.fullName} className="tp-av-img" />
            : <div className="tp-av-fallback">{initial}</div>
          }
          <button className="tp-av-cam" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <span className="tp-spin-xs" /> : <Camera size={13} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          {profile.kycVerified && <span className="tp-av-badge">✓</span>}
        </div>

        {/* Text */}
        <div className="tp-hero-text">
          <h1 className="tp-hero-name">{profile.fullName}</h1>

          {editHeadline ? (
            <div className="tp-headline-edit">
              <input
                className="tp-headline-input"
                value={headline}
                maxLength={80}
                autoFocus
                onChange={e => setHeadline(e.target.value)}
                placeholder="e.g. Full-Stack Developer & React Expert"
              />
              <button className="tp-hl-btn save" onClick={saveHeadline} disabled={saving}>
                {saving ? <span className="tp-spin-xs" /> : <Check size={12} />}
              </button>
              <button className="tp-hl-btn cancel" onClick={() => { setHeadline(profile.headline); setEditHeadline(false) }}>
                <X size={12} />
              </button>
            </div>
          ) : (
            <button className="tp-hero-headline" onClick={() => setEditHeadline(true)}>
              {profile.headline || <span className="tp-muted">Add a headline…</span>}
              <Pencil size={11} className="tp-pencil" />
            </button>
          )}

          <div className="tp-hero-meta">
            {profile.country  && <span><MapPin size={12}/>{profile.country}</span>}
            {profile.language && <span><Globe  size={12}/>{profile.language}</span>}
          </div>

          <div className="tp-hero-stats">
            <div className="tp-hs">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <strong>{profile.rating > 0 ? profile.rating.toFixed(1) : "New"}</strong>
              <span>Rating</span>
            </div>
            <div className="tp-hs-div" />
            <div className="tp-hs">
              <Video size={14} />
              <strong>{profile.totalSessions}</strong>
              <span>Sessions</span>
            </div>
            <div className="tp-hs-div" />
            <div className="tp-hs">
              <Users size={14} />
              <strong>{profile.totalStudents}</strong>
              <span>Students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}