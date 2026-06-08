const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export interface SkillItem {
  _id: string;
  name: string;
  description?: string;
  categoryId?: string;
  teachers?: string[];
  learners?: string[];
  createdAt?: string;
  updatedAt?: string;
}

function authHeaders() {
  const token = localStorage.getItem("token") ?? "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export const skillsService = {
  getSkills: (): Promise<{ skillsToTeach: SkillItem[] }> =>
    fetch(`${BASE}/skills/my-skills`, {
      method: "GET",
      headers: authHeaders(),
    }).then((r) => handle(r)),

  saveSkills: (skillsToTeach: string[]): Promise<{ skillsToTeach: SkillItem[] }> =>
    fetch(`${BASE}/skills/my-skills`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ skillsToTeach }),
    }).then((r) => handle(r)),

  addSkill: (skill: string): Promise<{ skillsToTeach: SkillItem[] }> =>
    fetch(`${BASE}/skills/my-skills/add`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ skill }),
    }).then((r) => handle(r)),

  removeSkill: (skill: string): Promise<{ skillsToTeach: SkillItem[] }> =>
    fetch(`${BASE}/skills/my-skills/remove`, {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ skill }),
    }).then((r) => handle(r)),
};