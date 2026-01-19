import { Router } from "express";
import { getHookStats } from "../controllers/stats.controller.js";

const router = Router();

router.get("/:id/stats", getHookStats);

export default router;
