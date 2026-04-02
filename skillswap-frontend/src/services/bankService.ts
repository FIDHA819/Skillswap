import axios from "axios";


const API = axios.create({ baseURL: "http://localhost:5000/api/bank" });

export const bankService = {
  submit: async (data: FormData): Promise<{ status: string }> => {
    const token = localStorage.getItem("token"); 

    const res = await API.post("/submit", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};
