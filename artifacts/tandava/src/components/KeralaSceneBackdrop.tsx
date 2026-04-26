import { useEffect, useState } from "react";

/**
 * Cinematic Kerala SVG backdrop for the home hero.
 * Pure CSS + SVG (no WebGL) so it stays light on every device.
 * Layers (back → front):
 *   sky gradient → distant hills → mist → backwater reflection →
 *   slow houseboat → coconut palms (L+R) → curved road → travelling vehicle →
 *   gold dust particles → soft vignette
 */
export function KeralaSceneBackdrop() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const particleCount = reduced ? 0 : isMobile ? 14 : 32;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,_hsla(47,67%,47%,0.22)_0%,_transparent_55%),radial-gradient(ellipse_at_50%_85%,_hsla(167,60%,30%,0.20)_0%,_transparent_60%),linear-gradient(180deg,_#0a0a0a_0%,_#0b0b0b_55%,_#070707_100%)]" />

      {/* Sun / Moon halo behind logo */}
      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      {/* Cinematic SVG layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(152, 30%, 8%)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="hsl(0, 0%, 4%)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(167, 60%, 12%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(0, 0%, 4%)" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="hsla(47, 67%, 47%, 0.7)" />
            <stop offset="60%" stopColor="hsla(47, 67%, 47%, 0.25)" />
            <stop offset="100%" stopColor="hsla(47, 67%, 47%, 0)" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsla(47,67%,70%,0.45)" />
            <stop offset="100%" stopColor="hsla(47,67%,47%,0)" />
          </radialGradient>
        </defs>

        {/* Distant hill silhouettes */}
        <path
          d="M0 540 L 0 600 L 1440 600 L 1440 520
             Q 1340 470 1240 510
             Q 1140 555 1040 510
             Q 960 470 880 510
             Q 800 555 720 520
             Q 640 480 560 520
             Q 480 555 380 510
             Q 280 470 180 520
             Q 100 555 0 540 Z"
          fill="url(#hillGrad)"
        />

        {/* Backwater reflection */}
        <rect x="0" y="600" width="1440" height="300" fill="url(#waterGrad)" />

        {/* Water shimmer lines */}
        <g stroke="hsla(47,67%,47%,0.25)" strokeWidth="1" fill="none" className="kerala-shimmer">
          <line x1="0" y1="650" x2="1440" y2="650" />
          <line x1="0" y1="690" x2="1440" y2="690" />
          <line x1="0" y1="730" x2="1440" y2="730" />
          <line x1="0" y1="770" x2="1440" y2="770" />
        </g>

        {/* Slow drifting houseboat */}
        <g className="kerala-boat" opacity="0.85">
          <g transform="translate(0 0)">
            {/* hull */}
            <path d="M0 600 q60 -10 120 0 v22 h-120 z" fill="#050505" />
            {/* cabin */}
            <rect x="14" y="558" width="92" height="44" fill="#0a0a0a" />
            {/* roof curve */}
            <path d="M8 558 q52 -28 104 0 z" fill="#0a0a0a" />
            {/* tiny warm window glow */}
            <rect x="32" y="572" width="14" height="10" fill="hsla(47,67%,47%,0.55)" />
            <rect x="56" y="572" width="14" height="10" fill="hsla(47,67%,47%,0.55)" />
            <rect x="80" y="572" width="14" height="10" fill="hsla(47,67%,47%,0.55)" />
          </g>
        </g>

        {/* Coconut palms — left cluster */}
        <g fill="#050505">
          <PalmSilhouette x={70} y={640} scale={1.15} />
          <PalmSilhouette x={170} y={670} scale={0.85} />
          <PalmSilhouette x={250} y={650} scale={1} />
        </g>

        {/* Coconut palms — right cluster */}
        <g fill="#050505">
          <PalmSilhouette x={1190} y={665} scale={0.95} />
          <PalmSilhouette x={1290} y={640} scale={1.2} />
          <PalmSilhouette x={1390} y={665} scale={0.85} />
        </g>

        {/* Curved road line going up to logo */}
        <path
          d="M720 900 Q 700 760 720 620 Q 740 520 720 420"
          stroke="url(#roadGrad)"
          strokeWidth="2.5"
          fill="none"
          className="kerala-road"
        />
        <path
          d="M720 900 Q 700 760 720 620 Q 740 520 720 420"
          stroke="hsla(47,67%,47%,0.18)"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />

        {/* Travelling vehicle silhouette along the road */}
        {!reduced && (
          <g className="kerala-vehicle">
            <rect x="-12" y="-7" width="24" height="10" rx="2" fill="#0a0a0a" />
            <rect x="-9" y="-12" width="18" height="6" rx="2" fill="#0a0a0a" />
            <circle cx="-7" cy="4" r="2.2" fill="#050505" />
            <circle cx="7" cy="4" r="2.2" fill="#050505" />
            {/* head light */}
            <circle cx="11" cy="-1" r="3" fill="hsla(47,67%,75%,0.65)" />
          </g>
        )}

        {/* Birds in flight */}
        {!reduced && (
          <g fill="none" stroke="hsl(45,30%,82%)" strokeWidth="1.4" opacity="0.6" className="kerala-birds">
            <path d="M900 250 q5 -6 10 0 q5 -6 10 0" />
            <path d="M940 240 q4 -5 8 0 q4 -5 8 0" />
            <path d="M980 265 q4 -5 8 0 q4 -5 8 0" />
            <path d="M1020 245 q4 -5 8 0 q4 -5 8 0" />
          </g>
        )}

        {/* Subtle Kerala kasavu border accent at the very bottom */}
        <line x1="0" y1="894" x2="1440" y2="894" stroke="hsla(47,67%,47%,0.45)" strokeWidth="1.2" />
        <line x1="0" y1="898" x2="1440" y2="898" stroke="hsla(47,67%,47%,0.18)" strokeWidth="0.6" />
      </svg>

      {/* Mist layer (CSS) */}
      {!reduced && <div className="absolute inset-x-0 top-[58%] h-40 kerala-mist pointer-events-none" />}

      {/* Gold dust particles */}
      {particleCount > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: particleCount }).map((_, i) => (
            <span
              key={i}
              className="kerala-particle"
              style={{
                left: `${(i * 41) % 100}%`,
                animationDelay: `${(i % 9) * 0.7}s`,
                animationDuration: `${7 + (i % 6)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Vignette + bottom fade so hero text reads cleanly */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.55)_85%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </div>
  );
}

function PalmSilhouette({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 q-4 -70 -2 -150 q1 -30 4 -50" stroke="#050505" strokeWidth="6" fill="none" />
      <path d="M2 -200 q42 -10 75 -50 q-32 0 -75 38" fill="#050505" />
      <path d="M2 -200 q-42 -10 -75 -50 q32 0 75 38" fill="#050505" />
      <path d="M2 -200 q38 -50 95 -55 q-42 28 -92 64" fill="#050505" />
      <path d="M2 -200 q-38 -50 -95 -55 q42 28 92 64" fill="#050505" />
      <path d="M2 -200 q5 -60 38 -85 q-15 38 -30 80" fill="#050505" />
      <path d="M2 -200 q-5 -60 -38 -85 q15 38 30 80" fill="#050505" />
      {/* coconuts */}
      <circle cx="-2" cy="-200" r="3" fill="#050505" />
      <circle cx="6" cy="-198" r="2.5" fill="#050505" />
    </g>
  );
}
