import { Hook } from "../types/hook";

const API_URL = "http://10.108.18.141:3000/api";

export const fetchHooks = async (): Promise<Hook[]> => {
  const res = await fetch(`${API_URL}/hooks/feed`);
  if (!res.ok) {
    throw new Error(`Failed to fetch hooks: ${res.status}`);
  }
  const data = await res.json();
  return data.hooks.map((hook: any) => ({
    id: hook.id,
    title: hook.song_name,
    artist: hook.artist_name,
    audioUrl: hook.audio_url,
    likes: hook.likes_count,
    saves: hook.saves_count,
  }));
};

export default fetchHooks;
