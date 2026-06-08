export type SessionType  = "live" | "recorded"
export type SessionMode  = "free" | "paid"
export type SessionStatus = "live" | "upcoming" | "completed" | "cancelled"

export interface LiveSession {
  id: string
  title: string
  subject: string
  description: string
  date: string          // ISO string
  time: string          // "HH:MM"
  durationMins: number
  meetLink?: string
  type: "live"
  mode: SessionMode
  price?: number
  status: SessionStatus
  enrolledCount: number
  maxStudents?: number
  thumbnailUrl?: string
  studentInitials?: string[]
}

export interface VideoLecture {
  id: string
  title: string
  subject: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  durationMins: number
  type: "recorded"
  mode: SessionMode
  price?: number
  uploadedAt: string
  views: number
}

export type SessionItem = LiveSession | VideoLecture

export interface CreateSessionPayload {
  title: string
  subject: string
  description: string
  date?: string
  time?: string
  durationMins: number
  type: SessionType
  mode: SessionMode
  price?: number
  maxStudents?: number
}