import { supabase } from "../config/supabase";
import { Hook } from "../types/hook";

export const getFeedHooks = async (category?: string, limit = 10) => {
  let query = supabase
    .from("hooks")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  return query.returns<Hook[]>();
};
