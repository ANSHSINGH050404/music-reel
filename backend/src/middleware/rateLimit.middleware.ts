import rateLimit from "express-rate-limit";

export const engagementLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many requests. Slow down."
});
