import { Stack } from "expo-router";
import { useEffect } from "react";
import { setAudioModeAsync } from "expo-audio";

export default function RootLayout() {
  useEffect(() => {
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
          shouldPlayInBackground: false,
          interruptionMode: "duckOthers",
          shouldRouteThroughEarpiece: false,
        });
      } catch (e) {
        console.error("Failed to set audio mode", e);
      }
    }
    configureAudio();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
