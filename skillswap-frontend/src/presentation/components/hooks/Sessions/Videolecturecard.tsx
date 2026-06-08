import { Play, Clock, Eye, Lock, Trash2, Film } from "lucide-react"
import type { VideoLecture } from "../../../../domain/entities/session"

interface Props {
  lecture: VideoLecture
  onDelete: (id: string) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default function VideoLectureCard({ lecture, onDelete }: Props) {
  return (
    <div className="ss-card ss-card-video">
      {/* Thumbnail */}
      <div className="ss-video-thumb" onClick={() => window.open(lecture.videoUrl, "_blank")}>
        {lecture.thumbnailUrl
          ? <img src={lecture.thumbnailUrl} alt={lecture.title} />
          : <div className="ss-video-thumb-fallback"><Film size={32} /></div>
        }
        <div className="ss-play-overlay"><Play size={20} fill="white" /></div>
        <span className="ss-video-dur">{lecture.durationMins}m</span>
      </div>

      {/* Content */}
      <div className="ss-card-body">
        <div className="ss-card-badges" style={{ marginBottom: 8 }}>
          <span className={`ss-badge ${lecture.mode === "paid" ? "ss-badge-paid" : "ss-badge-free"}`}>
            {lecture.mode === "paid" ? <><Lock size={9} />₹{lecture.price}</> : "Free"}
          </span>
          <span className="ss-badge ss-badge-subject">{lecture.subject}</span>
        </div>

        <h3 className="ss-card-title">{lecture.title}</h3>
        <p className="ss-card-desc">{lecture.description}</p>

        <div className="ss-card-meta">
          <span><Clock size={12} />{lecture.durationMins} min</span>
          <span><Eye   size={12} />{lecture.views} views</span>
          <span>Uploaded {formatDate(lecture.uploadedAt)}</span>
        </div>

        <div className="ss-card-actions">
          <button className="ss-meet-btn" onClick={() => window.open(lecture.videoUrl, "_blank")}>
            <Play size={13} /> Preview
          </button>
          <button className="ss-card-del inline" onClick={() => onDelete(lecture.id)}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}