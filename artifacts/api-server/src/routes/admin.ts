import { Router, type IRouter } from "express";
import { sql } from "drizzle-orm";
import {
  db,
  packagesTable,
  vehiclesTable,
  galleryImagesTable,
  reviewsTable,
} from "@workspace/db";
import { AdminLoginBody } from "@workspace/api-zod";
import {
  ADMIN_USERNAME,
  requireAdmin,
  verifyAdminPassword,
  setAdminPassword,
  getLockoutInfo,
  recordFailedAttempt,
  clearFailedAttempts,
} from "../lib/adminAuth";
import { adminLoginLimiter, writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.post("/admin/login", adminLoginLimiter, async (req, res): Promise<void> => {
  // Lockout check first
  const lock = getLockoutInfo(req);
  if (lock.locked) {
    const minutes = Math.ceil(lock.retryAfterSeconds / 60);
    res.status(429).json({
      error: `Too many failed attempts. Try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      lockedUntilSeconds: lock.retryAfterSeconds,
    });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid username or password." });
    return;
  }

  const { username, password } = parsed.data;

  const usernameOk = username === ADMIN_USERNAME;
  const passwordOk = usernameOk ? await verifyAdminPassword(password) : false;

  if (!usernameOk || !passwordOk) {
    const result = recordFailedAttempt(req);
    req.log.warn({ username, remaining: result.remaining }, "Invalid admin login attempt");

    if (result.locked) {
      const minutes = Math.ceil(result.retryAfterSeconds / 60);
      res.status(429).json({
        error: `Too many failed attempts. Try again after ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        lockedUntilSeconds: result.retryAfterSeconds,
      });
      return;
    }

    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  // Successful login — reset attempt counter
  clearFailedAttempts(req);

  req.session.admin = { username };
  res.json({ username, authenticated: true });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie("tandava.sid");
      res.sendStatus(204);
    });
  } else {
    res.sendStatus(204);
  }
});

router.get("/admin/me", async (req, res): Promise<void> => {
  if (!req.session?.admin?.username) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ username: req.session.admin.username, authenticated: true });
});

// Change password — requires current session + current password verification.
// Note: in-process update only. For permanent change across restarts,
// set ADMIN_PASSWORD_HASH env var to the new bcrypt hash.
router.post("/admin/change-password", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const body = req.body as { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown };

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: "New password must be at least 8 characters." });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "New password and confirmation do not match." });
    return;
  }

  if (newPassword === currentPassword) {
    res.status(400).json({ error: "New password must be different from the current password." });
    return;
  }

  const ok = await verifyAdminPassword(currentPassword);
  if (!ok) {
    req.log.warn({ username: req.session.admin?.username }, "Change password: invalid current password");
    res.status(401).json({ error: "Current password is incorrect." });
    return;
  }

  await setAdminPassword(newPassword);
  req.log.info({ username: req.session.admin?.username }, "Admin password changed");

  // Force logout — user must re-authenticate with new password
  req.session.destroy(() => {
    res.clearCookie("tandava.sid");
    res.json({ success: true, message: "Password updated. Please log in again." });
  });
});

router.get("/admin/dashboard-stats", requireAdmin, async (_req, res): Promise<void> => {
  const [pkgTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${packagesTable.active} = true)::int`,
    })
    .from(packagesTable);

  const [vehTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${vehiclesTable.active} = true)::int`,
    })
    .from(vehiclesTable);

  const [galTotals] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(galleryImagesTable);

  const [revTotals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      avg: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)::float`,
    })
    .from(reviewsTable);

  res.json({
    totalPackages: pkgTotals?.total ?? 0,
    activePackages: pkgTotals?.active ?? 0,
    totalVehicles: vehTotals?.total ?? 0,
    activeVehicles: vehTotals?.active ?? 0,
    totalGalleryImages: galTotals?.total ?? 0,
    totalReviews: revTotals?.total ?? 0,
    averageRating: Number((revTotals?.avg ?? 0).toFixed(2)),
  });
});

export default router;
