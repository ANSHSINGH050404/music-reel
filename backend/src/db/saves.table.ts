import { supabase } from "../config/supabase";

export const saveHook = async (userId: string, hookId: string) => {
  await supabase.from("saves").insert({ user_id: userId, hook_id: hookId });

  return supabase.rpc("increment_saves", { hook_id: hookId });
};

export const unsaveHook = async (userId: string, hookId: string) => {
  await supabase
    .from("saves")
    .delete()
    .eq("user_id", userId)
    .eq("hook_id", hookId);

  return supabase.rpc("decrement_saves", { hook_id: hookId });
};
