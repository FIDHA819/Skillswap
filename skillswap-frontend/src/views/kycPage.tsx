import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { kycService } from "../services/kycService";

const KycForm: React.FC = () => {
  const [idType, setIdType] = useState("Aadhar");
  const [idNumber, setIdNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!file) return setMessage({ type: "error", text: "Please upload a document." });

  const token = localStorage.getItem("token");
  if (!token) return setMessage({ type: "error", text: "User not logged in." });

  const tempProfile = localStorage.getItem("tempProfile");
  const profile = tempProfile ? JSON.parse(tempProfile) : {};

  const formData = new FormData();
  formData.append("idType", idType);
  formData.append("idNumber", idNumber);
  formData.append("documents", file);
  formData.append("profile", JSON.stringify(profile)); 

  setLoading(true);
  setMessage(null);

  try {
    await kycService.submitKyc(formData, token);
    setMessage({ type: "success", text: "KYC submitted successfully!" });
    setTimeout(() => navigate("/bank"), 1000);
  } catch (err) {
    console.error("KYC failed:", err);
    setMessage({ type: "error", text: "Failed to submit KYC." });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Submit KYC</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="Aadhar">Aadhar</option>
            <option value="PAN">PAN</option>
            <option value="Passport">Passport</option>
          </select>

          <input
            type="text"
            placeholder="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            {loading ? "Submitting..." : "Submit KYC"}
          </button>

          {message && (
            <p
              className={`mt-2 text-center ${
                message.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default KycForm;
