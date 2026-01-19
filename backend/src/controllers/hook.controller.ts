import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { v4 as uuid } from "uuid";

export const uploadHook = async (req: Request, res: Response) => {
  try {
    const { song_name, artist_name, category, duration } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Audio file required" });
    }

    if (duration < 10 || duration > 30) {
      return res.status(400).json({ error: "Duration must be 10–30 seconds" });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `${uuid()}.${fileExt}`;
    const filePath = `hooks/${fileName}`;

    // Upload audio
    const { error: uploadError } = await supabase.storage
      .from("hooks-audio")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    // Public URL
    const { data } = supabase.storage
      .from("hooks-audio")
      .getPublicUrl(filePath);

    // Insert DB row
    const { data: hook, error } = await supabase
      .from("hooks")
      .insert({
        song_name,
        artist_name,
        category,
        duration,
        audio_url: data.publicUrl,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(hook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};
