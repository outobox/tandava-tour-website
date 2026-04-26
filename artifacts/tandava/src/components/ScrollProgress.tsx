import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] pointer-events-none">
      <div
        className="h-full origin-left transition-[width] duration-100"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(47 67% 47%), hsl(167 60% 40%), hsl(47 67% 60%))",
          boxShadow: "0 0 10px hsla(47, 67%, 47%, 0.6)",
        }}
      />
    </div>
  );
}
