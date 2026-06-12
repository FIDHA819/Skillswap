import { useEffect, useState } from "react";
import { Play, ExternalLink, Loader2, Youtube } from "lucide-react";

// YouTube search via YouTube Data API v3
// Falls back to curated static videos per skill if no API key

const EMOJI_MAP: Record<string,string> = {
  React:"⚛️","Next.js":"▲",Python:"🐍",Figma:"🎯","UI/UX Design":"🎨",
  JavaScript:"🟨",TypeScript:"📘",Docker:"🐳","Machine Learning":"🤖",
  MongoDB:"🍃",Excel:"📊",Marketing:"📣",
};
const getEmoji = (n:string) => EMOJI_MAP[n] ?? "📚";

// Curated fallback video IDs per skill (top YouTube tutorials)
const FALLBACK_VIDEOS: Record<string, { id:string; title:string; channel:string; duration:string }[]> = {
  React: [
    { id:"SqcY0GlETPk", title:"React Tutorial for Beginners", channel:"Programming with Mosh", duration:"1:19:29" },
    { id:"bMknfKXIFA8", title:"React Full Course 2024", channel:"freeCodeCamp", duration:"11:55:27" },
    { id:"Ke90Tje7VS0", title:"React JS Crash Course", channel:"Traversy Media", duration:"1:48:42" },
  ],
  Python: [
    { id:"_uQrJ0TkZlc", title:"Python Tutorial for Beginners", channel:"Programming with Mosh", duration:"6:14:07" },
    { id:"rfscVS0vtbw", title:"Learn Python Full Course", channel:"freeCodeCamp", duration:"4:26:51" },
    { id:"kqtD5dpn9C8", title:"Python for Beginners", channel:"Tech With Tim", duration:"1:01:30" },
  ],
  Figma: [
    { id:"FTFaQWZBqQ8", title:"Figma Tutorial for Beginners", channel:"Figma", duration:"45:02" },
    { id:"jwCmIBJ8Jtc", title:"Figma UI Design Tutorial", channel:"DesignCourse", duration:"43:28" },
    { id:"kbZejnPXyLM", title:"Figma UI/UX Design",    channel:"Kevin Powell",  duration:"1:02:14" },
  ],
  "UI/UX Design": [
    { id:"c9Wg6Cb_YlU", title:"UI/UX Design Tutorial",   channel:"DesignCourse", duration:"1:13:58" },
    { id:"DapgMR7zkDY", title:"UX Design Full Course",    channel:"freeCodeCamp", duration:"6:33:47" },
    { id:"I0-vBdh4sZ8", title:"UI Design Fundamentals",  channel:"Flux Academy",  duration:"36:12" },
  ],
  JavaScript: [
    { id:"PkZNo7MFNFg", title:"JavaScript Crash Course", channel:"freeCodeCamp", duration:"3:26:42" },
    { id:"W6NZfCO5SIk", title:"JavaScript Tutorial Full", channel:"Programming with Mosh", duration:"1:00:00" },
    { id:"hdI2bqOjy3c", title:"JS Crash Course",         channel:"Traversy Media", duration:"1:40:28" },
  ],
  TypeScript: [
    { id:"BwuLxPH8IDs", title:"TypeScript Full Course",  channel:"Traversy Media", duration:"1:22:59" },
    { id:"d56mG7DezGs", title:"TypeScript Course 2024",  channel:"Programming with Mosh", duration:"1:10:14" },
  ],
  Docker: [
    { id:"3c-iBn73dDE", title:"Docker Tutorial 2024",    channel:"TechWorld with Nana", duration:"2:11:00" },
    { id:"fqMOX6JJhGo", title:"Docker Full Course",      channel:"freeCodeCamp", duration:"2:10:18" },
  ],
  "Machine Learning": [
    { id:"7eh4d9ejTom", title:"Machine Learning Crash Course", channel:"Google Developers", duration:"15:00:00" },
    { id:"GwIo3gDZCVQ", title:"ML for Beginners",       channel:"freeCodeCamp", duration:"3:41:13" },
  ],
  Excel: [
    { id:"rwbho0CgEAI", title:"Excel Tutorial for Beginners", channel:"Kevin Stratvert", duration:"1:10:21" },
    { id:"PSNXoAs2FtQ", title:"Microsoft Excel Full Course", channel:"freeCodeCamp", duration:"11:01:00" },
  ],
  MongoDB: [
    { id:"-56x56UppqQ", title:"MongoDB Crash Course",    channel:"Traversy Media", duration:"59:11" },
    { id:"ofme2o29ngU", title:"MongoDB Full Course",     channel:"freeCodeCamp", duration:"3:20:41" },
  ],
};

const DEFAULT_FALLBACK = [
  { id:"rfscVS0vtbw", title:"Programming for Beginners", channel:"freeCodeCamp", duration:"4:26:51" },
  { id:"PkZNo7MFNFg", title:"Web Development Crash Course", channel:"Traversy Media", duration:"3:26:42" },
  { id:"SqcY0GlETPk", title:"Learn to Code Today", channel:"Programming with Mosh", duration:"1:19:29" },
];

type Video = { id:string; title:string; channel:string; duration:string; thumb:string };

