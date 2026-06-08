import { useState, useRef } from "react"
import {
  X, Video, Upload, Calendar, Clock, BookOpen,
  DollarSign, Users, FileText, Check, AlertCircle,
  Play, Wifi,
} from "lucide-react"
import type { CreateSessionPayload, SessionType, SessionMode } from "../../../../domain/entities/session"
import { sessionService } from "../../../../services/SessionService"

interface Props {
  onClose: () => void
  onCreated: () => void
  kycVerified: boolean
  bankAdded: boolean
}

const SUBJECTS = [
  "React","Node.js","TypeScript","Python","MongoDB","Next.js",
  "Vue.js","Angular","Django","Flutter","Java","AWS","Docker",
  "UI/UX Design","Machine Learning","GraphQL","PostgreSQL","CSS",
]

export default function CreateSessionModal({ onClose, onCreated, kycVerified, bankAdded }: Props) {
  
  console.log("CREATE SESSION MODAL RENDERED");
  const [step,    setStep]    = useState<1|2>(1)
  const [type,    setType]    = useState<SessionType>("live")
  const [saving,  setSaving]  = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [error,   setError]   = useState("")
  const videoRef = useRef<HTMLInputElement>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const [form, setForm] = useState<CreateSessionPayload>({
    title: "", subject: "", description: "",
    date: "", time: "18:00", durationMins: 60,
    type: "live", mode: "free", price: 0, maxStudents: 20,
  })

  const set = (key: keyof CreateSessionPayload, val: any) =>
    setForm(p => ({ ...p, [key]: val }))

  const needsVerification = form.mode === "paid" && (!kycVerified || !bankAdded)

  const submit = async () => {
    if (!form.title.trim() || !form.subject) { setError("Title and subject are required."); return }
    if (type === "live" && (!form.date || !form.time)) { setError("Date and time are required for live sessions."); return }
    if (type === "recorded" && !videoFile) { setError("Please select a video file to upload."); return }
    if (form.mode === "paid" && (!form.price || form.price < 1)) { setError("Enter a valid price for paid sessions."); return }
    if (needsVerification) { setError("Complete KYC and bank verification before creating paid sessions."); return }

    setError("")
    setSaving(true)
    try {
      if (type === "live") {
        await sessionService.createLiveSession({ ...form, type: "live" })
      } else {
        await sessionService.uploadLecture({ ...form, type: "recorded" }, videoFile!, p => setUploadPct(p))
      }
      onCreated()
      onClose()
    } catch (e: any) {
      setError(e.message ?? "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  const canProceed = form.title.trim() && form.subject

  return (
    <div className="ss-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ss-modal">
        {/* Header */}
        <div className="ss-modal-head">
          <div>
            <h2 className="ss-modal-title">Create New Session</h2>
            <p className="ss-modal-sub">Schedule a live class or upload a recorded lecture</p>
          </div>
          <button className="ss-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Type toggle */}
        <div className="ss-type-toggle">
          <button
            className={`ss-type-btn${type === "live" ? " active" : ""}`}
            onClick={() => setType("live")}
          >
            <Wifi size={16} />
            Live Session
            <span className="ss-type-sub">Google Meet</span>
          </button>
          <button
            className={`ss-type-btn${type === "recorded" ? " active" : ""}`}
            onClick={() => setType("recorded")}
          >
            <Play size={16} />
            Video Lecture
            <span className="ss-type-sub">Upload video</span>
          </button>
        </div>

        {/* Form */}
        <div className="ss-form">
          {/* Title */}
          <div className="ss-field">
            <label className="ss-label"><FileText size={13} />Session title</label>
            <input
              className="ss-input"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="e.g. React Hooks Deep Dive"
              maxLength={80}
            />
          </div>

          {/* Subject */}
          <div className="ss-field">
            <label className="ss-label"><BookOpen size={13} />Subject</label>
            <select className="ss-select" value={form.subject} onChange={e => set("subject", e.target.value)}>
              <option value="">Select subject…</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="ss-field">
            <label className="ss-label"><FileText size={13} />Description</label>
            <textarea
              className="ss-textarea"
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="What will students learn in this session?"
              rows={3}
              maxLength={400}
            />
          </div>

          {/* Live-only: date/time/max students */}
          {type === "live" && (
            <div className="ss-row-3">
              <div className="ss-field">
                <label className="ss-label"><Calendar size={13} />Date</label>
                <input className="ss-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
              </div>
              <div className="ss-field">
                <label className="ss-label"><Clock size={13} />Time</label>
                <input className="ss-input" type="time" value={form.time} onChange={e => set("time", e.target.value)} />
              </div>
              <div className="ss-field">
                <label className="ss-label"><Users size={13} />Max students</label>
                <input className="ss-input" type="number" min={1} max={200} value={form.maxStudents}
                  onChange={e => set("maxStudents", Number(e.target.value))} />
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="ss-field">
            <label className="ss-label"><Clock size={13} />Duration (minutes)</label>
            <div className="ss-duration-btns">
              {[30,45,60,90,120].map(d => (
                <button
                  key={d}
                  className={`ss-dur-btn${form.durationMins === d ? " active" : ""}`}
                  onClick={() => set("durationMins", d)}
                >
                  {d}m
                </button>
              ))}
              <input
                className="ss-input ss-dur-custom"
                type="number"
                min={15}
                max={300}
                value={form.durationMins}
                onChange={e => set("durationMins", Number(e.target.value))}
                placeholder="Custom"
              />
            </div>
          </div>

          {/* Video upload (recorded only) */}
          {type === "recorded" && (
            <div className="ss-field">
              <label className="ss-label"><Upload size={13} />Video file</label>
              <div
                className={`ss-upload-drop${videoFile ? " has-file" : ""}`}
                onClick={() => videoRef.current?.click()}
              >
                {videoFile ? (
                  <>
                    <Play size={22} />
                    <div>
                      <div className="ss-upload-name">{videoFile.name}</div>
                      <div className="ss-upload-size">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                    <button className="ss-upload-clear" onClick={e => { e.stopPropagation(); setVideoFile(null) }}>
                      <X size={13} />
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={22} />
                    <div>
                      <div className="ss-upload-label">Click to upload video</div>
                      <div className="ss-upload-hint">MP4, MOV or AVI · Max 2 GB</div>
                    </div>
                  </>
                )}
              </div>
              <input ref={videoRef} type="file" accept="video/*" hidden
                onChange={e => setVideoFile(e.target.files?.[0] ?? null)} />
              {saving && uploadPct > 0 && (
                <div className="ss-upload-progress">
                  <div className="ss-upload-bar" style={{ width: `${uploadPct}%` }} />
                  <span>{uploadPct}%</span>
                </div>
              )}
            </div>
          )}

          {/* Free / Paid toggle */}
          <div className="ss-field">
            <label className="ss-label"><DollarSign size={13} />Pricing</label>
            <div className="ss-mode-toggle">
              <button
                className={`ss-mode-btn${form.mode === "free" ? " active free" : ""}`}
                onClick={() => set("mode", "free")}
              >
                Free
              </button>
              <button
                className={`ss-mode-btn${form.mode === "paid" ? " active paid" : ""}`}
                onClick={() => set("mode", "paid")}
              >
                Paid
              </button>
            </div>

            {form.mode === "paid" && (
              <div className="ss-price-row">
                <span className="ss-price-symbol">₹</span>
                <input
                  className="ss-input ss-price-input"
                  type="number"
                  min={1}
                  max={9999}
                  value={form.price || ""}
                  onChange={e => set("price", Number(e.target.value))}
                  placeholder="Enter price"
                />
              </div>
            )}

            {/* KYC/Bank warning for paid */}
            {form.mode === "paid" && needsVerification && (
              <div className="ss-verify-warn">
                <AlertCircle size={14} />
                <div>
                  <strong>Verification required for paid sessions</strong>
                  <p>
                    {!kycVerified && "KYC not verified. "}
                    {!bankAdded   && "Bank account not linked."}
                    {" "}Go to your profile to complete these.
                  </p>
                </div>
              </div>
            )}

            {form.mode === "paid" && kycVerified && bankAdded && (
              <div className="ss-verify-ok">
                <Check size={13} /> Account verified — paid sessions enabled
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="ss-error">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {/* Footer */}
        <div className="ss-modal-footer">
          <button className="ss-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="ss-btn-create" onClick={submit} disabled={saving || !canProceed}>
            {saving
              ? <><span className="ss-spin" /> {type === "recorded" ? `Uploading ${uploadPct}%` : "Creating…"}</>
              : type === "live"
              ? <><Wifi size={14} /> Create Live Session</>
              : <><Upload size={14} /> Upload Lecture</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}