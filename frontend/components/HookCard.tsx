import { View, Text, StyleSheet } from "react-native";
import { Hook } from "../types/hook";
import { useLoopAudio } from "./LoopAudioPlayer";

interface Props {
  hook: Hook;
  isActive: boolean;
}

export const HookCard = ({ hook, isActive }: Props) => {
  useLoopAudio(hook.audioUrl, isActive);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hook.title}</Text>
      <Text style={styles.artist}>{hook.artist}</Text>

      <View style={styles.actions}>
        <Text>❤️ {hook.likes}</Text>
        <Text>⭐ {hook.saves}</Text>
      </View>
    </View>
  );
};

export default HookCard;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "flex-end",
    padding: 24,
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  artist: {
    color: "gray",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
});
