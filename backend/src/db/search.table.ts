import { supabase } from "../config/supabase.js";
import { Hook } from "../types/hook.js";

export const searchHooks = async (query: string, limit = 10) => {
  return supabase
    .from("hooks")
    .select("*")
    .or(
      `song_name.ilike.%${query}%,artist_name.ilike.%${query}%`
    )
    .limit(limit)
    .returns<Hook[]>();
};
