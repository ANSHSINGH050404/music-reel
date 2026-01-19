import { supabase } from "../config/supabase";

export const likeHook = async (userId: string, hookId: string) => {
  await supabase.from("likes").insert({ user_id: userId, hook_id: hookId });

  return supabase.rpc("increment_likes", { hook_id: hookId });
};

export const unlikeHook = async (userId: string, hookId: string) => {
  await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("hook_id", hookId);

  return supabase.rpc("decrement_likes", { hook_id: hookId });
};
