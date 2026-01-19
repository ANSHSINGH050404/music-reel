import { Router } from "express";
import { syncUser } from "../controllers/users.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/sync", requireAuth, syncUser);

export default router;
