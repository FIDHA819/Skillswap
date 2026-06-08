import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"

const bgImg = "/assets/bg.jpeg"

export default function ProfileSetupPage() {

const { user, token } = useAuth()

const navigate = useNavigate()

const [loading, setLoading] = useState(false)
const [photo, setPhoto] = useState(null)
const [error, setError] = useState("")
const [focusedField, setFocusedField] = useState(null)

const [form, setForm] = useState({
fullName: "",
nickname: "",
gender: "",
country: "",
language: "",
dob: "",
qualification: "",
})


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Redirect if profile exists
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

useEffect(() => {

if (user?.profileCompleted)
navigate("/dashboard")

}, [user, navigate])


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Input change handler
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const handleChange = (e) => {

setForm({
...form,
[e.target.name]: e.target.value
})

}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Photo validation
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const handlePhotoChange = (e) => {

const file = e.target.files?.[0]

if (!file) return

if (!file.type.startsWith("image/")) {
setError("Only image files allowed")
return
}

if (file.size > 2 * 1024 * 1024) {
setError("Image must be under 2MB")
return
}

setError("")
setPhoto(file)

}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Form validation
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const validate = () => {

if (!form.fullName.trim())
return "Full name required"

if (!form.gender)
return "Gender required"

if (!form.country.trim())
return "Country required"

if (!form.language.trim())
return "Language required"

if (!form.dob)
return "Birthday required"

if (new Date(form.dob) > new Date())
return "Birthday cannot be future date"

if (!form.qualification.trim())
return "Qualification required"

return null

}


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Submit handler
━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

const submit = async () => {

if (loading) return

const validationError = validate()

if (validationError) {
setError(validationError)
return
}

if (!token) {
setError("Session expired. Login again.")
return
}

try {

setLoading(true)
setError("")

const formData = new FormData()

Object.keys(form).forEach(key =>
formData.append(key, form[key])
)

if (photo)
formData.append("photo", photo)

await axios.post(
"http://localhost:5000/profile/create",
formData,
{
headers:{

Authorization:
`Bearer ${token}`,

"Content-Type":
"multipart/form-data"

}
}
)

navigate("/dashboard")

}

catch (err) {

const error = err

if (axios.isAxiosError(error)) {

if (error.response?.data?.message === "Profile already exists") {
navigate("/dashboard")
return
}

setError(
error.response?.data?.message ||
"Profile creation failed"
)

} else {

setError("Unexpected error occurred")

}

}
finally{
setLoading(false)
}

}


const fields = [
{ name:"fullName", label:"Full Name", placeholder:"Enter your full name", type:"text", icon:"👤" },
{ name:"nickname", label:"Nick Name", placeholder:"Enter nickname", type:"text", icon:"✨" },
{ name:"country", label:"Country", placeholder:"Enter your country", type:"text", icon:"🌍" },
{ name:"language", label:"Language", placeholder:"Enter preferred language", type:"text", icon:"💬" },
{ name:"dob", label:"Birthday", placeholder:"", type:"date", icon:"🎂" },
{ name:"qualification", label:"Qualification", placeholder:"Enter qualification", type:"text", icon:"🎓" },
]


return (
<>
{/* ERROR MESSAGE */}

{error && (
<div style={{
position:"fixed",
top:"20px",
right:"20px",
background:"#ff4d4f",
padding:"10px 18px",
borderRadius:"8px",
color:"white",
zIndex:999
}}>
{error}
</div>
)}

{/* YOUR ORIGINAL UI BELOW — UNCHANGED */}


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .psp-root * { box-sizing: border-box; }

        .psp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          position: relative;
          color: white;
          overflow-x: hidden;
        }

        .psp-bg {
          position: fixed;
          inset: 0;
          background-image: url(${bgImg});
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .psp-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,20,60,0.93) 0%, rgba(15,40,100,0.88) 50%, rgba(5,15,50,0.95) 100%);
          z-index: 1;
        }

        /* Animated floating orbs */
        .psp-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          z-index: 1;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .psp-orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #4f8fff, transparent);
          top: -100px; left: -100px;
          animation-duration: 9s;
        }
        .psp-orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #00c6ff, transparent);
          bottom: -80px; right: -80px;
          animation-duration: 11s;
          animation-delay: -3s;
        }
        .psp-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #7b9fff, transparent);
          top: 50%; left: 50%;
          animation-duration: 7s;
          animation-delay: -5s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.08); }
        }

        .psp-content {
          position: relative;
          z-index: 2;
          padding: 40px 24px 60px;
          max-width: 860px;
          margin: 0 auto;
          animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── HEADER ── */
        .psp-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }

        .psp-avatar-wrap {
          position: relative;
          animation: avatarPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
        }

        @keyframes avatarPop {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }

        .psp-avatar-ring {
          width: 90px; height: 90px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, #4f8fff, #00c6ff, #4f8fff);
          background-size: 200% 200%;
          animation: ringRotate 3s linear infinite;
        }

        @keyframes ringRotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .psp-avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid rgba(5,15,50,0.9);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .psp-avatar-img:hover { transform: scale(1.04); }

        .psp-edit-badge {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f8fff, #00c6ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          border: 2px solid rgba(5,15,50,0.9);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .psp-edit-badge:hover {
          transform: scale(1.15);
          box-shadow: 0 0 10px rgba(79,143,255,0.5);
        }

        .psp-title {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 600;
          margin: 16px 0 0;
          letter-spacing: -0.3px;
          animation: fadeUp 0.5s 0.25s both;
        }

        .psp-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin: 4px 0 0;
          animation: fadeUp 0.5s 0.3s both;
        }

        .psp-kyc-badge {
          margin-top: 10px;
          background: linear-gradient(90deg, rgba(34,197,94,0.25), rgba(34,197,94,0.15));
          border: 1px solid rgba(34,197,94,0.4);
          color: #4ade80;
          padding: 5px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          display: flex; align-items: center; gap: 6px;
          animation: fadeUp 0.5s 0.35s both;
        }
        .psp-kyc-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* ── CARD ── */
        .psp-card {
          margin-top: 36px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 32px;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.6s 0.2s both;
          box-shadow: 0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        .psp-section-label {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(79,143,255,0.8);
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .psp-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(79,143,255,0.3), transparent);
        }

        .psp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 600px) {
          .psp-grid { grid-template-columns: 1fr; }
          .psp-card { padding: 20px 16px; }
        }

        /* ── FIELD ── */
        .psp-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeUp 0.4s both;
        }

        .psp-field:nth-child(1) { animation-delay: 0.1s; }
        .psp-field:nth-child(2) { animation-delay: 0.15s; }
        .psp-field:nth-child(3) { animation-delay: 0.2s; }
        .psp-field:nth-child(4) { animation-delay: 0.25s; }
        .psp-field:nth-child(5) { animation-delay: 0.3s; }
        .psp-field:nth-child(6) { animation-delay: 0.35s; }
        .psp-field:nth-child(7) { animation-delay: 0.4s; }

        .psp-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.3px;
          display: flex; align-items: center; gap: 6px;
        }

        .psp-input-wrap {
          position: relative;
        }

        .psp-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.07);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          appearance: none;
          -webkit-appearance: none;
        }

        .psp-input::placeholder { color: rgba(255,255,255,0.3); }

        .psp-input:focus {
          border-color: rgba(79,143,255,0.7);
          background: rgba(79,143,255,0.08);
          box-shadow: 0 0 0 3px rgba(79,143,255,0.15), 0 4px 12px rgba(0,0,0,0.2);
          transform: translateY(-1px);
        }

        .psp-input:hover:not(:focus) {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.09);
        }

        .psp-input option { background: #0d2060; color: white; }

        /* select arrow */
        .psp-select-wrap::after {
          content: '▾';
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          pointer-events: none;
          font-size: 12px;
        }

        /* ── SAVE BUTTON ── */
        .psp-save-btn {
          margin-top: 28px;
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #4f8fff 0%, #00c6ff 100%);
          color: white;
          font-family: 'Sora', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 4px 20px rgba(79,143,255,0.35);
        }

        .psp-save-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .psp-save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(79,143,255,0.5);
        }
        .psp-save-btn:hover:not(:disabled)::before { opacity: 1; }

        .psp-save-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 2px 12px rgba(79,143,255,0.3);
        }

        .psp-save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .psp-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* shimmer on card top border */
        .psp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(79,143,255,0.6), rgba(0,198,255,0.6), transparent);
          border-radius: 1px;
        }
        .psp-card { position: relative; }
      `}</style>

      <div className="psp-root">
        {/* BG layers */}
        <div className="psp-bg" />
        <div className="psp-overlay" />
        <div className="psp-orb psp-orb-1" />
        <div className="psp-orb psp-orb-2" />
        <div className="psp-orb psp-orb-3" />

        <div className="psp-content">
          {/* HEADER */}
          <div className="psp-header">
            <div className="psp-avatar-wrap">
              <label>
                <div className="psp-avatar-ring">
                  <img
                    src={photo ? URL.createObjectURL(photo) : "/avatar-placeholder.png"}
                    alt="avatar"
                    className="psp-avatar-img"
                  />
                </div>
                <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
              </label>
              <div className="psp-edit-badge">✏</div>
            </div>

            <h2 className="psp-title">Complete Your Profile</h2>
            <p className="psp-subtitle">Fill in your details to get started</p>

            {user?.kycCompleted && (
              <div className="psp-kyc-badge">
                <span className="psp-kyc-dot" />
                KYC VERIFIED ACCOUNT
              </div>
            )}
          </div>

          {/* FORM CARD */}
          <div className="psp-card">
            <div className="psp-section-label">Personal Information</div>

            <div className="psp-grid">
              {fields.map(({ name, label, placeholder, type, icon }) => (
                <div className="psp-field" key={name}>
                  <label className="psp-label">
                    <span>{icon}</span>
                    {label}
                  </label>
                  <div className={`psp-input-wrap ${type === "text" ? "" : ""}`}>
                    <input
                      type={type}
                      name={name}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="psp-input"
                      onFocus={() => setFocusedField(name)}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              ))}

              {/* GENDER - separate to keep select styling */}
              <div className="psp-field" style={{ animationDelay: "0.45s" }}>
                <label className="psp-label"><span>⚥</span> Gender</label>
                <div className="psp-input-wrap psp-select-wrap">
                  <select name="gender" onChange={handleChange} className="psp-input">
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SAVE */}
            <button onClick={submit} disabled={loading} className="psp-save-btn">
              {loading ? (
                <><span className="psp-spinner" />Saving your profile…</>
              ) : (
                "Save Profile →"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}