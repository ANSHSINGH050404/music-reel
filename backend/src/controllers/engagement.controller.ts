import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { likeHook, unlikeHook } from "../db/likes.table";
import { saveHook, unsaveHook } from "../db/saves.table";
import { addReplay } from "../db/replays.table";

export const like = async (req: AuthRequest, res: Response) => {
  await likeHook(req.userId!, req.params.id as string);
  res.json({ success: true });
};

export const unlike = async (req: AuthRequest, res: Response) => {
  await unlikeHook(req.userId!, req.params.id as string);
  res.json({ success: true });
};

export const save = async (req: AuthRequest, res: Response) => {
  await saveHook(req.userId!, req.params.id as string);
  res.json({ success: true });
};

export const unsave = async (req: AuthRequest, res: Response) => {
  await unsaveHook(req.userId!, req.params.id as string);
  res.json({ success: true });
};

export const replay = async (req: AuthRequest, res: Response) => {
  await addReplay(req.userId ?? null, req.params.id as string);
  res.json({ success: true });
};
