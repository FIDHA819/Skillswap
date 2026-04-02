import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { bankService } from "../services/bankService";

type Message = { type: "error" | "success"; text: string };

const BankForm: React.FC = () => {
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please upload bank proof." });
      return;
    }

    const formData = new FormData();
    formData.append("bankName", bankName);
    formData.append("accountNumber", accountNumber);
    formData.append("ifsc", ifsc);
    formData.append("document", file);

    setLoading(true);
    setMessage(null);

    try {
      await bankService.submit(formData);
      setMessage({ type: "success", text: "Bank account added successfully!" });

   
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      console.error("❌ Bank submit error:", err.response?.data || err.message);
      setMessage({ type: "error", text: "Failed to add bank account." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Bank Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="IFSC Code"
            value={ifsc}
            onChange={(e) => setIfsc(e.target.value)}
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
            {loading ? "Submitting..." : "Add Bank Account"}
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

export default BankForm;
