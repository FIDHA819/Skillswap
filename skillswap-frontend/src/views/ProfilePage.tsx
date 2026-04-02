import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import SkillModal from "./skillModal";
import Header from "../presentation/components/hooks/Header";
import Footer from "../presentation/components/hooks/Footer";
import { CheckCircle, AlertTriangle } from "lucide-react";

type Message = { type: "error" | "success"; text: string };
type Skill = { skillName: string; mode?: "free" | "paid"; [key: string]: any };

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // State variables
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [birthday, setBirthday] = useState("");
  const [photo, setPhoto] = useState<File | string | null>(null);

  const [skillsToLearn, setSkillsToLearn] = useState<Skill[]>([]);
  const [skillsToTeach, setSkillsToTeach] = useState<Skill[]>([]);
  const [bankAdded, setBankAdded] = useState(false);
  const [kycStatus, setKycStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const [showLearnModal, setShowLearnModal] = useState(false);
  const [showTeachModal, setShowTeachModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signup");
      return;
    }

    const savedProfile = localStorage.getItem("tempProfile");
    if (savedProfile) {
      const data = JSON.parse(savedProfile);
      setFullName(data.fullName);
      setNickname(data.nickname);
      setGender(data.gender);
      setCountry(data.country);
      setLanguage(data.language);
      setBirthday(data.birthday);
      setPhoto(data.photo);
      setSkillsToLearn(data.skillsToLearn || []);
      setSkillsToTeach(data.skillsToTeach || []);
      localStorage.removeItem("tempProfile");
      setLoading(false);
    } else {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const res = await userService.getProfile(token);
          setFullName(res.fullName || "");
          setNickname(res.nickname || "");
          setGender(res.gender || "");
          setCountry(res.country || "");
          setLanguage(res.language || "");
          setBirthday(res.birthday || "");
          setSkillsToLearn(res.skillsToLearn || []);
          setSkillsToTeach(res.skillsToTeach || []);
          setBankAdded(!!res.bankDetails);
          setKycStatus(res.kycStatus || "pending");
          if (res.photoUrl) setPhoto(res.photoUrl);
          else if (res.photo) setPhoto(res.photo);
        } catch (err) {
          setMessage({ type: "error", text: "Failed to fetch profile." });
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [navigate]);

  const today = new Date().toISOString().split("T")[0];
// inside ProfilePage.tsx — replace your handleSaveProfile with this
const handleSaveProfile = async () => {
  if (!fullName || !nickname || !gender || !country || !language || !birthday) {
    setMessage({ type: "error", text: "Please fill all personal details." });
    return;
  }

  if (birthday >= today) {
    setMessage({ type: "error", text: "Birthday cannot be today or in the future." });
    return;
  }

  setLoading(true);
  setMessage(null);

  try {
    const body = { fullName, nickname, gender, country, language, birthday, skillsToLearn, skillsToTeach };

    let payload: FormData | Record<string, any> = body;
    if (photo && typeof photo !== "string") {
      const formData = new FormData();
      formData.append("photo", photo); // must be File
      Object.entries(body).forEach(([k, v]) => {
        if (v === undefined || v === null) formData.append(k, "");
        else if (typeof v === "object") formData.append(k, JSON.stringify(v));
        else formData.append(k, String(v));
      });
      payload = formData;

      // Debug: log FormData entries (can't console.log formData directly)
      for (const pair of (formData as any).entries()) {
        console.log("FORMDATA ENTRY:", pair[0], pair[1]);
        // If pair[1] is a File, log its size/type
        if (pair[1] instanceof File) {
          console.log(" -> file name, size, type:", pair[1].name, pair[1].size, pair[1].type);
        }
      }
      console.log("IS FormData?", payload instanceof FormData);
    } else {
      console.log("No file to upload, sending JSON payload");
    }

    // Single call only — use payload (FormData or JSON)
    const resp = await userService.updateProfile(payload);
    console.log("UPDATE RESP:", resp);

    if (resp?.user?.profilePhoto) setPhoto(resp.user.profilePhoto);
    setMessage({ type: "success", text: "Profile updated successfully!" });
  } catch (err: any) {
    console.error("Profile save error:", err);
    setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update profile." });
  } finally {
    setLoading(false);
  }
};


  const handlePaidSkill = () => {
    const tempProfile = {
      fullName,
      nickname,
      gender,
      country,
      language,
      birthday,
      photo,
      skillsToLearn,
      skillsToTeach,
    };
    localStorage.setItem("tempProfile", JSON.stringify(tempProfile));
    navigate("/kyc");
  };

  const MessageDisplay: React.FC<{ message: Message | null }> = ({ message }) => {
    if (!message) return null;
    const isError = message.type === "error";
    const Icon = isError ? AlertTriangle : CheckCircle;

    return (
      <div
        className={`w-full p-3 rounded-xl flex items-center gap-2 text-[15px] font-medium ${
          isError ? "bg-red-50/50 text-red-700 border border-red-200" : "bg-green-50/50 text-green-700 border border-green-200"
        } shadow-sm mt-2 mb-2`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{message.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="relative w-full min-h-screen flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url('/assets/bg.jpeg')` }}
      >
        <Header />
        <main className="flex flex-col items-center px-4 pt-28 pb-16">
          <div className="w-full max-w-md text-center text-white text-lg">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/bg.jpeg')` }}
    >
      <Header />
      <main className="flex flex-col items-center px-4 pt-28 pb-16">
        <section className="w-full max-w-md rounded-3xl px-8 py-10 flex flex-col items-center bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white text-center mb-6 tracking-tight">
            Complete Your Profile
          </h1>

          {/* Profile Photo */}
          <div className="flex flex-col items-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
              className="text-sm text-white"
            />
            {photo && (
              <img
                src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white/40 shadow-lg mt-3"
              />
            )}
          </div>

          {/* Inputs */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-4"
          />

          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-4"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/20 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-4"
          >
            <option value="" className="text-black">
              Select Gender
            </option>
            <option value="Female" className="text-black">Female</option>
            <option value="Male" className="text-black">Male</option>
            <option value="Other" className="text-black">Other</option>
          </select>

          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-4"
          />

          <input
            type="text"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-4"
          />

          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={today}
            className="w-full h-12 px-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none border border-white/30 focus:border-blue-400 shadow-sm backdrop-blur-sm mb-6"
          />

          {/* Skill buttons */}
          <div className="flex gap-4 w-full mb-4">
            <button
              onClick={() => setShowLearnModal(true)}
              className="flex-1 h-12 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition font-semibold shadow"
            >
              Add Skill to Learn
            </button>

            {skillsToTeach.length === 0 ? (
              <div className="flex-1 h-12 flex items-center justify-center bg-gray-500 rounded-xl text-white text-center text-sm select-none">
                You can add your skill to teach after login
              </div>
            ) : (
              <button
                onClick={() => setShowTeachModal(true)}
                className="flex-1 h-12 bg-green-600 rounded-xl text-white hover:bg-green-700 transition font-semibold shadow"
                disabled={skillsToTeach.some(s => s.mode === "paid") && kycStatus === "pending"}
              >
                {skillsToTeach.some(s => s.mode === "paid") && kycStatus === "pending"
                  ? "Verification Pending"
                  : "Add Skill to Teach"}
              </button>
            )}
          </div>

          {/* Display skills */}
          <div className="w-full text-white text-sm space-y-1 mb-6">
            {skillsToLearn.length > 0 && (
              <p>
                <strong>Skills to Learn:</strong> {skillsToLearn.map(s => s.skillName).join(", ")}
              </p>
            )}
            {skillsToTeach.length > 0 && (
              <p>
                <strong>Skills to Teach:</strong> {skillsToTeach.map(s => s.skillName).join(", ")}
              </p>
            )}
          </div>

          {bankAdded && (
            <p className="text-green-300 w-full mb-4 font-medium">✅ Bank Account Added</p>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save & Complete Profile"}
          </button>

          <MessageDisplay message={message} />
        </section>
      </main>

      {/* Skill modals */}
      {showLearnModal && (
        <SkillModal
          mode="learn"
          onClose={() => setShowLearnModal(false)}
          onSave={skill => setSkillsToLearn([...skillsToLearn, skill])}
        />
      )}
      {showTeachModal && (
        <SkillModal
          mode="teach"
          onClose={() => setShowTeachModal(false)}
          onSave={skill => {
            setSkillsToTeach([...skillsToTeach, skill]);
            if (skill.mode === "paid") handlePaidSkill();
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProfilePage;
