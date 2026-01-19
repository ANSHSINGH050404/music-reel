import { supabase } from "../config/supabase";

export const addReplay = async (userId: string | null, hookId: string) => {
  await supabase.from("replays").insert({
    user_id: userId,
    hook_id: hookId,
  });

  return supabase.rpc("increment_replays", { hook_id: hookId });
};
