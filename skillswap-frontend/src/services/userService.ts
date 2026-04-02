// src/services/userService.ts
import api from "../infrastructure/api/axios";
const API_URL = "http://localhost:5000/api/users";

export const userService = {
  getProfile: async (token?: string) => {
    const res = await api.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
    });
    return res.data;
  },

  updateProfile: async (data: FormData | Record<string, any>, token?: string) => {
    const authToken = token || localStorage.getItem("token");
    if (!authToken) throw new Error("User not authenticated");

    const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };

    // If sending FormData, remove any Content-Type so axios can set the multipart boundary.
    if (data instanceof FormData) {
      const res = await api.put(`${API_URL}/me`, data, {
        headers,
        transformRequest: [(d, h) => {
          // delete header if present (handles axios instances with default headers)
          if (h && h['Content-Type']) delete h['Content-Type'];
          return d;
        }],
      });
      return res.data;
    } else {
      // JSON request
      headers["Content-Type"] = "application/json";
      const res = await api.put(`${API_URL}/me`, data, { headers });
      return res.data;
    }
  },
};
