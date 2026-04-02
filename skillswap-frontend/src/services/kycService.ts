
import api from "../infrastructure/api/axios";

export const kycService = {
  submitKyc: async (formData: FormData, token: string) => {
    return api.post("/kyc", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
