import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, packagesTable } from "@workspace/db";
import {
  CreatePackageBody,
  UpdatePackageBody,
  UpdatePackageParams,
  DeletePackageParams,
  ListPackagesQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";
import { writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.get("/packages", async (req, res): Promise<void> => {
  const params = ListPackagesQueryParams.safeParse(req.query);
  const includeInactive = params.success && params.data.includeInactive === true;

  const rows = includeInactive
    ? await db.select().from(packagesTable).orderBy(asc(packagesTable.sortOrder), desc(packagesTable.createdAt))
    : await db
        .select()
        .from(packagesTable)
        .where(eq(packagesTable.active, true))
        .orderBy(asc(packagesTable.sortOrder), desc(packagesTable.createdAt));

  res.json(rows);
});

router.post("/admin/packages", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(packagesTable)
    .values({
      title: parsed.data.title,
      destination: parsed.data.destination,
      duration: parsed.data.duration,
      startingPrice: parsed.data.startingPrice,
      description: parsed.data.description,
      includedServices: parsed.data.includedServices ?? [],
      highlights: parsed.data.highlights ?? [],
      imageUrl: parsed.data.imageUrl,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(row);
});

router.put("/admin/packages/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(packagesTable)
    .set({
      title: parsed.data.title,
      destination: parsed.data.destination,
      duration: parsed.data.duration,
      startingPrice: parsed.data.startingPrice,
      description: parsed.data.description,
      includedServices: parsed.data.includedServices ?? [],
      highlights: parsed.data.highlights ?? [],
      imageUrl: parsed.data.imageUrl,
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .where(eq(packagesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.json(row);
});

router.delete("/admin/packages/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = DeletePackageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(packagesTable)
    .where(eq(packagesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Package not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
