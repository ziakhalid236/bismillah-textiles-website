import { createHash, timingSafeEqual } from "node:crypto";
import { and, asc, eq, gt } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  adminSessionsTable,
  categoriesTable,
  productsTable,
  sitePagesTable,
} from "@workspace/db/schema";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_DURATION_MS,
  clearSessionCookie,
  createSessionToken,
  hashSessionToken,
  passwordMatches,
  requireAdminOrigin,
  requireAdminSession,
  setSessionCookie,
} from "../lib/admin-auth";

const router: IRouter = Router();
const statusSchema = z.enum(["Published", "Draft"]);
const productSchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(160),
  sku: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(120),
  status: statusSchema,
  description: z.string().max(4000),
});
const categorySchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  description: z.string().max(2000),
  active: z.boolean(),
});
const pageSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  path: z.string().trim().regex(/^\/[a-z0-9/-]*$/i).max(200),
  summary: z.string().max(1000),
  body: z.string().max(20000),
  status: statusSchema,
});
const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
});

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;

function constantTimeStringMatch(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function applyLoginLimit(key: string): boolean {
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_LOGIN_ATTEMPTS;
}

function setUpdated<T extends { updatedAt: Date }>(record: T) {
  return { ...record, updated: record.updatedAt.toISOString() };
}

function reportDatabaseError(response: import("express").Response, error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "23505") {
    response.status(409).json({ message: "A record with that name or SKU already exists." });
    return;
  }
  response.status(503).json({ message: "Unable to save changes to admin storage." });
}

router.get("/auth/session", async (request, response) => {
  const token = request.cookies?.[ADMIN_SESSION_COOKIE];
  if (typeof token !== "string") {
    response.status(401).json({ message: "Authentication required." });
    return;
  }
  try {
    const [session] = await db
      .select({ username: adminSessionsTable.username })
      .from(adminSessionsTable)
      .where(
        and(
          eq(adminSessionsTable.tokenHash, hashSessionToken(token)),
          gt(adminSessionsTable.expiresAt, new Date()),
        ),
      )
      .limit(1);
    if (!session) {
      clearSessionCookie(response);
      response.status(401).json({ message: "Session expired." });
      return;
    }
    response.json({ username: session.username });
  } catch {
    response.status(503).json({ message: "Admin storage is unavailable." });
  }
});

router.post("/auth/login", requireAdminOrigin, async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  const username = process.env.ADMIN_USERNAME;
  const encodedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!username || !encodedHash) {
    response.status(503).json({ message: "Admin authentication is not configured." });
    return;
  }
  if (applyLoginLimit(request.ip ?? "unknown")) {
    response.status(429).json({ message: "Too many sign-in attempts. Try again later." });
    return;
  }
  if (!parsed.success) {
    response.status(400).json({ message: "Enter a valid username and password." });
    return;
  }

  const usernameMatches = constantTimeStringMatch(parsed.data.username, username);
  const passwordValid = passwordMatches(parsed.data.password, encodedHash);
  if (!usernameMatches || !passwordValid) {
    response.status(401).json({ message: "Username or password is incorrect." });
    return;
  }

  try {
    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION_MS);
    await db.insert(adminSessionsTable).values({
      tokenHash: hashSessionToken(token),
      username,
      expiresAt,
    });
    setSessionCookie(response, token);
    response.json({ username, expiresAt: expiresAt.toISOString() });
  } catch {
    response.status(503).json({ message: "Unable to create an admin session." });
  }
});

router.post("/auth/logout", requireAdminOrigin, requireAdminSession, async (request, response) => {
  const token = request.cookies?.[ADMIN_SESSION_COOKIE];
  if (typeof token === "string") {
    await db.delete(adminSessionsTable).where(eq(adminSessionsTable.tokenHash, hashSessionToken(token)));
  }
  clearSessionCookie(response);
  response.status(204).end();
});

router.use(requireAdminSession);

router.get("/products", async (_request, response) => {
  try {
    const rows = await db.select().from(productsTable).orderBy(asc(productsTable.name));
    response.json(rows.map(setUpdated));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.post("/products", async (request, response) => {
  const parsed = productSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Product data is invalid." });
    return;
  }
  try {
    const [record] = await db.insert(productsTable).values(parsed.data).returning();
    response.status(201).json(setUpdated(record));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.put("/products/:id", async (request, response) => {
  const parsed = productSchema.safeParse({ ...request.body, id: request.params.id });
  if (!parsed.success) {
    response.status(400).json({ message: "Product data is invalid." });
    return;
  }
  try {
    const [record] = await db.update(productsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(productsTable.id, request.params.id))
      .returning();
    if (!record) {
      response.status(404).json({ message: "Product not found." });
      return;
    }
    response.json(setUpdated(record));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.get("/categories", async (_request, response) => {
  try {
    response.json(await db.select().from(categoriesTable).orderBy(asc(categoriesTable.name)));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.post("/categories", async (request, response) => {
  const parsed = categorySchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Category data is invalid." });
    return;
  }
  try {
    const [record] = await db.insert(categoriesTable).values(parsed.data).returning();
    response.status(201).json(record);
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.put("/categories/:id", async (request, response) => {
  const parsed = categorySchema.safeParse({ ...request.body, id: request.params.id });
  if (!parsed.success) {
    response.status(400).json({ message: "Category data is invalid." });
    return;
  }
  try {
    const result = await db.transaction(async (transaction) => {
      const [previous] = await transaction.select().from(categoriesTable).where(eq(categoriesTable.id, request.params.id)).limit(1);
      if (!previous) return null;
      const [updated] = await transaction.update(categoriesTable)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(categoriesTable.id, request.params.id))
        .returning();
      if (previous.name !== updated.name) {
        await transaction.update(productsTable)
          .set({ category: updated.name, updatedAt: new Date() })
          .where(eq(productsTable.category, previous.name));
      }
      return updated;
    });
    if (!result) {
      response.status(404).json({ message: "Category not found." });
      return;
    }
    response.json(result);
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.get("/pages", async (_request, response) => {
  try {
    const rows = await db.select().from(sitePagesTable).orderBy(asc(sitePagesTable.title));
    response.json(rows.map(setUpdated));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.post("/pages", async (request, response) => {
  const parsed = pageSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ message: "Page data is invalid." });
    return;
  }
  try {
    const [record] = await db.insert(sitePagesTable).values(parsed.data).returning();
    response.status(201).json(setUpdated(record));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

router.put("/pages/:id", async (request, response) => {
  const parsed = pageSchema.safeParse({ ...request.body, id: request.params.id });
  if (!parsed.success) {
    response.status(400).json({ message: "Page data is invalid." });
    return;
  }
  try {
    const [record] = await db.update(sitePagesTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(sitePagesTable.id, request.params.id))
      .returning();
    if (!record) {
      response.status(404).json({ message: "Page not found." });
      return;
    }
    response.json(setUpdated(record));
  } catch (error) {
    reportDatabaseError(response, error);
  }
});

export default router;