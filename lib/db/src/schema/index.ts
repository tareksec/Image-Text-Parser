import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ─── Enums ──────────────────────────────────────────────────────────────────

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const memberTierEnum = pgEnum("member_tier", [
  "basic",
  "professional",
  "corporate",
]);

export const memberStatusEnum = pgEnum("member_status", [
  "pending",
  "active",
  "rejected",
]);

// ─── Users (Admin) ──────────────────────────────────────────────────────────

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

// ─── Posts ───────────────────────────────────────────────────────────────────

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  content: text("content").notNull().default(""),
  coverImageUrl: text("cover_image_url"),
  tags: text("tags").notNull().default(""),
  published: boolean("published").notNull().default(false),
  authorId: integer("author_id").references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPostSchema = createInsertSchema(postsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Post = typeof postsTable.$inferSelect;

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 255 }),
  company: varchar("company", { length: 255 }),
  rating: integer("rating").notNull().default(5),
  message: text("message").notNull(),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;

// ─── Events ──────────────────────────────────────────────────────────────────

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  venue: varchar("venue", { length: 500 }).notNull(),
  seats: integer("seats"),
  registrationLink: text("registration_link"),
  description: text("description").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEventSchema = createInsertSchema(eventsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof eventsTable.$inferSelect;

// ─── Members (Join BEC) ─────────────────────────────────────────────────────

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  designation: varchar("designation", { length: 255 }),
  tier: memberTierEnum("tier").notNull().default("basic"),
  status: memberStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;

// ─── Team Members ───────────────────────────────────────────────────────────

export const teamMembersTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 255 }).notNull(),
  photoUrl: text("photo_url"),
  linkedinUrl: text("linkedin_url"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeamMemberSchema = createInsertSchema(
  teamMembersTable,
).omit({
  id: true,
  createdAt: true,
});
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembersTable.$inferSelect;

// ─── Site Stats ─────────────────────────────────────────────────────────────

export const siteStatsTable = pgTable("site_stats", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  icon: varchar("icon", { length: 100 }),
  displayOrder: integer("display_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteStatSchema = createInsertSchema(siteStatsTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertSiteStat = z.infer<typeof insertSiteStatSchema>;
export type SiteStat = typeof siteStatsTable.$inferSelect;

// ─── Event Registrations ────────────────────────────────────────────────────

export const eventRegistrationsTable = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => eventsTable.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEventRegistrationSchema = createInsertSchema(
  eventRegistrationsTable,
).omit({
  id: true,
  createdAt: true,
});
export type InsertEventRegistration = z.infer<
  typeof insertEventRegistrationSchema
>;
export type EventRegistration = typeof eventRegistrationsTable.$inferSelect;

// ─── Newsletter Subscribers ──────────────────────────────────────────────────

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(
  newsletterSubscribersTable,
).omit({
  id: true,
  createdAt: true,
});
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export type NewsletterSubscriber = typeof newsletterSubscribersTable.$inferSelect;

// ─── Contact Messages ───────────────────────────────────────────────────────

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(
  contactMessagesTable,
).omit({
  id: true,
  createdAt: true,
});
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;