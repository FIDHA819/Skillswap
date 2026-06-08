import type { TeacherProfile } from "../domain/entities/teacher"

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000"

function headers(isJson = true) {
  const token = localStorage.getItem("token") ?? ""
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token   ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const e = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(e.message ?? "Request failed")
  }
  return res.json()
}

export const teacherService = {
  getProfile: () =>
  fetch(`${BASE}/profile/teacher`, {
    headers: headers(),
  }).then(r => handle<TeacherProfile>(r)),

  updateProfile: (data) =>
  fetch(`${BASE}/profile/teacher`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(data),
  }).then(r => handle<TeacherProfile>(r)),
  
  uploadPhoto: async (file: File) => {
    const form = new FormData()
    form.append("photo", file)
    return fetch(`${BASE}/teacher/profile/photo`, {
      method: "POST",
      headers: headers(false),
      body: form,
    }).then(r => handle<{ profileImage: string }>(r))
  },

  submitKYC: async (file: File) => {
    const form = new FormData()
    form.append("document", file)
    return fetch(`${BASE}/teacher/kyc`, {
      method: "POST",
      headers: headers(false),
      body: form,
    }).then(r => handle<{ kycStatus: string }>(r))
  },

  addBank: (data: { accountNumber: string; ifsc: string; holderName: string }) =>
    fetch(`${BASE}/teacher/bank`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then(r => handle<{ bankStatus: string }>(r)),
}