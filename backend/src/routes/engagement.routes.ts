import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  like,
  unlike,
  save,
  unsave,
  replay,
} from "../controllers/engagement.controller";

const router = Router();

router.post("/:id/like", requireAuth, like);
router.post("/:id/unlike", requireAuth, unlike);
router.post("/:id/save", requireAuth, save);
router.post("/:id/unsave", requireAuth, unsave);
router.post("/:id/replay", requireAuth, replay);

export default router;
