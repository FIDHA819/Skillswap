import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../presentation/components/store/authSlice";
import axios from "axios";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });
      // Save in Redux store
      dispatch(setCredentials({ token: res.data.token, user: { ...res.data.user, role: "admin" } }));
      navigate("/admin/users");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 rounded-xl shadow-md w-full max-w-sm bg-white flex flex-col gap-4">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="px-3 py-2 border rounded-xl" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="px-3 py-2 border rounded-xl" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
