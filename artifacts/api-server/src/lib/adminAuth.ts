import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { logger } from "./logger";

declare module "express-session" {
  interface SessionData {
    admin?: { username: string };
  }
}

const isProd = process.env.NODE_ENV === "production";

function resolveAdminUsername(): string {
  const u = process.env.ADMIN_USERNAME?.trim();
  if (u) return u;
  if (isProd) {
    throw new Error(
      "ADMIN_USERNAME environment variable is required in production. " +
        "Set it as a Replit Secret before deploying.",
    );
  }
  logger.warn("ADMIN_USERNAME not set — defaulting to 'admin' for local development.");
  return "admin";
}

function resolveInitialPasswordHash(): string {
  const fromHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (fromHash) return fromHash;

  const plain = process.env.ADMIN_PASSWORD?.trim();
  if (plain) {
    if (plain.length < 8) {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters long.");
    }
    return bcrypt.hashSync(plain, 12);
  }

  if (isProd) {
    throw new Error(
      "Either ADMIN_PASSWORD_HASH or ADMIN_PASSWORD environment variable is required " +
        "in production. Set it as a Replit Secret before deploying.",
    );
  }

  // Dev convenience: generate a random throwaway password and log it once
  const ephemeral = randomBytes(8).toString("hex");
  logger.warn(
    `ADMIN_PASSWORD not set — generated ephemeral dev password: "${ephemeral}". ` +
      `Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH as an env secret to make it persistent.`,
  );
  return bcrypt.hashSync(ephemeral, 10);
}

export const ADMIN_USERNAME = resolveAdminUsername();

// Mutable so /admin/change-password can update it in-process.
// Persistence beyond restart requires updating ADMIN_PASSWORD_HASH env var.
let currentPasswordHash: string = resolveInitialPasswordHash();

export async function verifyAdminPassword(plain: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, currentPasswordHash);
  } catch {
    return false;
  }
}

export async function setAdminPassword(plain: string): Promise<void> {
  currentPasswordHash = await bcrypt.hash(plain, 12);
}

export function getAdminPasswordHash(): string {
  return currentPasswordHash;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.admin?.username) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// === Brute-force protection: per-IP attempt counter with 5-min lockout ===
// 3 failed attempts within a 5-minute window → lock that IP for 5 minutes.

interface AttemptRecord {
  count: number;
  lockedUntil: number; // epoch ms; 0 means not locked
  firstAttempt: number;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;

const attempts = new Map<string, AttemptRecord>();

function clientKey(req: Request): string {
  const fwd = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
  return fwd || req.ip || "unknown";
}

export function getLockoutInfo(req: Request): { locked: boolean; retryAfterSeconds: number } {
  const key = clientKey(req);
  const rec = attempts.get(key);
  if (!rec) return { locked: false, retryAfterSeconds: 0 };
  const now = Date.now();
  if (rec.lockedUntil > now) {
    return { locked: true, retryAfterSeconds: Math.ceil((rec.lockedUntil - now) / 1000) };
  }
  return { locked: false, retryAfterSeconds: 0 };
}

export function recordFailedAttempt(req: Request): { locked: boolean; retryAfterSeconds: number; remaining: number } {
  const key = clientKey(req);
  const now = Date.now();
  const existing = attempts.get(key);
  let rec: AttemptRecord;

  if (!existing || now - existing.firstAttempt > ATTEMPT_WINDOW_MS) {
    rec = { count: 1, lockedUntil: 0, firstAttempt: now };
  } else {
    rec = { ...existing, count: existing.count + 1 };
  }

  if (rec.count >= MAX_ATTEMPTS) {
    rec.lockedUntil = now + LOCKOUT_MS;
  }

  attempts.set(key, rec);

  return {
    locked: rec.lockedUntil > now,
    retryAfterSeconds: rec.lockedUntil > now ? Math.ceil((rec.lockedUntil - now) / 1000) : 0,
    remaining: Math.max(0, MAX_ATTEMPTS - rec.count),
  };
}

export function clearFailedAttempts(req: Request): void {
  attempts.delete(clientKey(req));
}

// Periodic cleanup so the map doesn't grow unbounded
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of attempts.entries()) {
    if (v.lockedUntil < now && now - v.firstAttempt > ATTEMPT_WINDOW_MS) {
      attempts.delete(k);
    }
  }
}, 60 * 1000).unref?.();
