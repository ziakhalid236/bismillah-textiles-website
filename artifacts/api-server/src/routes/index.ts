import { Router, type IRouter } from "express";
import adminRouter from "./admin.js";
import healthRouter from "./health.js";
import publicRouter from "./public.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/public", publicRouter);
router.use("/admin", adminRouter);

export default router;
