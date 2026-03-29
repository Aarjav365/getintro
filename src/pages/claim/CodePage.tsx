import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pillInner, pillOuter } from '../../claim/pillStyles';
import { postSendCode, postVerifyCode } from '../../lib/claimApi';
import { readApiError } from '../../lib/readApiError';
import { normalizeUsername, validateUsername } from '../../lib/username';
import type {
  ClaimCodeState,
  ClaimEmailState,
  ClaimErrorState,
  ClaimSuccessState,
} from '../../routes/navigation';

export function CodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ClaimCodeState | null;
  const username = state?.username ?? '';
  const emailFromState = state?.email ?? '';

  const [code, setCode] = useState('');
  const [codeFocused, setCodeFocused] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!username || !emailFromState) navigate('/', { replace: true });
  }, [username, emailFromState, navigate]);

  const runSendCode = async () => {
    const normalizedUser = normalizeUsername(username);
    const err = validateUsername(username);
    if (err) {
      navigate('/claim/error', {
        state: { username: normalizedUser, variant: 'other', message: err } satisfies ClaimErrorState,
      });
      return;
    }
    const trimmed = emailFromState.trim();
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

    setResending(true);
    try {
      const res = await postSendCode(normalizedUser, trimmed.toLowerCase());
      if (res.ok) {
        setCode('');
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
      setResending(false);
    }
  };

  const handleVerifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedUser = normalizeUsername(username);
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) {
      navigate('/claim/error', {
        state: {
          username: normalizedUser,
          variant: 'other',
          message: 'Enter the full 6-digit code.',
        } satisfies ClaimErrorState,
      });
      return;
    }

    setVerifying(true);
    try {
      const res = await postVerifyCode(normalizedUser, emailFromState.trim().toLowerCase(), digits);
      if (res.ok) {
        navigate('/claim/success', {
          state: { username: normalizedUser } satisfies ClaimSuccessState,
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
      setVerifying(false);
    }
  };

  if (!username || !emailFromState) return null;

  if (verifying || resending) {
    return (
      <div className="flex flex-col items-center gap-8 text-center max-w-[480px]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-medium text-white">
            {verifying ? 'Locking it in' : 'Sending your code'}
          </h2>
          <p className="text-white/50 text-[15px] leading-relaxed">
            {verifying ? "Crossing the t's on your spot…" : "Hang tight — we're pinging your inbox."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[680px] text-center">
      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-white/50 tracking-wide uppercase">Step 3</p>
        <h2 className="text-2xl md:text-3xl font-medium text-white">Enter your code</h2>
        <p className="text-white/60 text-[15px] max-w-[440px] mx-auto leading-relaxed">
          Check <span className="text-white/90">{emailFromState}</span> — code expires in 15 minutes.
        </p>
      </div>

      <form className={`${pillOuter} max-w-[440px] w-full`} onSubmit={handleVerifySubmit}>
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>
        <div className={pillInner}>
          <div className="relative flex-1 flex items-center pl-4 md:pl-5 pr-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onFocus={() => setCodeFocused(true)}
              onBlur={() => setCodeFocused(false)}
              autoComplete="one-time-code"
              className="relative z-10 flex-1 bg-transparent text-white py-2 md:py-2.5 outline-none text-[22px] md:text-[24px] font-semibold tracking-[0.35em] w-full font-mono"
            />
            {!code && (
              <span
                className={`absolute left-4 md:left-5 pointer-events-none text-[14px] md:text-[15px] font-medium font-sans tracking-normal ${codeFocused ? 'text-white/20' : 'text-white/30'}`}
              >
                • • • • • •
              </span>
            )}
          </div>
          <button
            type="submit"
            className="relative bg-white text-black rounded-full px-5 md:px-6 h-[36px] md:h-[42px] text-[13px] md:text-[14px] font-bold shrink-0 transition-transform hover:scale-[1.02] active:scale-95"
          >
            Verify
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 items-center">
        <button
          type="button"
          onClick={() => void runSendCode()}
          className="text-[14px] text-white/50 hover:text-white/80 transition-colors"
        >
          Resend code
        </button>
        <button
          type="button"
          onClick={() => navigate('/claim/email', { state: { username } satisfies ClaimEmailState })}
          className="text-[14px] text-white/40 hover:text-white/70 transition-colors"
        >
          ← Use a different email
        </button>
      </div>
    </div>
  );
}
