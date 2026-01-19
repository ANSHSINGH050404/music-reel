import { Router } from "express";
import { fetchHookFeed } from "../controllers/hooks.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/feed",optionalAuth, fetchHookFeed);

export default router;
