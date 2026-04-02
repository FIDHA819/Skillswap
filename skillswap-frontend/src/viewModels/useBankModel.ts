import { useState } from "react";
import { Bank } from "../models/Bank";
import { apiService } from "../services/apiService";

export function useBankViewModel(userId: string) {
  const [bank, setBank] = useState<Bank | null>(null);

  const submitBank = async (data: Bank) => {
    const saved = await apiService.submitBank(userId, data);
    setBank(saved);
  };

  return { bank, submitBank };
}
