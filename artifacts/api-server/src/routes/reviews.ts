import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  CreateReviewBody,
  UpdateReviewBody,
  UpdateReviewParams,
  DeleteReviewParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";
import { writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.get("/reviews", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .orderBy(desc(reviewsTable.createdAt));
  res.json(rows);
});

router.post("/admin/reviews", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(reviewsTable)
    .values({
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      location: parsed.data.location ?? null,
      avatarUrl: parsed.data.avatarUrl ?? null,
    })
    .returning();

  res.status(201).json(row);
});

router.put("/admin/reviews/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(reviewsTable)
    .set({
      authorName: parsed.data.authorName,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      location: parsed.data.location ?? null,
      avatarUrl: parsed.data.avatarUrl ?? null,
    })
    .where(eq(reviewsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(row);
});

router.delete("/admin/reviews/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(reviewsTable)
    .where(eq(reviewsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
