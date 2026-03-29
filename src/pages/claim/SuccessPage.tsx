import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ClaimSuccessState } from '../../routes/navigation';

export function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ClaimSuccessState | null;
  const username = state?.username ?? '';

  useEffect(() => {
    if (!username) navigate('/', { replace: true });
  }, [username, navigate]);

  if (!username) return null;

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-[500px]">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
        <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl md:text-4xl font-medium text-white">@{username} is yours.</h2>
        <p className="text-white/60 text-[15px] leading-relaxed">
          Locked in. You&apos;re on the list — we&apos;ll be in touch.
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-4 px-8 py-3 rounded-full bg-white text-black text-[14px] font-semibold hover:scale-105 active:scale-95 transition-all"
      >
        Return Home
      </button>
    </div>
  );
}
