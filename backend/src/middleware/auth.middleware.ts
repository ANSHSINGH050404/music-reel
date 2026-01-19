import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string | undefined;

  // TEMP (Day 3): simulate auth via header
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userId = userId;
  next();
};
