import { Router } from "express";
import { getHookStats } from "../controllers/stats.controller";

const router = Router();

router.get("/:id/stats", getHookStats);

export default router;
