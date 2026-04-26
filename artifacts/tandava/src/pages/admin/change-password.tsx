import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { getAdminMeQueryKey } from "@workspace/api-client-react";
import { ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

// Prefer VITE_API_URL when the API is hosted on a different origin (split
// Vercel deployment). Fall back to the SPA base URL for same-origin setups.
const API_BASE = import.meta.env.VITE_API_URL
  ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, "")}/api`
  : `${import.meta.env.BASE_URL.replace(/\/$/, "")}/api`;

export default function AdminChangePassword() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Could not update password.");
        return;
      }

      setSuccess(data?.message || "Password updated. Logging you out…");
      // Server destroyed our session; redirect to login.
      window.setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation("/admin/login");
      }, 1400);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <ShieldCheck className="text-primary" size={22} />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-foreground">Change Password</h1>
          <p className="text-sm text-muted-foreground">Update your admin credentials securely.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-6 rounded-sm">
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-sm text-sm flex items-start gap-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 px-4 py-3 rounded-sm text-sm flex items-start gap-2">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Current Password</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
          />
          <p className="text-xs text-muted-foreground mt-1.5">Minimum 8 characters.</p>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Confirm New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full bg-background border border-border p-3 text-foreground focus:outline-none focus:border-primary transition-colors rounded-sm"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !!success}
          className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-sm"
        >
          <KeyRound size={16} />
          {submitting ? "Updating…" : success ? "Updated" : "Update Password"}
        </button>

        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          You'll be logged out automatically after a successful change.
        </p>
      </form>
    </div>
  );
}
