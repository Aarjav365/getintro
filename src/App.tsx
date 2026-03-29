import { motion, AnimatePresence } from 'motion/react';
import { useState, type FormEvent } from 'react';

type View = 'landing' | 'email' | 'sending' | 'code' | 'verifying' | 'success' | 'error';

async function readApiError(res: Response): Promise<string> {
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('text/html')) {
    return 'The app received a web page instead of the API (often a Vercel routing issue). Confirm /api routes are not rewritten to index.html.';
  }
  const raw = await res.text();
  try {
    const j = JSON.parse(raw) as {
      error?: string | { message?: string };
      message?: string;
    };
    if (typeof j.error === 'string') return j.error;
    if (j.error && typeof j.error === 'object' && typeof j.error.message === 'string') {
      return j.error.message;
    }
    if (typeof j.message === 'string') return j.message;
  } catch {
    /* not JSON */
  }
  const snippet = raw.trim().slice(0, 160);
  if (snippet) return `Error (${res.status}): ${snippet}`;
  if (res.status >= 500) {
    return `Server error (${res.status}) with no message body. If this persists, check the API logs, env vars (Supabase + Resend), and GET /api/health.`;
  }
  return `Something went sideways (${res.status}). Try again.`;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorVariant, setErrorVariant] = useState<'taken' | 'other'>('other');

  const pillOuter =
    'relative rounded-full p-[1px] bg-gradient-to-b from-white/20 to-white/5 overflow-visible group w-full max-w-[440px] focus-within:from-white/40 focus-within:to-white/10 hover:from-white/30 hover:to-white/10 transition-all duration-500';
  const pillInner =
    'relative z-10 bg-black/80 backdrop-blur-2xl rounded-full p-1.5 md:p-2 flex items-center shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)] group-focus-within:shadow-[0_0_60px_-15px_rgba(255,255,255,0.2)] transition-all duration-500';

  const validateUsername = (u: string) => {
    const n = u.toLowerCase().trim();
    if (n.length > 30) return 'Keep it to 30 characters or less.';
    if (!/^[a-z0-9_]+$/.test(n)) return 'Letters, numbers, and underscores only.';
    return null;
  };

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const err = validateUsername(username);
    if (err) {
      setErrorVariant('other');
      setErrorMessage(err);
      setView('error');
      return;
    }
    setErrorMessage('');
    setEmail('');
    setCode('');
    setView('email');
  };

  const sendCode = async () => {
    const normalizedUser = username.toLowerCase().trim();
    const err = validateUsername(username);
    if (err) {
      setErrorVariant('other');
      setErrorMessage(err);
      setView('error');
      return;
    }
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorVariant('other');
      setErrorMessage('Drop in a real email so we can reach you.');
      setView('error');
      return;
    }

    setView('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/claim/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUser, email: trimmed.toLowerCase() }),
      });

      if (res.ok) {
        setCode('');
        setView('code');
        return;
      }

      const msg = await readApiError(res);
      if (res.status === 409) {
        setErrorVariant('taken');
      } else {
        setErrorVariant('other');
      }
      setErrorMessage(msg);
      setView('error');
    } catch {
      setErrorVariant('other');
      setErrorMessage("We can't reach the service right now. Check your connection and try again.");
      setView('error');
    }
  };

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendCode();
  };

  const handleVerifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    const normalizedUser = username.toLowerCase().trim();
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 6) {
      setErrorVariant('other');
      setErrorMessage('Enter the full 6-digit code.');
      setView('error');
      return;
    }

    setView('verifying');
    setErrorMessage('');

    try {
      const res = await fetch('/api/claim/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: normalizedUser,
          email: email.trim().toLowerCase(),
          code: digits,
        }),
      });

      if (res.ok) {
        setView('success');
        return;
      }

      const msg = await readApiError(res);
      if (res.status === 409) {
        setErrorVariant('taken');
      } else {
        setErrorVariant('other');
      }
      setErrorMessage(msg);
      setView('error');
    } catch {
      setErrorVariant('other');
      setErrorMessage("We can't reach the service right now. Check your connection and try again.");
      setView('error');
    }
  };

  const resetFlow = () => {
    setUsername('');
    setEmail('');
    setCode('');
    setErrorMessage('');
    setErrorVariant('other');
    setView('landing');
  };

  const goBackToLanding = () => {
    setEmail('');
    setCode('');
    setErrorMessage('');
    setView('landing');
  };

  const goBackToEmail = () => {
    setCode('');
    setView('email');
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-white/20">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260217_030345_246c0224-10a4-422c-b324-070b7c0eceda.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col items-center justify-center pt-[40px] md:pt-[80px] pb-[102px] px-6">
          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <motion.div
                key="landing"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', transition: { duration: 0.4 } }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.2 },
                  },
                }}
                className="flex flex-col items-center gap-[40px] w-full max-w-[680px]"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[20px] bg-white/10 border border-white/20 backdrop-blur-md"
                >
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                  <span className="text-[13px] font-medium">
                    <span className="text-white/60">Private network opening</span>
                    <span className="text-white"> Dec 1, 2026</span>
                  </span>
                </motion.div>

                <div className="flex flex-col items-center gap-[24px] text-center">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                      visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                    }}
                    className="text-[36px] md:text-[56px] font-medium leading-[1.1] max-w-[680px] text-transparent bg-clip-text"
                    style={{
                      backgroundImage: 'linear-gradient(144.5deg, #FFFFFF 28%, rgba(0, 0, 0, 0) 115%)',
                    }}
                  >
                    Direct introductions to the people who matter
                  </motion.h1>

                  <motion.p
                    variants={{
                      hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                      visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                    }}
                    className="text-[15px] font-normal text-white/70 max-w-[600px] leading-relaxed"
                  >
                    Bypass the noise and gatekeepers. Our curated network connects ambitious founders, investors, and
                    creators directly with the individuals who can accelerate their vision.
                  </motion.p>
                </div>

                <motion.form
                  variants={{
                    hidden: { opacity: 0, filter: 'blur(12px)', y: 15 },
                    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
                  }}
                  className={pillOuter}
                  onSubmit={handleUsernameSubmit}
                >
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>

                  <div className={pillInner}>
                    <div className="pl-4 md:pl-5 pr-1 flex items-center justify-center text-white/40">
                      <span className="text-[14px] md:text-[15px] font-medium">@</span>
                    </div>
                    <div className="relative flex-1 flex items-center">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        autoComplete="username"
                        className="relative z-10 flex-1 bg-transparent text-white py-2 md:py-2.5 outline-none text-[14px] md:text-[15px] font-medium w-full"
                      />
                      {!username && (
                        <motion.span
                          initial={false}
                          animate={
                            isFocused
                              ? { filter: ['blur(12px)', 'blur(0px)'], opacity: [0, 1] }
                              : { filter: 'blur(0px)', opacity: 1 }
                          }
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-0 pointer-events-none text-white/30 text-[14px] md:text-[15px] font-medium"
                        >
                          claim your username
                        </motion.span>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="relative bg-white text-black rounded-full h-[36px] w-[36px] md:h-[42px] md:w-[42px] group-hover:w-[90px] md:group-hover:w-[100px] group-focus-within:w-[90px] md:group-focus-within:w-[100px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer shrink-0 overflow-hidden"
                    >
                      <span className="absolute left-[16px] md:left-[20px] top-[60%] -translate-y-1/2 text-[13px] md:text-[14px] font-bold opacity-0 -translate-x-4 -rotate-12 group-hover:opacity-100 group-hover:top-1/2 group-hover:translate-x-0 group-hover:rotate-0 group-focus-within:opacity-100 group-focus-within:top-1/2 group-focus-within:translate-x-0 group-focus-within:rotate-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] whitespace-nowrap">
                        Claim
                      </span>
                      <svg
                        className="absolute top-1/2 -translate-y-1/2 right-[11px] md:right-[14px] transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] w-[14px] h-[14px]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          className="transform origin-left transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 group-focus-within:scale-x-100 group-focus-within:opacity-100"
                          d="M5 12h14"
                        />
                        <path
                          className="transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] -translate-x-2 group-hover:translate-x-0 group-focus-within:translate-x-0"
                          d="m12 5 7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.form>
              </motion.div>
            )}

            {view === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-8 w-full max-w-[680px] text-center"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] font-medium text-white/50 tracking-wide uppercase">Step 2</p>
                  <h2 className="text-2xl md:text-3xl font-medium text-white">Confirm it&apos;s you</h2>
                  <p className="text-white/60 text-[15px] max-w-[440px] mx-auto leading-relaxed">
                    We&apos;ll send a short code to lock in{' '}
                    <span className="text-white font-medium">@{username.toLowerCase().trim()}</span>.
                  </p>
                </div>

                <form className={`${pillOuter} max-w-[440px] w-full`} onSubmit={handleEmailSubmit}>
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>
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
                  onClick={goBackToLanding}
                  className="text-[14px] text-white/40 hover:text-white/70 transition-colors"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {view === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-8 w-full max-w-[680px] text-center"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] font-medium text-white/50 tracking-wide uppercase">Step 3</p>
                  <h2 className="text-2xl md:text-3xl font-medium text-white">Enter your code</h2>
                  <p className="text-white/60 text-[15px] max-w-[440px] mx-auto leading-relaxed">
                    Check <span className="text-white/90">{email}</span> — code expires in 15 minutes.
                  </p>
                </div>

                <form className={`${pillOuter} max-w-[440px] w-full`} onSubmit={handleVerifySubmit}>
                  <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>
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
                    onClick={() => void sendCode()}
                    className="text-[14px] text-white/50 hover:text-white/80 transition-colors"
                  >
                    Resend code
                  </button>
                  <button
                    type="button"
                    onClick={goBackToEmail}
                    className="text-[14px] text-white/40 hover:text-white/70 transition-colors"
                  >
                    ← Use a different email
                  </button>
                </div>
              </motion.div>
            )}

            {(view === 'sending' || view === 'verifying') && (
              <motion.div
                key={view}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-8 text-center max-w-[480px]"
              >
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl md:text-3xl font-medium text-white">
                    {view === 'sending' && 'Sending your code'}
                    {view === 'verifying' && 'Locking it in'}
                  </h2>
                  <p className="text-white/50 text-[15px] leading-relaxed">
                    {view === 'sending' && "Hang tight — we're pinging your inbox."}
                    {view === 'verifying' && "Crossing the t's on your spot…"}
                  </p>
                </div>
              </motion.div>
            )}

            {view === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-8 text-center max-w-[500px]"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                  <svg className="w-8 h-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl md:text-4xl font-medium text-white">@{username.toLowerCase().trim()} is yours.</h2>
                  <p className="text-white/60 text-[15px] leading-relaxed">
                    Locked in. You&apos;re on the list — we&apos;ll be in touch.
                  </p>
                </div>
                <button
                  onClick={resetFlow}
                  className="mt-4 px-8 py-3 rounded-full bg-white text-black text-[14px] font-semibold hover:scale-105 active:scale-95 transition-all"
                >
                  Return Home
                </button>
              </motion.div>
            )}

            {view === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-8 text-center max-w-[500px]"
              >
                <div className="w-20 h-20 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
                  <svg className="w-8 h-8 text-red-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h2 className="text-3xl md:text-4xl font-medium text-white">
                    {errorVariant === 'taken' ? `@${username.toLowerCase().trim()} is taken.` : "Couldn't lock that in."}
                  </h2>
                  <p className="text-white/60 text-[15px] leading-relaxed">
                    {errorMessage || 'Something went sideways. Try again.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setErrorMessage('');
                    setErrorVariant('other');
                    setView('landing');
                  }}
                  className="mt-4 px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white text-[14px] font-semibold hover:bg-white/20 active:scale-95 transition-all"
                >
                  Try Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
