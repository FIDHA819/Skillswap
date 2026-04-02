import React, { useState, useEffect } from "react";
import Header from "../presentation/components/hooks/Header";
import SkillModal from "./skillModal";
import { useNavigate } from "react-router-dom";

type Skill = { skillName: string; mode: "free" | "paid" };

const HomePage: React.FC = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  const [skillsToTeach, setSkillsToTeach] = useState<Skill[]>([]);
  const [skillsToLearn, setSkillsToLearn] = useState<Skill[]>([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [kycStatus, setKycStatus] = useState<"pending" | "approved" | "none">("none");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTeach = localStorage.getItem("skillsToTeach");
    if (savedTeach) setSkillsToTeach(JSON.parse(savedTeach));

    const savedLearn = localStorage.getItem("skillsToLearn");
    if (savedLearn) setSkillsToLearn(JSON.parse(savedLearn));

    const savedKyc = localStorage.getItem("kycStatus");
    if (savedKyc) setKycStatus(savedKyc as any);
  }, []);

  const saveSkills = (skills: Skill[], type: "teach" | "learn", kyc?: string) => {
    if (type === "teach") {
      setSkillsToTeach(skills);
      localStorage.setItem("skillsToTeach", JSON.stringify(skills));
      if (kyc) {
        setKycStatus(kyc);
        localStorage.setItem("kycStatus", kyc);
      }
    } else {
      setSkillsToLearn(skills);
      localStorage.setItem("skillsToLearn", JSON.stringify(skills));
    }
  };

  const hasPendingPaidSkill = skillsToTeach.some(
    (s) => s.mode === "paid" && kycStatus === "pending"
  );

  const handleAddSkill = (skill: Skill, type: "teach" | "learn") => {
    if (type === "teach") {
      if (skill.mode === "paid" && hasPendingPaidSkill) {
        alert("You already have a paid skill with KYC pending! You can only add Free skills for now.");
        return;
      }
      const updated = [...skillsToTeach, skill];
      saveSkills(updated, "teach");

      if (skill.mode === "paid") {
        setKycStatus("pending");
        localStorage.setItem("kycStatus", "pending");
        navigate("/kyc");
      }
    } else {
      const updated = [...skillsToLearn, skill];
      saveSkills(updated, "learn");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="flex flex-col items-center px-4 pt-28">
        <h1 className="text-4xl font-bold mb-6">Welcome to SkillSwap</h1>

        {/* Toggle Student / Teacher */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-xl ${!isTeacher ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsTeacher(false)}
          >
            Student
          </button>
          <button
            className={`px-6 py-2 rounded-xl ${isTeacher ? "bg-green-600 text-white" : "bg-gray-200"}`}
            onClick={() => setIsTeacher(true)}
          >
            Teacher
          </button>
        </div>

        {/* STUDENT SECTION */}
        {!isTeacher && (
          <div className="w-full max-w-md bg-white rounded-xl p-6 flex flex-col gap-4 shadow">
            <h2 className="text-xl font-semibold">Skills You Want to Learn</h2>

            {skillsToLearn.length === 0 ? (
              <p>Add your first skill to learn by clicking "Add Skill"</p>
            ) : (
              <ul className="list-disc pl-5">
                {skillsToLearn.map((s, i) => (
                  <li key={i}>
                    {s.skillName} ({s.mode})
                  </li>
                ))}
              </ul>
            )}

            <button
              className="mt-4 w-full py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowSkillModal(true)}
            >
              Add Skill
            </button>
          </div>
        )}

        {/* TEACHER SECTION */}
        {isTeacher && (
          <div className="w-full max-w-md bg-white rounded-xl p-6 flex flex-col gap-4 shadow">
            <h2 className="text-xl font-semibold">Your Skills to Teach</h2>

            {skillsToTeach.length === 0 ? (
              <p>Add your first skill to teach by clicking "Add Skill"</p>
            ) : (
              <ul className="list-disc pl-5">
                {skillsToTeach.map((s, i) => (
                  <li key={i}>
                    {s.skillName} ({s.mode})
                    {s.mode === "paid" && kycStatus === "pending" && (
                      <span className="ml-2 text-yellow-500 font-semibold">
                        Verification Pending
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <button
              className="mt-4 w-full py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowSkillModal(true)}
            >
              Add Skill
            </button>
          </div>
        )}

        {showSkillModal && (
          <SkillModal
            mode={isTeacher ? "teach" : "learn"}
            onClose={() => setShowSkillModal(false)}
            onSave={(skill) => {
              handleAddSkill(skill, isTeacher ? "teach" : "learn");
              setShowSkillModal(false);
            }}
            disablePaid={isTeacher ? hasPendingPaidSkill : false}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
