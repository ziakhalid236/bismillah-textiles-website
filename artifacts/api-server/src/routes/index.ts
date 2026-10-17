import { Router, type IRouter } from "express";
import adminRouter from "./admin.js";
import healthRouter from "./health.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/admin", adminRouter);

export default router;
