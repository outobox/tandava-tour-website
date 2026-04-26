import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, instagramPostsTable } from "@workspace/db";
import {
  CreateInstagramPostBody,
  UpdateInstagramPostBody,
  UpdateInstagramPostParams,
  DeleteInstagramPostParams,
  ListInstagramPostsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";
import { writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.get("/instagram-posts", async (req, res): Promise<void> => {
  const params = ListInstagramPostsQueryParams.safeParse(req.query);
  const includeInactive = params.success && params.data.includeInactive === true;

  const rows = includeInactive
    ? await db
        .select()
        .from(instagramPostsTable)
        .orderBy(asc(instagramPostsTable.displayOrder), desc(instagramPostsTable.createdAt))
    : await db
        .select()
        .from(instagramPostsTable)
        .where(eq(instagramPostsTable.isActive, true))
        .orderBy(asc(instagramPostsTable.displayOrder), desc(instagramPostsTable.createdAt));

  res.json(rows);
});

router.post("/admin/instagram-posts", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateInstagramPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(instagramPostsTable)
    .values({
      title: parsed.data.title,
      caption: parsed.data.caption ?? null,
      imageUrl: parsed.data.imageUrl,
      postUrl: parsed.data.postUrl,
      displayOrder: parsed.data.displayOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
    })
    .returning();

  res.status(201).json(row);
});

router.put("/admin/instagram-posts/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateInstagramPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateInstagramPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(instagramPostsTable)
    .set({
      title: parsed.data.title,
      caption: parsed.data.caption ?? null,
      imageUrl: parsed.data.imageUrl,
      postUrl: parsed.data.postUrl,
      displayOrder: parsed.data.displayOrder ?? 0,
      isActive: parsed.data.isActive ?? true,
      updatedAt: new Date(),
    })
    .where(eq(instagramPostsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Instagram post not found" });
    return;
  }
  res.json(row);
});

router.delete("/admin/instagram-posts/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteInstagramPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(instagramPostsTable)
    .where(eq(instagramPostsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Instagram post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
