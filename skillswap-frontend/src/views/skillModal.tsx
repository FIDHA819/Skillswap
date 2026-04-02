
import React, { useState, useEffect } from "react";

type SkillModalProps = {
  mode: "learn" | "teach";
  onClose: () => void;
  onSave: (skill: any) => void;
  disablePaid?: boolean; 
};

const categories = ["Programming", "Design", "Marketing", "Music", "Language", "Other"];

const SkillModal: React.FC<SkillModalProps> = ({ mode, onClose, onSave, disablePaid = false }) => {
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [qualification, setQualification] = useState("");
  const [modeType, setModeType] = useState<"free" | "paid">("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (disablePaid && modeType === "paid") {
      setModeType("free");
    }
  }, [disablePaid, modeType]);

  const handleSave = () => {
    if (!skillName || !category || !introduction) {
      alert("Please fill all required fields.");
      return;
    }
    if (mode === "teach" && !qualification) {
      alert("Please provide your highest qualification.");
      return;
    }

    setLoading(true);

    const skillData: any = { skillName, category, introduction };
    if (mode === "teach") {
      skillData.qualification = qualification;
      skillData.mode = modeType;
    }

    setTimeout(() => {
      onSave(skillData);
      setLoading(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {mode === "learn" ? "Add Skill to Learn" : "Add Skill to Teach"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Skill Name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-300 outline-none focus:border-blue-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-300 outline-none focus:border-blue-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Introduction / Description"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="h-20 px-3 py-2 rounded-xl border border-gray-300 outline-none focus:border-blue-400 resize-none"
          />

          {mode === "teach" && (
            <>
              <input
                type="text"
                placeholder="Highest Qualification"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-300 outline-none focus:border-blue-400"
              />

              {/* Free / Paid Toggle */}
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModeType("free")}
                  className={`flex-1 h-10 rounded-xl ${
                    modeType === "free" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Free
                </button>

                <button
                  type="button"
                  onClick={() => !disablePaid && setModeType("paid")}
                  className={`flex-1 h-10 rounded-xl ${
                    modeType === "paid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                  } ${disablePaid ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={disablePaid}
                >
                  Paid
                </button>
              </div>

              {disablePaid && (
                <p className="text-yellow-500 mt-1 text-sm">
                  You already have a paid skill with KYC pending
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
