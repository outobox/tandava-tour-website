import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request } from "express";

const isProd = process.env.NODE_ENV === "production";

function realIpKey(req: Request): string {
  const fwd = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim();
  return fwd || ipKeyGenerator(req.ip ?? "unknown");
}

const standardOpts = {
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: realIpKey,
  message: { error: "Too many requests. Please try again later." },
} as const;

export const generalApiLimiter = rateLimit({
  ...standardOpts,
  windowMs: 60 * 1000,
  max: isProd ? 200 : 1000,
});

export const adminLoginLimiter = rateLimit({
  ...standardOpts,
  windowMs: 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Please wait a minute and try again." },
});

export const writeOpLimiter = rateLimit({
  ...standardOpts,
  windowMs: 60 * 1000,
  max: 60,
  message: { error: "Too many write requests. Please slow down." },
});

export const uploadLimiter = rateLimit({
  ...standardOpts,
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { error: "Upload rate limit exceeded. Please wait a few minutes." },
});