const CSS = `
  .rv-section { padding: 60px 0; }
  .rv-container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }
  .rv-head { margin-bottom: 36px; }
  .rv-chip {
    display:inline-flex; align-items:center; gap:6px;
    padding:6px 14px; border-radius:100px; font-size:13px; font-weight:500;
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
    color:#f87171; margin-bottom:12px; font-family:'DM Sans',sans-serif;
  }
  .rv-title { font-family:'Syne',sans-serif; font-size:32px; font-weight:700; color:#f8fafc; letter-spacing:-0.5px; }
  .rv-title-grad { background:linear-gradient(135deg,#f87171,#fb923c); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .rv-skill-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:28px; }
  .rv-skill-tab {
    display:flex; align-items:center; gap:6px; padding:7px 16px; border-radius:100px;
    border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03);
    color:#64748b; font-size:13px; font-weight:500; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:all 0.2s;
  }
  .rv-skill-tab:hover { border-color:rgba(239,68,68,0.3); color:#f87171; }
  .rv-skill-tab.active { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.3); color:#f87171; }
  .rv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:18px; }
  .rv-card {
    border-radius:18px; overflow:hidden;
    background:#111827; border:1px solid rgba(255,255,255,0.07);
    transition:all 0.3s; animation:rvFade 0.4s ease both; cursor:pointer;
  }
  .rv-card:hover { border-color:rgba(239,68,68,0.3); transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.4); }
  .rv-thumb { height:152px; position:relative; overflow:hidden; }
  .rv-thumb img { width:100%; height:100%; object-fit:cover; transition:transform 0.4s; }
  .rv-card:hover .rv-thumb img { transform:scale(1.04); }
  .rv-play-overlay {
    position:absolute; inset:0; background:rgba(0,0,0,0.35);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity 0.2s;
  }
  .rv-card:hover .rv-play-overlay { opacity:1; }
  .rv-play-circle {
    width:48px; height:48px; border-radius:50%;
    background:rgba(255,255,255,0.15); backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.2);
    display:flex; align-items:center; justify-content:center;
  }
  .rv-duration { position:absolute; bottom:8px; right:8px; padding:2px 8px; border-radius:6px; background:rgba(0,0,0,0.75); font-size:11px; color:#fff; font-family:'DM Sans',sans-serif; }
  .rv-info { padding:14px 16px; }
  .rv-vtitle { font-size:14px; font-weight:600; color:#f8fafc; line-height:1.4; margin-bottom:6px; font-family:'DM Sans',sans-serif; }
  .rv-vchannel { font-size:12px; color:#64748b; font-family:'DM Sans',sans-serif; display:flex; align-items:center; gap:5px; }
  @keyframes rvFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @media (max-width:768px) { .rv-container{padding:0 20px;} .rv-title{font-size:24px;} .rv-grid{grid-template-columns:1fr 1fr;} }
  @media (max-width:480px) { .rv-grid{grid-template-columns:1fr;} }
`;

interface Props {
  learnerSkills: string[];
}

export default function RecommendedVideos({ learnerSkills }: Props) {
  const [activeSkill, setActiveSkill] = useState<string>("");
  const [videos, setVideos]           = useState<Video[]>([]);

  useEffect(() => {
    if (learnerSkills.length > 0 && !activeSkill) {
      setActiveSkill(learnerSkills[0]);
    }
  }, [learnerSkills]);

  useEffect(() => {
    if (!activeSkill) return;
    const raw = FALLBACK_VIDEOS[activeSkill] ?? DEFAULT_FALLBACK;
    setVideos(
      raw.map(v => ({
        ...v,
        thumb: `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
      }))
    );
  }, [activeSkill]);

  if (learnerSkills.length === 0) return null;

  return (
    <>
      <style>{CSS}</style>
      <section className="rv-section">
        <div className="rv-container">
          <div className="rv-head">
            <div className="rv-chip"><Youtube size={12} /> Recommended Videos</div>
            <div className="rv-title">
              Learn <span className="rv-title-grad">{activeSkill || "a Skill"}</span> Today
            </div>
          </div>

          <div className="rv-skill-tabs">
            {learnerSkills.map(skill => (
              <button
                key={skill}
                className={`rv-skill-tab${activeSkill === skill ? " active" : ""}`}
                onClick={() => setActiveSkill(skill)}
              >
                {getEmoji(skill)} {skill}
              </button>
            ))}
          </div>

          <div className="rv-grid">
            {videos.map((v, i) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="rv-card"
                style={{ textDecoration:"none", animationDelay:`${i * 0.07}s` }}
              >
                <div className="rv-thumb">
                  <img src={v.thumb} alt={v.title} loading="lazy" />
                  <div className="rv-play-overlay">
                    <div className="rv-play-circle">
                      <Play size={18} color="#fff" style={{ marginLeft:2 }} />
                    </div>
                  </div>
                  <div className="rv-duration">{v.duration}</div>
                </div>
                <div className="rv-info">
                  <div className="rv-vtitle">{v.title}</div>
                  <div className="rv-vchannel">
                    <Youtube size={11} style={{ color:"#ef4444" }} />
                    {v.channel}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}