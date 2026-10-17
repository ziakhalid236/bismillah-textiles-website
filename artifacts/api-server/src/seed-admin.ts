import { db, pool } from "@workspace/db";
import {
  categoriesTable,
  productsTable,
  sitePagesTable,
} from "@workspace/db/schema";

const categories = [
  { id: "category-home", name: "Home textiles", description: "Bedding, window, bath and table products.", active: true },
  { id: "category-fabric", name: "Fabric", description: "Woven, dyed, printed and finished fabrics.", active: true },
  { id: "category-hospitality", name: "Hospitality", description: "Bed linen, drapes and quilted products for hospitality.", active: true },
  { id: "category-apparel", name: "Garments & apparel fabrics", description: "Apparel fabrics and cut-and-sew capability.", active: true },
];

const products = [
  { id: "product-sheet-sets", name: "Sheet sets", sku: "BTL-HM-001", category: "Home textiles", status: "Published", description: "Flat sheets, fitted sheets and pillowcases, cut and stitched in-house from our own woven fabric." },
  { id: "product-comforter-sets", name: "Comforter sets", sku: "BTL-HM-002", category: "Home textiles", status: "Published", description: "Coordinated comforter and pillow sham sets, supported by in-house quilting and wadding." },
  { id: "product-jacquard-fabric", name: "Jacquard fabric", sku: "BTL-FB-001", category: "Fabric", status: "Published", description: "Figured woven fabric produced on the company’s air-jet looms." },
  { id: "product-hospitality-linen", name: "Hospitality bed linen", sku: "BTL-HT-001", category: "Hospitality", status: "Published", description: "Plain and striped bed linen for hospitality customers, made on weaving and stitching lines." },
  { id: "product-apparel-print", name: "Printed apparel fabric", sku: "BTL-AP-002", category: "Garments & apparel fabrics", status: "Draft", description: "Printed fabrics suited to apparel programmes." },
  { id: "product-quilted-bedding", name: "Quilted bedding", sku: "BTL-HM-004", category: "Home textiles", status: "Draft", description: "Quilts and quilted products made on computerized quilting lines." },
];

const pages = [
  { id: "page-home", title: "Home page", path: "/", summary: "Company introduction and manufacturing overview.", body: "Founded in 1989, Bismillah Textiles brings weaving, processing and stitching together at our home in Faisalabad, Pakistan. We serve brands and retailers across six continents.", status: "Published" },
  { id: "page-about", title: "About us", path: "/about-us/", summary: "Company story, values and leadership.", body: "A family business built on quality, professional service and long-standing relationships. Our teams bring each stage of textile manufacturing together under one roof.", status: "Published" },
  { id: "page-facilities", title: "Manufacturing facilities", path: "/manufacturing-facilities/", summary: "Weaving, processing, stitching and finishing.", body: "Explore the integrated operations, equipment and people behind our textile manufacturing in Khurrianwala.", status: "Published" },
  { id: "page-news", title: "News", path: "/news/", summary: "Company updates and industry events.", body: "Share a company update, event announcement or community initiative with our customers and partners.", status: "Draft" },
];

try {
  await db.insert(categoriesTable).values(categories).onConflictDoNothing();
  await db.insert(productsTable).values(products).onConflictDoNothing();
  await db.insert(sitePagesTable).values(pages).onConflictDoNothing();
  console.info("Admin starter content inserted where records did not already exist.");
} finally {
  await pool.end();
}