import { makeAutoObservable } from "mobx";
import axios from "axios";

export class AdminViewModel {
  users: any[] = [];
  loading = false;
  error = "";

  constructor() {
    makeAutoObservable(this);
  }

  fetchUsers = async () => {
    this.loading = true;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      this.users = res.data;
    } catch (err: any) {
      this.error = err.response?.data?.message || "Failed to load users";
    } finally {
      this.loading = false;
    }
  };

  updateKyc = async (userId: string, status: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/users/${userId}/kyc`,
        { kycStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };
}
