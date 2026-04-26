import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const instagramPostsTable = pgTable("instagram_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption"),
  imageUrl: text("image_url").notNull(),
  postUrl: text("post_url").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type InstagramPostRow = typeof instagramPostsTable.$inferSelect;
export type InsertInstagramPost = typeof instagramPostsTable.$inferInsert;
