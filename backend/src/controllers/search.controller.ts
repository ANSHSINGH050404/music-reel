import { Request, Response } from "express";
import { searchHooks } from "../db/search.table.js";

export const search = async (req: Request, res: Response) => {
  const q = req.query.q as string;

  if (!q || q.length < 2) {
    return res.json({ hooks: [] });
  }

  const { data, error } = await searchHooks(q);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ hooks: data });
};
