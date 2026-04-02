import { useState } from "react";
import { type KycDetails } from "../models/kyc";
import { kycService } from "../services/kycService";

export function useKycViewModel(userId: string) {
  const [kyc, setKyc] = useState<KycDetails | null>(null);

  const submitKyc = async (data: KycDetails) => {
    const saved = await kycService.submit(userId, data);
    setKyc(saved);
  };

  return { kyc, submitKyc };
}
