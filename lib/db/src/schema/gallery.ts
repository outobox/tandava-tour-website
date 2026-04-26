import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title"),
  caption: text("caption"),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GalleryImageRow = typeof galleryImagesTable.$inferSelect;
export type InsertGalleryImage = typeof galleryImagesTable.$inferInsert;
