import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface AnimatedSplashScreenProps {
  isDark?: boolean;
  onAnimationFinish?: () => void;
}

export default function AnimatedSplashScreen({
  isDark = false,
  onAnimationFinish,
}: AnimatedSplashScreenProps) {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Auto-play a animação quando o componente monta
    const timer = setTimeout(() => {
      animationRef.current?.play();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log("Animação Lottie completada"); // Debug
    if (onAnimationFinish) {
      onAnimationFinish();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
      ]}
    >
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/voicetsak-splash.json")} // Nome correto
        style={styles.animation}
        autoPlay={true}
        loop={false}
        onAnimationFinish={handleAnimationComplete}
        resizeMode="contain"
        speed={1}
        colorFilters={
          isDark
            ? [
                {
                  keypath: "**", // Aplica a todos os elementos
                  color: "#29C1D6",
                },
              ]
            : []
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width * 0.8,
    height: height * 0.6,
    maxWidth: 400,
    maxHeight: 300,
  },
});
