import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";

import AudioRecorder from "@/components/AudioRecorder";
import { Footer } from "@/components/Footer";
import { useSwipeStore } from "@/zustand/SwipeStore/SwipeStore";
import ProfileScreen from "./profile-screen";

const renderScene = SceneMap({
  chat: AudioRecorder,
  profile: ProfileScreen,
});

export default function MainTabs() {
  const layout = useWindowDimensions();
  const isCardSwiping = useSwipeStore((state) => state.isCardSwiping);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "chat", title: "Chat" },
    { key: "profile", title: "Perfil" },
  ]);

  return (
    <>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={!isCardSwiping} // Desabilita swipe quando card está sendo arrastado
        renderTabBar={() => null}
      />
      <Footer selectedIndex={index} onTabPress={setIndex} />
    </>
  );
}
