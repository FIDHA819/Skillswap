// src/services/authService.ts

import axios from "axios"

const API =
  "http://localhost:5000"

export const authService = {

  async getCurrentUser() {

    const token =
      localStorage.getItem("token")

    const res =
      await axios.get(

        `${API}/me`,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      )

    return res.data
  }

}