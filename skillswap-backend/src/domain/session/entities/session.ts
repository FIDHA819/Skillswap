export interface Session {
  _id?: string

  teacherId: string

  title: string
  subject: string
  description: string

  type: "live" | "recorded"
  mode: "free" | "paid"

  date?: string
  time?: string

  durationMins: number

  price?: number

  meetLink?: string
  videoUrl?: string

  status?: "live" | "upcoming" | "completed"

  enrolledCount?: number

  createdAt?: Date
}