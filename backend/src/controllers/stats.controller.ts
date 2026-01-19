import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getHookStats = async (req: Request, res: Response) => {
  const hookId = req.params.id;

  const { data, error } = await supabase
    .from("hooks")
    .select(
      "likes_count, saves_count, replays_count"
    )
    .eq("id", hookId)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const score =
    data.likes_count * 3 +
    data.saves_count * 4 +
    data.replays_count;

  res.json({
    ...data,
    isTrending: score > 50
  });
};
