import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pillInner, pillOuter } from '../../claim/pillStyles';
import { postSendCode } from '../../lib/claimApi';
import { readApiError } from '../../lib/readApiError';
import { normalizeUsername, validateUsername } from '../../lib/username';
import type { ClaimCodeState, ClaimEmailState, ClaimErrorState } from '../../routes/navigation';

export function EmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ClaimEmailState | null;
  const username = state?.username ?? '';

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!username) navigate('/', { replace: true });
  }, [username, navigate]);

  const runSendCode = async () => {
    const normalizedUser = normalizeUsername(username);
    const err = validateUsername(username);
    if (err) {
      navigate('/claim/error', {
        state: { username: normalizedUser, variant: 'other', message: err } satisfies ClaimErrorState,
      });
      return;
    }
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      navigate('/claim/error', {
        state: {
          username: normalizedUser,
          variant: 'other',
          message: 'Drop in a real email so we can reach you.',
        } satisfies ClaimErrorState,
      });
      return;
    }

    setSending(true);
    try {
      const res = await postSendCode(normalizedUser, trimmed.toLowerCase());
      if (res.ok) {
        navigate('/claim/code', {
          state: { username: normalizedUser, email: trimmed.toLowerCase() } satisfies ClaimCodeState,
        });
        return;
      }
      const msg = await readApiError(res);
      navigate('/claim/error', {
        state: {
          username: normalizedUser,
          variant: res.status === 409 ? 'taken' : 'other',
          message: msg,
        } satisfies ClaimErrorState,
      });
    } catch {
      navigate('/claim/error', {
        state: {
          username: normalizedUser,
          variant: 'other',
          message: "We can't reach the service right now. Check your connection and try again.",
        } satisfies ClaimErrorState,
      });
    } finally {
      setSending(false);
    }
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runSendCode();
  };

  if (!username) return null;

  if (sending) {
    return (
      <div className="flex flex-col items-center gap-8 text-center max-w-[480px]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-medium text-white">Sending your code</h2>
          <p className="text-white/50 text-[15px] leading-relaxed">Hang tight — we&apos;re pinging your inbox.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[680px] text-center">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-white/50 tracking-wide uppercase">Step 2</p>
        <h2 className="text-2xl md:text-3xl font-medium text-white">Confirm it&apos;s you</h2>
        <p className="text-white/60 text-[15px] max-w-[440px] mx-auto leading-relaxed">
          We&apos;ll send a short code to lock in <span className="text-white font-medium">@{username}</span>.
        </p>
      </div>

      <form className={`${pillOuter} max-w-[440px] w-full`} onSubmit={handleEmailSubmit}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>
        <div className={pillInner}>
          <div className="relative flex-1 flex items-center pl-4 md:pl-5 pr-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoComplete="email"
              className="relative z-10 flex-1 bg-transparent text-white py-2 md:py-2.5 outline-none text-[14px] md:text-[15px] font-medium w-full"
            />
            {!email && (
              <span
                className={`absolute left-4 md:left-5 pointer-events-none text-[14px] md:text-[15px] font-medium transition-opacity ${emailFocused ? 'text-white/20' : 'text-white/30'}`}
              >
                your@email.com
              </span>
            )}
          </div>
          <button
            type="submit"
            className="relative bg-white text-black rounded-full px-5 md:px-6 h-[36px] md:h-[42px] text-[13px] md:text-[14px] font-bold shrink-0 transition-transform hover:scale-[1.02] active:scale-95"
          >
            Send code
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-[14px] text-white/40 hover:text-white/70 transition-colors"
      >
        ← Back 
      </button>
    </div>
  );
}
