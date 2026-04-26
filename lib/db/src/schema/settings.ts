import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull().default("TANDAVA TOUR COMPANY"),
  tagline: text("tagline").notNull().default("Pack Your Bags, We'll Do the Rest!"),
  phonePrimary: text("phone_primary").notNull().default("+91 7012393250"),
  phoneSecondary: text("phone_secondary").notNull().default("+91 9526041005"),
  whatsappNumber: text("whatsapp_number").notNull().default("917012393250"),
  email: text("email").notNull().default("tandavatours@gmail.com"),
  location: text("location").notNull().default("Thiruvananthapuram, Kerala"),
  instagramUrl: text("instagram_url").notNull().default("https://www.instagram.com/tandava_tour_company/"),
  facebookUrl: text("facebook_url").notNull().default(""),
  youtubeUrl: text("youtube_url").notNull().default(""),
  aboutText: text("about_text").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type SettingsRow = typeof settingsTable.$inferSelect;
export type InsertSettings = typeof settingsTable.$inferInsert;
