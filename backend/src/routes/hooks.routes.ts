import { Router } from "express";
import { fetchHookFeed } from "../controllers/hooks.controller";
import { optionalAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";
import { uploadHook } from "../controllers/hook.controller";

const router = Router();

router.get("/feed",optionalAuth, fetchHookFeed);
router.post("/upload", optionalAuth,upload.single("audio"), uploadHook);
export default router;
