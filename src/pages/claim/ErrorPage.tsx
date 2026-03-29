import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ClaimErrorState } from '../../routes/navigation';

export function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ClaimErrorState | null;
  const username = state?.username ?? '';
  const variant = state?.variant ?? 'other';
  const message = state?.message ?? '';

  useEffect(() => {
    if (!state || typeof state.message !== 'string' || !state.message) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!state || typeof state.message !== 'string' || !state.message) return null;

  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-[500px]">
      <div className="w-20 h-20 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
        <svg className="w-8 h-8 text-red-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl md:text-4xl font-medium text-white">
          {variant === 'taken' ? `@${username} is taken.` : "Couldn't lock that in."}
        </h2>
        <p className="text-white/60 text-[15px] leading-relaxed">
          {message || 'Something went sideways. Try again.'}
        </p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-4 px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white text-[14px] font-semibold hover:bg-white/20 active:scale-95 transition-all"
      >
        Try Another
      </button>
    </div>
  );
}
