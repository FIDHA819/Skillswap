import { useState } from "react";
import "../styles/dashboard.css";
import LearnerHeader from "../hooks/LearnerDashboard/LearnerHeader";
import HeroSection from "../hooks/LearnerDashboard/HeroSection";
import CategoriesGrid from "../hooks/LearnerDashboard/CategoriesGrid";
import RecommendedVideos from "../hooks/LearnerDashboard/RecommendedVideos";
import RecommendedTeachers from "../hooks/LearnerDashboard/RecommendedTeachers";
import LearnerSkillPicker from "../hooks/LearnerDashboard/LearnerSkillPicker";
import UpcomingSessions from "../hooks/LearnerDashboard/UpcomingSession";
import DiscoverGain from "../hooks/LearnerDashboard/DiscoverGain";
import Footer from "../hooks/Footer";

// Skill picker section CSS
const PICKER_CSS = `
  .lp-skills-section {
    max-width: 1280px; margin: 0 auto; padding: 0 40px 0;
  }
  .lp-skills-card {
    background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06));
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 20px; padding: 24px 28px; margin-bottom: 0;
  }
  .lp-skills-top {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
  }
  .lp-skills-label {
    font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    color: #a5b4fc; display: flex; align-items: center; gap: 7px;
  }
  .lp-skills-hint { font-size: 12px; color: #475569; font-family: 'DM Sans', sans-serif; }
  @media (max-width: 768px) { .lp-skills-section { padding: 0 16px; } .lp-skills-card { padding: 18px; } }
`;

export default function DiscoveryHome() {
  const [learnerSkills, setLearnerSkills] = useState<string[]>([]);

  return (
    <>
      <style>{PICKER_CSS}</style>
      <div className="dashboard">
        <LearnerHeader />

        <main className="dashboard-main">
          <HeroSection />

          {/* ── SKILL PICKER STRIP ── */}
          <div style={{ paddingTop: 32 }}>
            <div className="lp-skills-section">
              <div className="lp-skills-card">
                <div className="lp-skills-top">
                  <div className="lp-skills-label">
                    🎯 Skills I Want to Learn
                  </div>
                  <div className="lp-skills-hint">
                    We'll find teachers &amp; videos based on these
                  </div>
                </div>
                <LearnerSkillPicker onSkillsChange={setLearnerSkills} />
              </div>
            </div>
          </div>

          {/* Skill-based recommendations — only shown when learner has skills */}
          {learnerSkills.length > 0 && (
            <>
              <RecommendedTeachers learnerSkills={learnerSkills} />
              <RecommendedVideos   learnerSkills={learnerSkills} />
            </>
          )}

          <CategoriesGrid />
          <UpcomingSessions />
          <DiscoverGain />
          <Footer />
        </main>
      </div>
    </>
  );
}