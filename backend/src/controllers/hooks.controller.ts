import { Request, Response } from "express";
import { getFeedHooks } from "../db/hooks.table";

export const fetchHookFeed = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    const { data, error } = await getFeedHooks(category);

    if (error) throw error;

    res.json({
      hooks: data,
      nextCursor: data?.[data.length - 1]?.created_at ?? null
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
