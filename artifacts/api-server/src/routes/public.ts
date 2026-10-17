import { asc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable, sitePagesTable } from "@workspace/db/schema";

const router: IRouter = Router();

function setUpdated<T extends { updatedAt: Date }>(record: T) {
  return { ...record, updated: record.updatedAt.toISOString() };
}

function reportDatabaseError(response: import("express").Response) {
  response.status(503).json({ message: "Published content is temporarily unavailable." });
}

router.get("/products", async (_request, response) => {
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.status, "Published"))
      .orderBy(asc(productsTable.name));
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    response.json(rows.map(setUpdated));
  } catch {
    reportDatabaseError(response);
  }
});

router.get("/categories", async (_request, response) => {
  try {
    const rows = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.active, true))
      .orderBy(asc(categoriesTable.name));
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    response.json(rows);
  } catch {
    reportDatabaseError(response);
  }
});

router.get("/pages", async (request, response) => {
  const path = typeof request.query.path === "string" ? request.query.path : "";
  if (!path || !/^\/[a-z0-9/-]*$/i.test(path)) {
    response.status(400).json({ message: "A valid page path is required." });
    return;
  }

  try {
    const [page] = await db
      .select()
      .from(sitePagesTable)
      .where(eq(sitePagesTable.path, path))
      .limit(1);
    if (!page || page.status !== "Published") {
      response.status(404).json({ message: "Published page not found." });
      return;
    }
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    response.json(setUpdated(page));
  } catch {
    reportDatabaseError(response);
  }
});

export default router;
