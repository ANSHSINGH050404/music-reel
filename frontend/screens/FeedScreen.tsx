import { FlatList, View, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { Hook } from "../types/hook";
import { fetchHooks } from "../services/hookApi";
import { HookCard } from "../components/HookCard";

const { height } = Dimensions.get("window");

export default function FeedScreen() {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchHooks().then(setHooks);
  }, []);

  return (
    <FlatList
      data={hooks}
      keyExtractor={(item) => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(
          e.nativeEvent.contentOffset.y / height
        );
        setActiveIndex(index);
      }}
      renderItem={({ item, index }) => (
        <View style={{ height }}>
          <HookCard hook={item} isActive={index === activeIndex} />
        </View>
      )}
    />
  );
}
