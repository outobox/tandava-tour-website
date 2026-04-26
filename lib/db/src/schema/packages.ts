import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  duration: text("duration").notNull(),
  startingPrice: integer("starting_price").notNull(),
  description: text("description").notNull(),
  includedServices: text("included_services").array().notNull().default([]),
  highlights: text("highlights").array().notNull().default([]),
  imageUrl: text("image_url").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PackageRow = typeof packagesTable.$inferSelect;
export type InsertPackage = typeof packagesTable.$inferInsert;
