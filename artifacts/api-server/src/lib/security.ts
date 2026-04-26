import { logger } from "./logger";
import { randomBytes } from "crypto";

const isProd = process.env.NODE_ENV === "production";

export function getSessionSecret(): string {
  const fromEnv = process.env.SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  if (isProd) {
    throw new Error(
      "SESSION_SECRET environment variable is required in production " +
        "and must be at least 16 characters long. " +
        "Set it as a Replit Secret before deploying.",
    );
  }

  const ephemeral = randomBytes(32).toString("hex");
  logger.warn(
    "SESSION_SECRET not set — using a randomly generated ephemeral secret for development. " +
      "Sessions will reset on every server restart.",
  );
  return ephemeral;
}

export function getAllowedOrigins(): string[] | null {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw || raw.trim() === "") return null;

  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return list.length > 0 ? list : null;
}

export function isOriginAllowed(origin: string | undefined, allowed: string[] | null): boolean {
  if (!origin) return true;

  if (!allowed) {
    const replitDomain = process.env.REPLIT_DEV_DOMAIN;
    if (replitDomain && origin.includes(replitDomain)) return true;

    const deployDomains = (process.env.REPLIT_DOMAINS ?? "").split(",").map((d) => d.trim()).filter(Boolean);
    for (const d of deployDomains) {
      if (origin.endsWith(d)) return true;
    }

    return !isProd;
  }

  return allowed.some((a) => origin === a || origin.endsWith(a));
}
