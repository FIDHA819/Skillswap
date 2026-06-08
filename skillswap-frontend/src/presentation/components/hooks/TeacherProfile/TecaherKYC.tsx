import type { TeacherProfile } from '../../../../domain/entities/teacher';

export default function TeacherKYC({ profile }: { profile: TeacherProfile }) {
  const isVerified = profile.kycStatus === 'Verified';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
      <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        Account Verification Status
      </span>

      {isVerified ? (
        <div className="inline-flex flex-col items-center">
          <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold mb-2 border border-emerald-200">
            ✓
          </div>
          <span className="text-base font-bold text-emerald-800">Verified Educator</span>
          <p className="text-slate-400 text-xs mt-1 px-4">
            Your identity has been fully approved. You have full discoverability rankings on the search matrix.
          </p>
        </div>
      ) : (
        <div className="inline-flex flex-col items-center">
          <div className="h-14 w-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-2xl font-bold mb-2 animate-pulse border border-amber-200">
            !
          </div>
          <span className="text-base font-bold text-amber-800">Pending Verification</span>
          <p className="text-slate-400 text-xs mt-1 px-4">
            Our compliance crew is vetting your credentials. This takes roughly 24-48 business hours.
          </p>
        </div>
      )}
    </div>
  );
}