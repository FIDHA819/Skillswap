import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import {
  Pencil, MapPin, Globe, BookOpen, User,
  ArrowLeft, CheckCircle2, ShieldCheck,
  Target, IdCard, Clock, AlertTriangle, Check
} from "lucide-react"
import "../styles/viewProfile.css"

export default function ViewProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="vp-loading">
        <div className="vp-loading-spinner" />
        Loading profile…
      </div>
    )
  }

  const photo = user.photoUrl?.startsWith("http") ? user.photoUrl : undefined
  const initial = user.fullName?.charAt(0).toUpperCase() || "U"

  const formatDate = (date?: string) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    })
  }

  const kycStatus = user.kycStatus?.toLowerCase()
  const bankStatus = user.bankStatus?.toLowerCase()

  const statusBadge = (value: string | undefined, fallback: string) => {
    const v = (value || "").toLowerCase()
    if (v === "approved" || v === "verified" || v === "completed") return "ok"
    if (v === "pending") return "warn"
    if (v === "rejected") return "danger"
    return "muted"
  }

  return (
    <div className="vp-root">
      <div className="vp-container">

        {/* HERO */}
        <div className="vp-hero">
          <div className="vp-avatar-wrap">
            {photo
              ? <img src={photo} className="vp-avatar" alt={user.fullName || "Profile"} />
              : <div className="vp-avatar-fallback">{initial}</div>
            }
            <span className="vp-status-dot" />
          </div>

          <div className="vp-user-info">
            <h1>{user.fullName || user.email}</h1>
            {user.nickname && <p className="vp-handle">@{user.nickname}</p>}
            <div className="vp-tags">
              {user.country && (
                <span className="vp-tag">
                  <MapPin size={12} aria-hidden="true" />
                  {user.country}
                </span>
              )}
              {user.language && (
                <span className="vp-tag">
                  <Globe size={12} aria-hidden="true" />
                  {user.language}
                </span>
              )}
              {user.qualification && (
                <span className="vp-tag">
                  <BookOpen size={12} aria-hidden="true" />
                  {user.qualification}
                </span>
              )}
            </div>
          </div>

          <div className="vp-actions">
            <button className="vp-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} aria-hidden="true" />
              Back
            </button>
            <button className="vp-btn primary" onClick={() => navigate("/profile/edit")}>
              <Pencil size={14} aria-hidden="true" />
              Edit
            </button>
          </div>
        </div>

        {/* COMPLETE BANNER */}
        {user.profileCompleted && (
          <div className="vp-complete-banner">
            <CheckCircle2 size={15} aria-hidden="true" />
            Profile completed — great work keeping everything up to date
          </div>
        )}

        {/* GRID */}
        <div className="vp-grid">

          {/* PERSONAL */}
          <div className="vp-card">
            <div className="vp-card-header">
              <User size={14} aria-hidden="true" />
              <span>Personal</span>
            </div>
            <div className="vp-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="vp-field">
              <label>Date of birth</label>
              <p>{formatDate(user.dob)}</p>
            </div>
            <div className="vp-field">
              <label>Gender</label>
              <p>{user.gender || "—"}</p>
            </div>
          </div>

          {/* LOCATION */}
          <div className="vp-card">
            <div className="vp-card-header">
              <MapPin size={14} aria-hidden="true" />
              <span>Location</span>
            </div>
            <div className="vp-field">
              <label>Country</label>
              <p>{user.country || "—"}</p>
            </div>
            <div className="vp-field">
              <label>Language</label>
              <p>{user.language || "—"}</p>
            </div>
            <div className="vp-field">
              <label>Joined</label>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>

          {/* SKILLS */}
          <div className="vp-card vp-full">
            <div className="vp-card-header">
              <Target size={14} aria-hidden="true" />
              <span>Skills</span>
            </div>
            <div className="vp-skills-grid">
              <div>
                <h4 className="vp-skills-title">Want to learn</h4>
                <div className="vp-skill-wrap">
                  {user.skillsToLearn?.length
                    ? user.skillsToLearn.map((s: string) => (
                        <span key={s} className="vp-skill-tag learn">{s}</span>
                      ))
                    : <span className="vp-empty">No skills added</span>
                  }
                </div>
              </div>
              <div>
                <h4 className="vp-skills-title">Want to teach</h4>
                <div className="vp-skill-wrap">
                  {user.skillsToTeach?.length
                    ? user.skillsToTeach.map((s: string) => (
                        <span key={s} className="vp-skill-tag teach">{s}</span>
                      ))
                    : <span className="vp-empty">No skills added</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* ACCOUNT STATUS */}
          <div className="vp-card vp-full">
            <div className="vp-card-header">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Account status</span>
            </div>
            <div className="vp-status-grid">
              <div className="vp-stat">
                <p className="vp-stat-label">Profile</p>
                <span className={`vp-badge ${user.profileCompleted ? "ok" : "warn"}`}>
                  {user.profileCompleted
                    ? <><Check size={11} aria-hidden="true" /> Completed</>
                    : <><Clock size={11} aria-hidden="true" /> Incomplete</>
                  }
                </span>
              </div>
              <div className="vp-stat">
                <p className="vp-stat-label">Verification</p>
                <span className={`vp-badge ${user.isVerified ? "ok" : "warn"}`}>
                  {user.isVerified
                    ? <><Check size={11} aria-hidden="true" /> Verified</>
                    : <><Clock size={11} aria-hidden="true" /> Pending</>
                  }
                </span>
              </div>
              <div className="vp-stat">
                <p className="vp-stat-label">Role</p>
                <span className="vp-badge info">
                  <User size={11} aria-hidden="true" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* TEACHER SECTION */}
          {user.role === "teacher" && (
            <div className="vp-card vp-full">
              <div className="vp-card-header">
                <IdCard size={14} aria-hidden="true" />
                <span>Teacher verification</span>
              </div>
              <div className="vp-kyc-grid">
                <div className="vp-stat">
                  <p className="vp-stat-label">KYC status</p>
                  <span className={`vp-badge ${statusBadge(user.kycStatus, "Not Submitted")}`}>
                    {kycStatus === "approved"
                      ? <><Check size={11} aria-hidden="true" /> Approved</>
                      : kycStatus === "rejected"
                      ? <><AlertTriangle size={11} aria-hidden="true" /> Rejected</>
                      : <><Clock size={11} aria-hidden="true" /> {user.kycStatus || "Not submitted"}</>
                    }
                  </span>
                </div>
                <div className="vp-stat">
                  <p className="vp-stat-label">Bank account</p>
                  <span className={`vp-badge ${statusBadge(user.bankStatus, "Not Added")}`}>
                    {user.bankStatus?.toLowerCase() === "added"
                      ? <><Check size={11} aria-hidden="true" /> Added</>
                      : <><AlertTriangle size={11} aria-hidden="true" /> {user.bankStatus || "Not added"}</>
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}