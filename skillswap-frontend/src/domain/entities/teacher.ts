// ── domain/entities/teacher.ts  (add these fields if missing) ──────────────
export interface AvailabilitySlot {
  day: string
  start: string
  end: string
}

export interface TeacherProfile {
  _id?: string
  fullName: string
  email: string
  headline: string
  bio: string
  experienceYears: number
  country: string
  language: string
  profileImage?: string
  skillsToTeach: string[]
  availability: AvailabilitySlot[]
  rating: number
  totalSessions: number
  totalStudents: number
  kycStatus: "Verified" | "Pending" | "Rejected" | "Not Submitted"
  kycVerified: boolean
  bankStatus?: "Added" | "Not Added"
  isVerified?: boolean
  createdAt?: string
}

export const DAYS = [
  "Monday","Tuesday","Wednesday",
  "Thursday","Friday","Saturday","Sunday",
]

export const SKILL_SUGGESTIONS = [
  "React","Node.js","MongoDB","Next.js","TypeScript","Python",
  "Django","Vue.js","Angular","Flutter","Swift","Kotlin",
  "AWS","Docker","GraphQL","PostgreSQL","Figma","UI/UX Design",
  "Machine Learning","Data Science","Java","Spring Boot",
]