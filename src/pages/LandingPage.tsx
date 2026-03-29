import { motion } from 'motion/react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { pillInner, pillOuter } from '../claim/pillStyles';
import { normalizeUsername, validateUsername } from '../lib/username';
import type { ClaimEmailState, ClaimErrorState } from '../routes/navigation';

export function LandingPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    const err = validateUsername(username);
    if (err) {
      navigate('/claim/error', {
        state: {
          username: normalizeUsername(username) || username.toLowerCase().trim(),
          variant: 'other',
          message: err,
        } satisfies ClaimErrorState,
      });
      return;
    }
    navigate('/claim/email', {
      state: { username: normalizeUsername(username) } satisfies ClaimEmailState,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
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
          Bypass the noise and gatekeepers. Our curated network connects ambitious founders, investors, and creators
          directly with the individuals who can accelerate their vision.
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
        <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white blur-[2px] opacity-50 group-hover:w-1/2 group-hover:opacity-80 group-focus-within:w-3/4 group-focus-within:opacity-100 transition-all duration-500 z-0"></div>

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
                  isFocused ? { filter: ['blur(12px)', 'blur(0px)'], opacity: [0, 1] } : { filter: 'blur(0px)', opacity: 1 }
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
  );
}
