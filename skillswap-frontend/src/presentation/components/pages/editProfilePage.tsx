import { useState, useRef, ChangeEvent, FormEvent,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Camera,
  ArrowLeft,
  Save,
  User,
  Globe,
  Loader2,
  AlertCircle
} from "lucide-react";
import { profileService } from "../../../services/profileService";
import {
ToastContainer,
toast
}
from "react-toastify"

import
"react-toastify/dist/ReactToastify.css"

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Syne:wght@500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ep-root {
    min-height: 100vh; background: #04080f;
    font-family: 'DM Sans', sans-serif; color: #f8fafc;
    padding-top: 96px; padding-bottom: 80px;
  }
  .ep-body { max-width: 760px; margin: 0 auto; padding: 0 24px; }

  /* ── PAGE HEADER ── */
  .ep-page-head {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 36px; animation: epFadeUp 0.5s ease both;
  }
  .ep-btn-back {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 100px;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; font-family: 'DM Sans', sans-serif;
    font-size: 14px; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
  }
  .ep-btn-back:hover { border-color: rgba(255,255,255,0.2); color: #f8fafc; }
  .ep-page-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 28px; font-weight: 700; letter-spacing: -0.5px; color: #f8fafc;
  }
  .ep-page-sub { font-size: 14px; color: #64748b; margin-top: 2px; }

  /* ── AVATAR SECTION ── */
  .ep-avatar-section {
    display: flex; align-items: center; gap: 24px;
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 24px 28px;
    margin-bottom: 20px; animation: epFadeUp 0.5s 0.05s ease both;
  }
  .ep-avatar-wrap { position: relative; cursor: pointer; flex-shrink: 0; }
  .ep-avatar {
    width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
    border: 2.5px solid rgba(99,102,241,0.4);
    box-shadow: 0 0 0 1px rgba(99,102,241,0.2);
    transition: opacity 0.2s;
  }
  .ep-avatar-wrap:hover .ep-avatar { opacity: 0.7; }
  .ep-avatar-fallback {
    width: 90px; height: 90px; border-radius: 50%;
    background: linear-gradient(135deg,#0d1a33,#1a1040);
    border: 2.5px solid rgba(99,102,241,0.4);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Clash Display', sans-serif; font-size: 34px; font-weight: 700;
    background-color: #0d1a33;
  }
  .ep-avatar-overlay {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.2s;
  }
  .ep-avatar-wrap:hover .ep-avatar-overlay { opacity: 1; }
  .ep-avatar-info {}
  .ep-avatar-title { font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; }
  .ep-avatar-hint  { font-size: 13px; color: #64748b; }
  .ep-avatar-btn {
    margin-top: 12px; display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 16px; border-radius: 100px;
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
    color: #a5b4fc; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;
  }
  .ep-avatar-btn:hover { background: rgba(99,102,241,0.2); }

  /* ── FORM CARD ── */
  .ep-card {
    background: #111827; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; padding: 28px;
    margin-bottom: 20px; animation: epFadeUp 0.5s ease both;
  }
  .ep-card__title {
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.09em; text-transform: uppercase; color: #64748b;
    margin-bottom: 22px; display: flex; align-items: center; gap: 8px;
  }
  .ep-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .ep-grid-1 { display: grid; grid-template-columns: 1fr; gap: 18px; }

  /* ── FIELD ── */
  .ep-field {}
  .ep-label {
    display: block; font-size: 12px; font-weight: 600; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;
  }
  .ep-input, .ep-select {
    width: 100%; padding: 12px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; color: #f8fafc;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: all 0.25s;
    -webkit-appearance: none;
  }
  .ep-input::placeholder { color: #475569; }
  .ep-input:focus, .ep-select:focus {
    border-color: rgba(99,102,241,0.5);
    background: rgba(99,102,241,0.05);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .ep-input:hover:not(:focus), .ep-select:hover:not(:focus) {
    border-color: rgba(255,255,255,0.14);
  }
  .ep-select option { background: #111827; color: #f8fafc; }
  .ep-input--date { color-scheme: dark; }

  /* ── ACTIONS ── */
  .ep-actions {
    display: flex; justify-content: flex-end; gap: 12px;
    animation: epFadeUp 0.5s 0.25s ease both;
  }
  .ep-btn-cancel {
    padding: 12px 24px; border-radius: 100px;
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8; font-family: 'DM Sans', sans-serif;
    font-size: 15px; cursor: pointer; transition: all 0.2s;
  }
  .ep-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #f8fafc; }
  .ep-btn-save {
    padding: 12px 28px; border-radius: 100px;
    background: linear-gradient(135deg,#3b82f6,#6366f1);
    color: #fff; border: none; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.3s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .ep-btn-save:hover:not(:disabled) {
    transform: translateY(-2px); box-shadow: 0 10px 28px rgba(59,130,246,0.35);
    background: linear-gradient(135deg,#60a5fa,#818cf8);
  }
  .ep-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

  /* ── TOAST ── */
  .ep-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 10px;
    padding: 13px 22px; border-radius: 100px;
    font-size: 14px; font-weight: 500; z-index: 9999;
    animation: epToastIn 0.3s ease;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  }
  .ep-toast--success { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; }
  .ep-toast--error   { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171; }

  @keyframes epFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes epToastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  @media (max-width: 640px) {
    .ep-grid-2 { grid-template-columns: 1fr; }
    .ep-body { padding: 0 16px; }
    .ep-actions { flex-direction: column-reverse; }
    .ep-btn-cancel, .ep-btn-save { width: 100%; justify-content: center; }
  }
`;

const GENDERS   = ["Male", "Female", "Non-binary", "Prefer not to say"];
const COUNTRIES = ["India", "USA", "UK", "UAE", "Australia", "Canada", "Other"];
const LANGUAGES = ["Malayalam", "Hindi", "English", "Tamil", "Telugu", "Kannada", "Other"];
const QUALS     = ["+2", "Bachelor's", "Master's", "PhD", "Diploma", "Other"];

export default function EditProfile() {
  const { user, updateUser } = useAuth();   // updateUser should call your PATCH /api/profile
  const navigate = useNavigate();
  const fileRef  = useRef<HTMLInputElement>(null);

  const photoSrc = user?.photoUrl
    ? `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/${user.photoUrl.replace(/\\/g, "/")}`
    : null;

const [form, setForm] = useState({
  fullName: "",
  nickname: "",
  email: "",
  gender: "",
  dob: "",
  country: "",
  language: "",
  qualification: "",
});
useEffect(() => {
  if (!user) return;

  setForm({
    fullName: user.fullName || "",
    nickname: user.nickname || "",
    email: user.email || "",
    gender: user.gender || "",
    dob: user.dob ? user.dob.slice(0, 10) : "",
    country: user.country || "",
    language: user.language || "",
    qualification: user.qualification || "",
  });
}, [user]);

  const [preview,  setPreview]  = useState<string | null>(null);
  const [photoFile,setPhotoFile]= useState<File | null>(null);
  const [loading,  setLoading]  = useState(false);


  const set = (k: string) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

 

const handleSubmit = async (
e: FormEvent
)=>{

e.preventDefault()

if(loading)
return

setLoading(true)

try{

const fd=
new FormData()

Object.entries(form)
.forEach(([key,value])=>{

fd.append(
key,
String(value ?? "")
)

})

if(photoFile){

fd.append(
"photo",
photoFile

)

}

/*
EMAIL CHANGED
→ SEND OTP ONLY
*/

if(

form.email.trim()

!==

user?.email?.trim()

){

await profileService
.requestEmailOtp(
form.email
)

toast.success(
"Verification code sent ✨"
)

/*
WAIT FOR TOAST
THEN OPEN VERIFY PAGE
*/

setTimeout(()=>{

navigate(

"/verify-email",

{

state:{

email:
form.email

}

}

)

},1500)

return

}


/*
UPDATE PROFILE
*/

const updated=

await profileService
.updateProfile(
fd
)

updateUser(
updated
)

toast.success(

"Profile updated successfully ✨",

{

position:
"bottom-center",

theme:
"dark"

}

)

setTimeout(()=>{

navigate(
"/profile"
)

},1500)

}

catch(error:any){

console.log(
error
)

toast.error(

error
?.response
?.data
?.message

||

"Update failed"

)

}

finally{

setLoading(
false
)

}

}

  const initial = form.fullName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <>
      <style>{CSS}</style>
      <div className="ep-root">
        <div className="ep-body">

          {/* ── PAGE HEADER ── */}
          <div className="ep-page-head">
            <button className="ep-btn-back" onClick={() => navigate("/profile")}>
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <div className="ep-page-title">Edit Profile</div>
              <div className="ep-page-sub">Update your personal information</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── AVATAR ── */}
            <div className="ep-avatar-section">
              <div className="ep-avatar-wrap" onClick={() => fileRef.current?.click()}>
                {preview || photoSrc
                  ? <img src={preview ?? photoSrc!} alt="avatar" className="ep-avatar" />
                  : (
                    <div className="ep-avatar-fallback">
                      <span style={{
                        background: "linear-gradient(135deg,#60a5fa,#818cf8)",
                        WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                      }}>{initial}</span>
                    </div>
                  )
                }
                <div className="ep-avatar-overlay"><Camera size={22} color="#fff" /></div>
              </div>
              <div className="ep-avatar-info">
                <div className="ep-avatar-title">Profile Photo</div>
                <div className="ep-avatar-hint">JPG or PNG · Max 5 MB</div>
                <button type="button" className="ep-avatar-btn" onClick={() => fileRef.current?.click()}>
                  <Camera size={13} /> Change Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              </div>
            </div>

            {/* ── BASIC INFO ── */}
            <div className="ep-card" style={{ animationDelay: "0.1s" }}>
              <div className="ep-card__title"><User size={13} /> Basic Information</div>
              <div className="ep-grid-2">
                <div className="ep-field">
                  <label className="ep-label">Full Name</label>
                  <input className="ep-input" value={form.fullName} onChange={set("fullName")} placeholder="Your full name" required />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Nickname</label>
                  <input className="ep-input" value={form.nickname} onChange={set("nickname")} placeholder="e.g. aachi" />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Email</label>
                  <input className="ep-input" type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" required />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Date of Birth</label>
                  <input className="ep-input ep-input--date" type="date" value={form.dob} onChange={set("dob")} />
                </div>
                <div className="ep-field">
                  <label className="ep-label">Gender</label>
                  <select className="ep-select" value={form.gender} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="ep-field">
                  <label className="ep-label">Qualification</label>
                  <select className="ep-select" value={form.qualification} onChange={set("qualification")}>
                    <option value="">Select qualification</option>
                    {QUALS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── LOCATION ── */}
            <div className="ep-card" style={{ animationDelay: "0.15s" }}>
              <div className="ep-card__title"><Globe size={13} /> Location & Language</div>
              <div className="ep-grid-2">
                <div className="ep-field">
                  <label className="ep-label">Country</label>
                  <select className="ep-select" value={form.country} onChange={set("country")}>
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="ep-field">
                  <label className="ep-label">Language</label>
                  <select className="ep-select" value={form.language} onChange={set("language")}>
                    <option value="">Select language</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* ── ACTIONS ── */}
            <div className="ep-actions">
              <button type="button" className="ep-btn-cancel" onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button type="submit" className="ep-btn-save" disabled={loading}>
                {loading
                  ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                  : <><Save size={15} /> Save Changes</>
                }
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── TOAST ── */}
    
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <ToastContainer

position="bottom-center"

theme="dark"

autoClose={2500}

/>
    </>
  );
}

