import { useState } from "react";
import { Play, Sparkles } from "lucide-react";

const CSS = `
  .ss-vids { padding: 100px 0; }
  .ss-vids__container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  .ss-vids__head { text-align: center; margin-bottom: 56px; }
  .ss-vids__chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 100px; font-size: 13px; font-weight: 500;
    background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25);
    color: #a78bfa; margin-bottom: 16px; font-family: 'DM Sans', sans-serif;
  }
  .ss-vids__h2 {
    font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 700;
    letter-spacing: -0.8px; color: #f8fafc;
  }
  .ss-vids__h2-grad {
    background: linear-gradient(135deg,#60a5fa 0%,#818cf8 50%,#c084fc 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .ss-vids__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  .ss-vids__card {
    border-radius: 20px; overflow: hidden;
    background: #111827;
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
    animation: ssVidUp 0.5s ease both;
  }
  .ss-vids__card:hover {
    border-color: rgba(99,102,241,0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4);
  }
  .ss-vids__thumb {
    height: 160px; position: relative; overflow: hidden;
  }
  .ss-vids__play-wrap {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .ss-vids__play-btn {
    width: 52px; height: 52px; border-radius: 50%;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.3s;
  }
  .ss-vids__card:hover .ss-vids__play-btn { transform: scale(1.12); }
  .ss-vids__duration {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
    padding: 3px 10px; border-radius: 100px;
    font-size: 12px; color: #fff; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-vids__info { padding: 16px 18px; }
  .ss-vids__title {
    font-size: 15px; font-weight: 600; color: #f8fafc;
    margin-bottom: 6px; line-height: 1.4;
    font-family: 'DM Sans', sans-serif;
  }
  .ss-vids__meta {
    display: flex; justify-content: space-between; align-items: center;
  }
  .ss-vids__teacher { font-size: 13px; color: #64748b; font-family: 'DM Sans', sans-serif; }
  .ss-vids__views   { font-size: 12px; color: #64748b; font-family: 'DM Sans', sans-serif; }

  @keyframes ssVidUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .ss-vids { padding: 60px 0; }
    .ss-vids__container { padding: 0 20px; }
    .ss-vids__h2 { font-size: 28px; }
  }
`;

const VIDEOS = [
  { title: "React Suspense Deep Dive",       teacher: "Asif Rahman",   duration: "18:42", views: "12k",  hue: 220 },
  { title: "Design Systems in Figma",        teacher: "Priya Nair",    duration: "24:10", views: "8.4k", hue: 245 },
  { title: "Advanced Excel Formulas",        teacher: "Sara Kurian",   duration: "31:05", views: "15k",  hue: 260 },
  { title: "Brand Identity 101",             teacher: "Dev Pillai",    duration: "22:18", views: "6.7k", hue: 280 },
  { title: "Python for Data Science",        teacher: "Amir Syed",     duration: "45:00", views: "20k",  hue: 200 },
  { title: "Marketing Funnels Explained",    teacher: "Nadia Thomas",  duration: "19:33", views: "9.1k", hue: 300 },
];

export default function RecommendedVideos() {
  return (
    <>
      <style>{CSS}</style>
      <section className="ss-vids">
        <div className="ss-vids__container">
          <div className="ss-vids__head">
            <div className="ss-vids__chip"><Play size={13} /> Recommended Videos</div>
            <h2 className="ss-vids__h2">
              Curated just for <span className="ss-vids__h2-grad">you</span>
            </h2>
          </div>

          <div className="ss-vids__grid">
            {VIDEOS.map((v, i) => (
              <div
                key={i}
                className="ss-vids__card"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="ss-vids__thumb"
                  style={{
                    background: `linear-gradient(135deg,
                      hsl(${v.hue},60%,10%) 0%,
                      hsl(${v.hue + 20},50%,6%) 100%)`,
                  }}
                >
                  <div className="ss-vids__play-wrap">
                    <div className="ss-vids__play-btn">
                      <Play size={20} color="#fff" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                  <div className="ss-vids__duration">{v.duration}</div>
                </div>

                <div className="ss-vids__info">
                  <div className="ss-vids__title">{v.title}</div>
                  <div className="ss-vids__meta">
                    <span className="ss-vids__teacher">{v.teacher}</span>
                    <span className="ss-vids__views">{v.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}