export interface AvailabilitySlot{
  day:string
  start:string
  end:string
}

export interface Profile{

  id:string

  userId:string

  email:string

  fullName:string

  nickname?:string

  photoUrl?:string

  gender?:string

  country?:string

  language?:string

  qualification?:string

  dob?:Date

  role:"learner"|"teacher"

  headline?:string

  bio?:string

  skillsToTeach:string[]

  experienceYears?:number

  hourlyRate?:number

  availability?:AvailabilitySlot[]

  totalStudents:number

  totalSessions:number

  rating:number

  kycVerified:boolean

  profileCompleted?:boolean
}