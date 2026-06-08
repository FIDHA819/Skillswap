import type { LiveSession, VideoLecture, CreateSessionPayload } from "./session.types"

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000/session"

function headers(isJson = true) {
  const token = localStorage.getItem("token") ?? ""
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token   ? { Authorization: `Bearer ${token}` }  : {}),
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const e = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(e.message ?? "Request failed")
  }
  return res.json()
}

export const sessionService = {
  getLiveSessions: () =>
    fetch(`${BASE}/teacher/sessions/live`, { headers: headers() })
      .then(r => handle<LiveSession[]>(r)),

  getVideoLectures: () =>
    fetch(`${BASE}/teacher/sessions/lectures`, { headers: headers() })
      .then(r => handle<VideoLecture[]>(r)),

  createLiveSession: (data: CreateSessionPayload) =>
    fetch(`${BASE}/teacher/sessions/live`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(r => handle<LiveSession>(r)),

  createMeetLink: (sessionId: string) =>
    fetch(`${BASE}/teacher/sessions/${sessionId}/meet`, {
      method: "POST",
      headers: headers(),
    }).then(r => handle<{ meetLink: string }>(r)),

  uploadLecture: async (data: CreateSessionPayload, file: File, onProgress?: (pct: number) => void) => {
    const token = localStorage.getItem("token") ?? ""
    const form  = new FormData()
    form.append("video",        file)
    form.append("title",        data.title)
    form.append("subject",      data.subject)
    form.append("description",  data.description)
    form.append("durationMins", String(data.durationMins))
    form.append("mode",         data.mode)
    if (data.price) form.append("price", String(data.price))

    return new Promise<VideoLecture>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("POST", `${BASE}/teacher/sessions/lectures`)
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.upload.onprogress = e => {
        if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100))
      }
      xhr.onload  = () => {
        try { resolve(JSON.parse(xhr.responseText)) } catch { reject(new Error("Upload failed")) }
      }
      xhr.onerror = () => reject(new Error("Network error"))
      xhr.send(form)
    })
  },

  deleteSession: (id: string) =>
    fetch(`${BASE}/teacher/sessions/${id}`, {
      method: "DELETE",
      headers: headers(),
    }).then(r => handle<{ success: boolean }>(r)),
}

// ── Mock data ──────────────────────────────────────────────
export const MOCK_LIVE: LiveSession[] = [
  {
    id: "s1", title: "React Hooks Deep Dive", subject: "React", description: "Covering useEffect, useCallback and custom hooks with real examples.",
    date: "2026-05-30", time: "18:00", durationMins: 60, meetLink: "https://meet.google.com/abc-defg-hij",
    type: "live", mode: "free", status: "live", enrolledCount: 14, maxStudents: 20,
    studentInitials: ["AM","SP","RK","MN","PV"],
  },
  {
    id: "s2", title: "TypeScript Generics Masterclass", subject: "TypeScript", description: "Advanced generics, conditional types, and mapped types from scratch.",
    date: "2026-06-02", time: "19:30", durationMins: 90, type: "live", mode: "paid", price: 199,
    status: "upcoming", enrolledCount: 8, maxStudents: 15,
    studentInitials: ["AK","RS"],
  },
  {
    id: "s3", title: "Node.js REST API Workshop", subject: "Node.js", description: "Build a production REST API with Express, JWT auth and MongoDB.",
    date: "2026-06-05", time: "17:00", durationMins: 120, type: "live", mode: "paid", price: 299,
    status: "upcoming", enrolledCount: 5, maxStudents: 12,
  },
  {
    id: "s4", title: "CSS Grid & Flexbox", subject: "CSS", description: "Complete layout techniques with hands-on projects.",
    date: "2026-05-20", time: "16:00", durationMins: 60, meetLink: "https://meet.google.com/xyz",
    type: "live", mode: "free", status: "completed", enrolledCount: 31,
  },
]

export const MOCK_VIDEOS: VideoLecture[] = [
  {
    id: "v1", title: "Python Basics — Crash Course", subject: "Python", description: "Complete Python intro: variables, loops, functions and OOP.",
    videoUrl: "#", durationMins: 45, type: "recorded", mode: "free",
    uploadedAt: "2026-05-10", views: 234,
  },
  {
    id: "v2", title: "MongoDB Aggregation Pipeline", subject: "MongoDB", description: "Master $match, $group, $lookup and complex pipelines.",
    videoUrl: "#", durationMins: 38, type: "recorded", mode: "paid", price: 149,
    uploadedAt: "2026-05-15", views: 89,
  },
]