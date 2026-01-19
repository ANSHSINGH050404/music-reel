import { Router } from "express";
import { fetchHookFeed } from "../controllers/hooks.controller";

const router = Router();

router.get("/feed", fetchHookFeed);

export default router;
