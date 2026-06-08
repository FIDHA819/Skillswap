import { useEffect, useState } from "react"

import TeacherHero         from "../hooks/TeacherProfile/TecaherHero"
import TeacherAbout        from "../hooks/TeacherProfile/TeacherAbout"
import TeacherSkills       from "../hooks/TeacherProfile/TeacherSkills"
import TeacherStats        from "../hooks/TeacherProfile/TeacherStats"
import TeacherAvailability from "../hooks/TeacherProfile/TeacherAvailability"
import TeacherVerification from "../hooks/TeacherProfile/TeacherVerification"
import TeacherAchievements from "../hooks/TeacherProfile/TeacherAchievement"
import TeacherContactInfo  from "../hooks/TeacherProfile/TeacherContactInfo"

import { teacherService }  from "../../../services/teacherService"
import type { TeacherProfile } from "../../../domain/entities/teacher"

import "../styles/teacherProfile.css"

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState<"saved" | "error" | null>(null)

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await teacherService.getProfile()
      setProfile(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

const handleUpdate = async (data: Partial<TeacherProfile>) => {
  if (!profile) return

  const optimistic = {
    ...profile,
    ...data
  }

  setProfile(optimistic)

  try {
    await teacherService.updateProfile(data)

    setToast("saved")
  } catch (error) {
    console.error(error)
    loadProfile()
    setToast("error")
  
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2500)
    }
  }

  if (loading) {
    return (
      <div className="tp-loading">
        <div className="tp-spinner" />
        <p>Loading your profile…</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="tp-loading">
        <p className="tp-muted">Profile not found.</p>
      </div>
    )
  }

  return (
    <div className="tp-page">

      {/* Toast */}
      {toast && (
        <div className={`tp-toast tp-toast-${toast}`}>
          {toast === "saved" ? "✓ Changes saved" : "✕ Failed to save"}
        </div>
      )}

      {saving && <div className="tp-saving">Saving…</div>}

      <TeacherHero profile={profile} onUpdate={handleUpdate} />

      <TeacherStats profile={profile} />

      <div className="tp-layout">
        {/* Left column */}
        <div className="tp-main">
          <TeacherAbout        profile={profile} onUpdate={handleUpdate} />
          <TeacherSkills       profile={profile} onUpdate={handleUpdate} />
          <TeacherAvailability profile={profile} onUpdate={handleUpdate} />
        </div>

        {/* Right column */}
        <div className="tp-side">
          <TeacherAchievements profile={profile} />
          <TeacherVerification profile={profile} onUpdate={handleUpdate} />
          <TeacherContactInfo  profile={profile} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  )
}