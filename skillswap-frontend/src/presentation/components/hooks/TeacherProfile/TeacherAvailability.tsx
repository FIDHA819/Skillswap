import { useState,useEffect } from "react"
import { CalendarClock, Plus, X, Check, Pencil, Clock } from "lucide-react"
import type { TeacherProfile, AvailabilitySlot } from "../../../../domain/entities/teacher"
import { DAYS } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

const EMPTY_SLOT: AvailabilitySlot = { day: "Monday", start: "18:00", end: "20:00" }

export default function TeacherAvailability({ profile, onUpdate }: Props) {
  const [editing, setEditing]   = useState(false)
 const [slots, setSlots] = useState<AvailabilitySlot[]>(
  profile.availability || []
)
useEffect(() => {
  setSlots(profile.availability || [])
}, [profile.availability])
  const [newSlot, setNewSlot]   = useState<AvailabilitySlot>({ ...EMPTY_SLOT })
  const [saving,  setSaving]    = useState(false)
  const [addOpen, setAddOpen]   = useState(false)

  const addSlot = () => {
    if (slots.find(s => s.day === newSlot.day)) {
      setSlots(slots.map(s => s.day === newSlot.day ? { ...newSlot } : s))
    } else {
      setSlots([...slots, { ...newSlot }])
    }
    setAddOpen(false)
    setNewSlot({ ...EMPTY_SLOT })
  }

  const removeSlot = (day: string) => setSlots(slots.filter(s => s.day !== day))

  const save = async () => {
    setSaving(true)
    try {
      await teacherService.updateProfile({ availability: slots })
      onUpdate({ availability: slots })
      setEditing(false)
    } finally { setSaving(false) }
  }

  const cancel = () => {
    setSlots(profile.availability)
    setEditing(false)
    setAddOpen(false)
  }

  const fmt = (t: string) => {
    const [h, m] = t.split(":")
    const hr = parseInt(h)
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`
  }

  const dayColor: Record<string, string> = {
    Monday:"purple", Tuesday:"blue", Wednesday:"green",
    Thursday:"amber", Friday:"red", Saturday:"teal", Sunday:"pink",
  }

  return (
    <div className="tp-card">
      <div className="tp-card-head">
        <div className="tp-card-title"><CalendarClock size={15} />Availability</div>
        {!editing
          ? <button className="tp-icon-btn" onClick={() => setEditing(true)}><Pencil size={14} /></button>
          : (
            <div style={{ display:"flex", gap:6 }}>
              <button className="tp-btn-save sm" onClick={save} disabled={saving}>
                {saving ? <span className="tp-spin-xs" /> : <Check size={12} />} Save
              </button>
              <button className="tp-btn-cancel sm" onClick={cancel}><X size={12} /> Cancel</button>
            </div>
          )
        }
      </div>

      {slots.length === 0 && !editing && (
        <p className="tp-muted" style={{ textAlign:"center", padding:"16px 0" }}>
          No availability set yet.
        </p>
      )}

      <div className="tp-slots">
        {slots.map(s => (
          <div key={s.day} className={`tp-slot tp-slot-${dayColor[s.day] ?? "purple"}`}>
            <div className="tp-slot-day">{s.day}</div>
            <div className="tp-slot-time">
              <Clock size={11} />
              {fmt(s.start)} – {fmt(s.end)}
            </div>
            {editing && (
              <button className="tp-slot-del" onClick={() => removeSlot(s.day)}>
                <X size={11} />
              </button>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <>
          {addOpen ? (
            <div className="tp-add-slot-form">
              <div className="tp-form-row">
                <div className="tp-form-field">
                  <label className="tp-label">Day</label>
                  <select
                    className="tp-select"
                    value={newSlot.day}
                    onChange={e => setNewSlot({ ...newSlot, day: e.target.value })}
                  >
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="tp-form-field">
                  <label className="tp-label">From</label>
                  <input
                    className="tp-input"
                    type="time"
                    value={newSlot.start}
                    onChange={e => setNewSlot({ ...newSlot, start: e.target.value })}
                  />
                </div>
                <div className="tp-form-field">
                  <label className="tp-label">To</label>
                  <input
                    className="tp-input"
                    type="time"
                    value={newSlot.end}
                    onChange={e => setNewSlot({ ...newSlot, end: e.target.value })}
                  />
                </div>
              </div>
              <div className="tp-edit-actions">
                <button className="tp-btn-save sm" onClick={addSlot}>
                  <Plus size={12} /> Add Slot
                </button>
                <button className="tp-btn-cancel sm" onClick={() => setAddOpen(false)}>
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="tp-add-slot-btn" onClick={() => setAddOpen(true)}>
              <Plus size={14} /> Add availability slot
            </button>
          )}
        </>
      )}
    </div>
  )
}