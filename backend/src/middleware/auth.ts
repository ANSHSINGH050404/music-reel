import { Request, Response, NextFunction } from "express";
// import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check for authentication headers
  // This is a placeholder. Implement Clerk middleware here.
  // ClerkExpressRequireAuth()(req, res, next);
  next();
};
