import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "tandava-intro-shown";

export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"hello" | "tagline" | "tail">("hello");
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const alreadySeen = (() => {
      try {
        return window.sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        return false;
      }
    })();
    const skipViaQuery = /[?&]noIntro\b/.test(window.location.search);
    if (alreadySeen || skipViaQuery) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      return;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const mobile = window.innerWidth < 768;
    setReduced(reduceMotion);
    setIsMobile(mobile);
    setVisible(true);

    const totalMs = reduceMotion ? 1200 : mobile ? 2200 : 3500;
    const t1 = window.setTimeout(() => setPhase("tagline"), Math.round(totalMs * 0.34));
    const t2 = window.setTimeout(() => setPhase("tail"), Math.round(totalMs * 0.66));
    const t3 = window.setTimeout(() => {
      setVisible(false);
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, totalMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  function skip() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="fixed inset-0 z-[100] overflow-hidden bg-background"
        >
          {/* Sky gradient + soft moon glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_hsla(47,67%,47%,0.18)_0%,_transparent_55%),radial-gradient(ellipse_at_50%_100%,_hsla(167,60%,30%,0.15)_0%,_transparent_60%)]" />

          {/* Cinematic Kerala silhouettes */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <linearGradient id="introWaterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(167, 60%, 14%)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(0, 0%, 4%)" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="introRoadGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="hsla(47, 67%, 47%, 0.65)" />
                <stop offset="100%" stopColor="hsla(47, 67%, 47%, 0)" />
              </linearGradient>
            </defs>

            {/* Water reflection */}
            <rect x="0" y="600" width="1440" height="300" fill="url(#introWaterGrad)" />

            {/* Distant houseboat silhouette */}
            {!reduced && (
              <g className="intro-boat" opacity="0.55">
                <path d="M620 590 q40 -8 80 0 v18 h-80 z" fill="#0b0b0b" />
                <rect x="630" y="560" width="60" height="32" fill="#0b0b0b" />
                <path d="M625 560 q35 -22 70 0 z" fill="#0b0b0b" />
              </g>
            )}

            {/* Curved road line toward center */}
            <path
              d="M720 900 Q 720 720 720 540"
              stroke="url(#introRoadGrad)"
              strokeWidth="2.5"
              fill="none"
              className="intro-road"
            />

            {/* Coconut palms — left cluster */}
            <g fill="#0b0b0b" opacity="0.95">
              <PalmSilhouette x={80} y={620} scale={1.1} />
              <PalmSilhouette x={180} y={650} scale={0.85} />
              <PalmSilhouette x={260} y={640} scale={1} />
            </g>

            {/* Coconut palms — right cluster */}
            <g fill="#0b0b0b" opacity="0.95">
              <PalmSilhouette x={1180} y={650} scale={0.95} />
              <PalmSilhouette x={1280} y={620} scale={1.15} />
              <PalmSilhouette x={1380} y={650} scale={0.9} />
            </g>

            {/* Birds */}
            {!reduced && (
              <g fill="none" stroke="hsl(45,30%,80%)" strokeWidth="1.2" opacity="0.7" className="intro-birds">
                <path d="M900 280 q5 -6 10 0 q5 -6 10 0" />
                <path d="M940 270 q4 -5 8 0 q4 -5 8 0" />
                <path d="M970 295 q4 -5 8 0 q4 -5 8 0" />
              </g>
            )}
          </svg>

          {/* Mist layer */}
          {!reduced && (
            <div className="absolute inset-x-0 top-[55%] h-40 intro-mist" />
          )}

          {/* Gold dust particles */}
          {!reduced && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: isMobile ? 14 : 28 }).map((_, i) => (
                <span
                  key={i}
                  className="intro-particle"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    animationDelay: `${(i % 7) * 0.4}s`,
                    animationDuration: `${6 + (i % 5)}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Center stack: logo + text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-7"
            >
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl animate-pulse" />
              <div className="absolute -inset-4 rounded-full border border-primary/20 intro-ring" />
              <div className="absolute -inset-9 rounded-full border border-primary/10 intro-ring-2" />
              <img
                src={`${import.meta.env.BASE_URL}tandava-logo.jpg`}
                alt="Tandava Tour Company"
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border border-primary/50 object-cover gold-glow"
              />
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === "hello" && (
                <motion.div
                  key="hello"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.55 }}
                  className="font-serif text-xl md:text-3xl tracking-[0.18em] text-foreground/90"
                >
                  Welcome to{" "}
                  <span className="text-gradient-gold">Tandava Tour Company</span>
                </motion.div>
              )}
              {phase === "tagline" && (
                <motion.div
                  key="tagline"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.55 }}
                  className="font-serif italic text-xl md:text-3xl text-gradient-gold tracking-wide"
                >
                  "Pack Your Bags, We'll Do the Rest!"
                </motion.div>
              )}
              {phase === "tail" && (
                <motion.div
                  key="tail"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.55 }}
                  className="text-sm md:text-base uppercase tracking-[0.45em] text-foreground/80"
                >
                  Premium Kerala Travel Experiences
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 w-44 h-[2px] bg-border overflow-hidden rounded-full">
              <div className="h-full w-full shimmer-gold" />
            </div>
          </div>

          {/* Skip button */}
          <button
            type="button"
            onClick={skip}
            className="absolute bottom-6 right-6 md:bottom-8 md:right-8 px-4 py-2 text-[11px] md:text-xs uppercase tracking-[0.25em] text-foreground/70 hover:text-primary border border-border/60 hover:border-primary/60 rounded-sm bg-background/40 backdrop-blur-sm transition-colors"
            aria-label="Skip introduction"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PalmSilhouette({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* trunk */}
      <path d="M0 0 q-4 -60 -2 -130 q1 -30 4 -50" stroke="#0b0b0b" strokeWidth="6" fill="none" />
      {/* fronds */}
      <path d="M2 -180 q40 -10 70 -45 q-30 0 -70 35" fill="#0b0b0b" />
      <path d="M2 -180 q-40 -10 -70 -45 q30 0 70 35" fill="#0b0b0b" />
      <path d="M2 -180 q35 -45 90 -50 q-40 25 -88 60" fill="#0b0b0b" />
      <path d="M2 -180 q-35 -45 -90 -50 q40 25 88 60" fill="#0b0b0b" />
      <path d="M2 -180 q5 -55 35 -80 q-15 35 -28 75" fill="#0b0b0b" />
      <path d="M2 -180 q-5 -55 -35 -80 q15 35 28 75" fill="#0b0b0b" />
    </g>
  );
}
