import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, vehiclesTable } from "@workspace/db";
import {
  CreateVehicleBody,
  UpdateVehicleBody,
  UpdateVehicleParams,
  DeleteVehicleParams,
  ListVehiclesQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";
import { writeOpLimiter } from "../middlewares/rateLimit";

const router: IRouter = Router();

router.get("/vehicles", async (req, res): Promise<void> => {
  const params = ListVehiclesQueryParams.safeParse(req.query);
  const includeInactive = params.success && params.data.includeInactive === true;

  const rows = includeInactive
    ? await db.select().from(vehiclesTable).orderBy(asc(vehiclesTable.sortOrder), desc(vehiclesTable.createdAt))
    : await db
        .select()
        .from(vehiclesTable)
        .where(eq(vehiclesTable.active, true))
        .orderBy(asc(vehiclesTable.sortOrder), desc(vehiclesTable.createdAt));

  res.json(rows);
});

router.post("/admin/vehicles", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(vehiclesTable)
    .values({
      name: parsed.data.name,
      vehicleType: parsed.data.vehicleType,
      seatingCapacity: parsed.data.seatingCapacity,
      airConditioned: parsed.data.airConditioned,
      musicSystem: parsed.data.musicSystem,
      imageUrl: parsed.data.imageUrl,
      description: parsed.data.description,
      features: parsed.data.features ?? [],
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(row);
});

router.put("/admin/vehicles/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateVehicleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .update(vehiclesTable)
    .set({
      name: parsed.data.name,
      vehicleType: parsed.data.vehicleType,
      seatingCapacity: parsed.data.seatingCapacity,
      airConditioned: parsed.data.airConditioned,
      musicSystem: parsed.data.musicSystem,
      imageUrl: parsed.data.imageUrl,
      description: parsed.data.description,
      features: parsed.data.features ?? [],
      active: parsed.data.active ?? true,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .where(eq(vehiclesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.json(row);
});

router.delete("/admin/vehicles/:id", writeOpLimiter, requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteVehicleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(vehiclesTable)
    .where(eq(vehiclesTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
