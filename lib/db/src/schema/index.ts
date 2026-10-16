import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const timestamps = {
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const productsTable = pgTable("products", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	sku: text("sku").notNull().unique(),
	category: text("category").notNull(),
	status: text("status").notNull().default("Draft"),
	description: text("description").notNull().default(""),
	...timestamps,
});

export const categoriesTable = pgTable("categories", {
	id: text("id").primaryKey(),
	name: text("name").notNull().unique(),
	description: text("description").notNull().default(""),
	active: boolean("active").notNull().default(true),
	...timestamps,
});

export const sitePagesTable = pgTable("site_pages", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	path: text("path").notNull().unique(),
	summary: text("summary").notNull().default(""),
	body: text("body").notNull().default(""),
	status: text("status").notNull().default("Draft"),
	...timestamps,
});

export const adminSessionsTable = pgTable("admin_sessions", {
	tokenHash: text("token_hash").primaryKey(),
	username: text("username").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductRecord = typeof productsTable.$inferSelect;
export type CategoryRecord = typeof categoriesTable.$inferSelect;
export type SitePageRecord = typeof sitePagesTable.$inferSelect;