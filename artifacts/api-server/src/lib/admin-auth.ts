import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import type { RequestHandler } from "express";
import { db } from "@workspace/db";
import { adminSessionsTable } from "@workspace/db/schema";

export const ADMIN_SESSION_COOKIE = "btl_admin_session";
export const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

export function allowedAdminOrigins(): string[] {
  return (process.env.ADMIN_APP_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const requireAdminOrigin: RequestHandler = (request, response, next) => {
  const origin = request.get("origin");
  if (!origin || !allowedAdminOrigins().includes(origin)) {
    response.status(403).json({ message: "Request origin is not allowed." });
    return;
  }
  next();
};

export function passwordMatches(password: string, encodedHash: string): boolean {
  const [algorithm, salt, expectedHash, extra] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHash || extra !== undefined) {
    return false;
  }

  try {
    const saltBytes = Buffer.from(salt, "base64url");
    const expected = Buffer.from(expectedHash, "base64url");
    if (saltBytes.length < 16 || expected.length !== 64) return false;
    const actual = scryptSync(password, saltBytes, expected.length);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function setSessionCookie(response: import("express").Response, token: string) {
  const production = process.env.NODE_ENV === "production";
  response.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/api/admin",
    maxAge: ADMIN_SESSION_DURATION_MS,
  });
}

export function clearSessionCookie(response: import("express").Response) {
  const production = process.env.NODE_ENV === "production";
  response.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    secure: production,
    sameSite: production ? "none" : "lax",
    path: "/api/admin",
  });
}

export const requireAdminSession: RequestHandler = async (
  request,
  response,
  next,
) => {
  const token = request.cookies?.[ADMIN_SESSION_COOKIE];
  if (typeof token !== "string" || token.length < 40) {
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
      response.status(401).json({ message: "Session expired. Sign in again." });
      return;
    }

    response.locals.adminUsername = session.username;
    next();
  } catch {
    response.status(503).json({ message: "Admin storage is unavailable." });
  }
};