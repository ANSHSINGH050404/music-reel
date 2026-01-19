import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { supabase } from "../config/supabase.js";

export const syncUser = async (req: AuthRequest, res: Response) => {
  const clerkId = req.userId!;

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  if (!data) {
    await supabase.from("users").insert({
      clerk_id: clerkId
    });
  }

  res.json({ success: true });
};
