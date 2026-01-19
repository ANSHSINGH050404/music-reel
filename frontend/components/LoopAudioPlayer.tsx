import { useAudioPlayer } from "expo-audio";
import { useEffect } from "react";

export const useLoopAudio = (uri: string, isActive: boolean) => {
  const player = useAudioPlayer(uri);

  useEffect(() => {
    player.loop = true;
  }, [player]);

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);
};

export default useLoopAudio;
