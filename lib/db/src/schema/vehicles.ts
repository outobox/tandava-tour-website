import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  seatingCapacity: integer("seating_capacity").notNull(),
  airConditioned: boolean("air_conditioned").notNull().default(true),
  musicSystem: boolean("music_system").notNull().default(true),
  imageUrl: text("image_url").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull().default([]),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type VehicleRow = typeof vehiclesTable.$inferSelect;
export type InsertVehicle = typeof vehiclesTable.$inferInsert;
