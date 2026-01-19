import { supabase } from "../config/supabase";
import { Hook } from "../types/hook";

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
