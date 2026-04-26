import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, galleryImagesTable } from "@workspace/db";
import {
  CreateGalleryImageBody,
  DeleteGalleryImageParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";
import { writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(galleryImagesTable)
    .orderBy(asc(galleryImagesTable.sortOrder), desc(galleryImagesTable.createdAt));
  res.json(rows);
});

router.post("/admin/gallery", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(galleryImagesTable)
    .values({
      title: parsed.data.title ?? null,
      caption: parsed.data.caption ?? null,
      imageUrl: parsed.data.imageUrl,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(row);
});

router.delete("/admin/gallery/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteGalleryImageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(galleryImagesTable)
    .where(eq(galleryImagesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Gallery image not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
