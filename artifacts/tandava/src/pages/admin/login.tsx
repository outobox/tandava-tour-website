import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { AlertCircle, Lock } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lockSeconds, setLockSeconds] = useState(0);
  const [, setLocation] = useLocation();

  const loginMutation = useAdminLogin();

  // Countdown timer when locked out
  useEffect(() => {
    if (lockSeconds <= 0) return;
    const t = window.setInterval(() => {
      setLockSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [lockSeconds]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation.mutateAsync({ data: { username, password } });
      setLocation("/admin");
    } catch (err: unknown) {
      // ApiError exposes parsed body on `.data`
      const anyErr = err as { message?: string; status?: number; data?: { error?: string; lockedUntilSeconds?: number } | string | null };
      const data = anyErr?.data;
      const errMsg = (typeof data === "object" && data && "error" in data) ? data.error : undefined;
      const lockedSecs = (typeof data === "object" && data && "lockedUntilSeconds" in data) ? Number(data.lockedUntilSeconds) || 0 : 0;
      setError(errMsg || "Invalid username or password.");
      if (lockedSecs > 0) {
        setLockSeconds(lockedSecs);
      }
    }
  };

  const lockedNow = lockSeconds > 0;
  const lockMinutes = Math.floor(lockSeconds / 60);
  const lockSecsRem = lockSeconds % 60;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}generated/section-bg-2.png)` }}
      />
      <div className="absolute inset-0 pattern-leaf opacity-30 pointer-events-none" />

      <div className="max-w-md w-full glass-card-gold p-8 rounded-sm shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl" />
            <img
              src={`${import.meta.env.BASE_URL}tandava-logo.jpg`}
              alt="Tandava Tour Company"
              className="relative w-20 h-20 rounded-full border border-primary/50 object-cover gold-glow"
            />
          </div>
          <h1 className="font-serif text-3xl text-gradient-gold mb-1">Atelier Access</h1>
          <p className="text-xs text-muted-foreground tracking-[0.3em] uppercase">Admin Control Room</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-sm mb-6 text-sm flex items-start gap-2">
            {lockedNow ? <Lock size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
            <span>{error}</span>
          </div>
        )}

        {lockedNow && (
          <div className="bg-card border border-border px-4 py-3 rounded-sm mb-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Try again in</p>
            <p className="font-serif text-2xl text-primary">
              {String(lockMinutes).padStart(2, "0")}:{String(lockSecsRem).padStart(2, "0")}
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={lockedNow}
              className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm disabled:opacity-60"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={lockedNow}
              className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm disabled:opacity-60"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending || lockedNow}
            className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-sm"
          >
            {loginMutation.isPending ? "Authenticating..." : lockedNow ? "Locked" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
