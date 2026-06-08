import { useState, useRef } from "react"
import { ShieldCheck, Upload, CreditCard, Check, X, AlertTriangle, Clock } from "lucide-react"
import type { TeacherProfile } from "../../../../domain/entities/teacher"
import { teacherService } from "../../../../services/teacherService"

interface Props {
  profile: TeacherProfile
  onUpdate: (data: Partial<TeacherProfile>) => void
}

export default function TeacherVerification({ profile, onUpdate }: Props) {
  const [kycLoading,  setKycLoading]  = useState(false)
  const [bankOpen,    setBankOpen]    = useState(false)
  const [bankSaving,  setBankSaving]  = useState(false)
  const [bank, setBank] = useState({ holderName: "", accountNumber: "", ifsc: "" })
  const kycRef = useRef<HTMLInputElement>(null)

  const handleKYC = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setKycLoading(true)
    try {
      const { kycStatus } = await teacherService.submitKYC(file)
      onUpdate({ kycStatus: kycStatus as any })
    } finally { setKycLoading(false) }
  }

  const saveBank = async () => {
    if (!bank.holderName || !bank.accountNumber || !bank.ifsc) return
    setBankSaving(true)
    try {
      const { bankStatus } = await teacherService.addBank(bank)
      onUpdate({ bankStatus: bankStatus as any })
      setBankOpen(false)
      setBank({ holderName: "", accountNumber: "", ifsc: "" })
    } finally { setBankSaving(false) }
  }

  const statusMap = {
    Verified:       { icon: <Check size={18} />,         cls: "verified",  label: "Verified Educator",       desc: "Your identity is fully approved. You have full platform access and top search rankings." },
    Pending:        { icon: <Clock size={18} />,          cls: "pending",   label: "Pending Verification",    desc: "Our team is reviewing your documents. This takes 24–48 business hours." },
    Rejected:       { icon: <AlertTriangle size={18} />, cls: "rejected",  label: "Verification Rejected",   desc: "Your documents were rejected. Please re-submit with valid ID proof." },
    "Not Submitted":{ icon: <Upload size={18} />,         cls: "unsubmitted",label: "Not Verified Yet",       desc: "Submit a valid government ID to get verified and unlock all features." },
  }

  const status = statusMap[profile.kycStatus] ?? statusMap["Not Submitted"]

  return (
    <div className="tp-card">
      <div className="tp-card-title" style={{ marginBottom: 16 }}>
        <ShieldCheck size={15} />
        Verification
      </div>

      {/* KYC Status */}
      <div className={`tp-kyc-status tp-kyc-${status.cls}`}>
        <div className="tp-kyc-icon">{status.icon}</div>
        <div>
          <div className="tp-kyc-label">{status.label}</div>
          <p className="tp-kyc-desc">{status.desc}</p>
        </div>
      </div>

      {/* Submit / Re-submit KYC */}
      {(profile.kycStatus === "Not Submitted" || profile.kycStatus === "Rejected") && (
        <button
          className="tp-verify-btn"
          onClick={() => kycRef.current?.click()}
          disabled={kycLoading}
        >
          {kycLoading
            ? <><span className="tp-spin-xs" /> Uploading…</>
            : <><Upload size={13} /> Submit Identity Document</>
          }
        </button>
      )}
      <input ref={kycRef} type="file" accept="image/*,.pdf" hidden onChange={handleKYC} />

      {/* Divider */}
      <div className="tp-vdivider" />

      {/* Bank */}
      <div className="tp-card-title" style={{ marginBottom: 12 }}>
        <CreditCard size={15} />
        Bank Account
       <span
  style={{
    marginLeft: "auto",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#3b2f1f",
    color: "#fbbf24",
    border: "1px solid #fbbf24"
  }}
>
  {profile.bankStatus ?? "Not Added"}
</span>
      </div>

      {profile.bankStatus !== "Added" && (
        <>
          {bankOpen ? (
            <div className="tp-edit-block">
              <label className="tp-label">Account Holder Name</label>
              <input className="tp-input" value={bank.holderName} onChange={e => setBank({...bank, holderName: e.target.value})} placeholder="Full name as on bank" />
              <label className="tp-label" style={{ marginTop:10 }}>Account Number</label>
              <input className="tp-input" value={bank.accountNumber} onChange={e => setBank({...bank, accountNumber: e.target.value})} placeholder="••••••••••••" />
              <label className="tp-label" style={{ marginTop:10 }}>IFSC Code</label>
              <input className="tp-input" value={bank.ifsc} onChange={e => setBank({...bank, ifsc: e.target.value})} placeholder="e.g. SBIN0001234" />
              <div className="tp-edit-actions" style={{ marginTop:14 }}>
                <button className="tp-btn-save" onClick={saveBank} disabled={bankSaving}>
                  {bankSaving ? <span className="tp-spin-xs" /> : <Check size={13} />} Save Bank
                </button>
                <button className="tp-btn-cancel" onClick={() => setBankOpen(false)}><X size={13} /> Cancel</button>
              </div>
            </div>
          ) : (
            <button className="tp-verify-btn" onClick={() => setBankOpen(true)}>
              <CreditCard size={13} /> Add Bank Account
            </button>
          )}
        </>
      )}

      {profile.bankStatus === "Added" && (
        <div className="tp-bank-added">
          <Check size={14} /> Bank account linked successfully
        </div>
      )}
    </div>
  )
}