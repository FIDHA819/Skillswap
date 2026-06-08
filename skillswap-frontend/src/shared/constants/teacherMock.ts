import type {
  Session, Request, Student, Review, Skill, ChatThread
} from "../../domain/entities/teacher"

export const SESSIONS: Session[] = [
  { id: 1, name: "Arjun Mehta",  initials: "AM", skill: "React Fundamentals", time: "10:00 AM", duration: "60 min", status: "live",      color: "purple", meetLink: "https://meet.google.com/new" },
  { id: 2, name: "Sneha Patel",  initials: "SP", skill: "UI/UX Design",       time: "12:30 PM", duration: "45 min", status: "soon",      color: "green",  meetLink: "https://meet.google.com/new" },
  { id: 3, name: "Rahul Singh",  initials: "RS", skill: "Python Basics",      time: "03:00 PM", duration: "60 min", status: "scheduled", color: "amber",  meetLink: "https://meet.google.com/new" },
  { id: 4, name: "Meera Nair",   initials: "MN", skill: "TypeScript",         time: "05:30 PM", duration: "45 min", status: "scheduled", color: "red",    meetLink: "https://meet.google.com/new" },
]

export const REQUESTS: Request[] = [
  { id: 1, initials: "AK", name: "Anil Kumar",   skill: "React Advanced",  note: "Weekday evenings",  color: "purple" },
  { id: 2, initials: "PV", name: "Priya Varma",  skill: "Figma UI",        note: "Flexible schedule", color: "green"  },
  { id: 3, initials: "RS", name: "Rohit Sharma", skill: "Node.js",         note: "Weekends only",     color: "amber"  },
  { id: 4, initials: "NK", name: "Nisha Kaur",   skill: "Python ML",       note: "Morning slots",     color: "red"    },
  { id: 5, initials: "VR", name: "Vivek Rao",    skill: "TypeScript",      note: "Any slot",          color: "purple" },
]

export const STUDENTS: Student[] = [
  { id: 1, initials: "AM", name: "Arjun Mehta",  skill: "React",          sessions: 8, progress: 82, status: "Active",  color: "purple" },
  { id: 2, initials: "SP", name: "Sneha Patel",  skill: "UI/UX Design",   sessions: 5, progress: 65, status: "Active",  color: "green"  },
  { id: 3, initials: "RS", name: "Rahul Singh",  skill: "Python",         sessions: 3, progress: 40, status: "New",     color: "amber"  },
  { id: 4, initials: "MN", name: "Meera Nair",   skill: "TypeScript",     sessions: 6, progress: 70, status: "Active",  color: "red"    },
  { id: 5, initials: "AK", name: "Anil Kumar",   skill: "React Advanced", sessions: 0, progress: 0,  status: "Pending", color: "purple" },
  { id: 6, initials: "PV", name: "Priya Varma",  skill: "Figma UI",       sessions: 2, progress: 22, status: "New",     color: "green"  },
]

export const REVIEWS: Review[] = [
  { id: 1, initials: "SM", name: "Sneha M.", rating: 5, text: "Explains concepts so clearly! Best React teacher I've found.", color: "purple", date: "24 May 2026" },
  { id: 2, initials: "RK", name: "Rahul K.", rating: 4, text: "Very patient. Helped me understand Python from scratch.", color: "green",  date: "22 May 2026" },
  { id: 3, initials: "AL", name: "Aryan L.", rating: 5, text: "Best TypeScript tutor. Structured, very engaging sessions.", color: "amber", date: "20 May 2026" },
  { id: 4, initials: "MP", name: "Meera P.", rating: 5, text: "Amazing UI/UX sessions. Learned Figma so fast!", color: "red",    date: "17 May 2026" },
]

export const SKILLS: Skill[] = [
  { name: "React",        emoji: "⚛️", students: 18, pct: 88 },
  { name: "UI/UX Design", emoji: "🎨", students: 14, pct: 72 },
  { name: "Python",       emoji: "🐍", students: 11, pct: 60 },
  { name: "TypeScript",   emoji: "📘", students: 5,  pct: 26 },
  { name: "Node.js",      emoji: "🟩", students: 8,  pct: 46 },
]

export const CHAT_THREADS: ChatThread[] = [
  {
    studentId: 1, initials: "AM", name: "Arjun Mehta",  skill: "React",         color: "purple", unread: 2,
    messages: [
      { id: 1, from: "student", text: "When should I use useCallback vs useMemo?", time: "10:05 AM" },
      { id: 2, from: "teacher", text: "useCallback memoizes a function ref, useMemo memoizes a computed value. Use useCallback when passing callbacks to children.", time: "10:07 AM" },
      { id: 3, from: "student", text: "That makes sense! So useMemo is for expensive calculations?", time: "10:08 AM" },
      { id: 4, from: "student", text: "Also — does our session start at 10 today?", time: "10:10 AM" },
    ],
  },
  {
    studentId: 2, initials: "SP", name: "Sneha Patel",  skill: "UI/UX Design",  color: "green",  unread: 1,
    messages: [
      { id: 1, from: "student", text: "Can you share the Figma file from last session?", time: "9:30 AM" },
      { id: 2, from: "teacher", text: "Sure! Sending it before today's session. Check your email.", time: "9:45 AM" },
      { id: 3, from: "student", text: "Got it, thanks!", time: "9:50 AM" },
    ],
  },
  {
    studentId: 3, initials: "RS", name: "Rahul Singh",  skill: "Python Basics", color: "amber",  unread: 0,
    messages: [
      { id: 1, from: "teacher", text: "Hey Rahul, revise list comprehensions before our 3pm session.", time: "Yesterday" },
      { id: 2, from: "student", text: "Will do! I've been practicing on LeetCode too.", time: "Yesterday" },
    ],
  },
  {
    studentId: 4, initials: "MN", name: "Meera Nair",   skill: "TypeScript",    color: "red",    unread: 0,
    messages: [
      { id: 1, from: "student", text: "The generics topic was super clear today, thank you!", time: "Mon" },
      { id: 2, from: "teacher", text: "You're doing great! Utility types are next.", time: "Mon" },
    ],
  },
  {
    studentId: 5, initials: "PV", name: "Priya Varma",  skill: "Figma UI",      color: "green",  unread: 3,
    messages: [
      { id: 1, from: "student", text: "When can we schedule our first session?", time: "Sun" },
      { id: 2, from: "student", text: "I'm free any evening this week!", time: "Sun" },
      { id: 3, from: "student", text: "Please let me know 🙂", time: "Sun" },
    ],
  },
]