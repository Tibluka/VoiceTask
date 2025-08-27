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
    // Auto-play a animação
    animationRef.current?.play();

    // Fallback: se não houver callback, termina em 3 segundos
    if (!onAnimationFinish) {
      const timer = setTimeout(() => {
        // Animação termina automaticamente
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onAnimationFinish]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000000" : "#FFFFFF" },
      ]}
    >
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/voicetsak-splash.json")} // Caminho correto
        style={styles.animation}
        autoPlay
        loop={false}
        onAnimationFinish={onAnimationFinish}
        resizeMode="contain"
        colorFilters={
          isDark
            ? [
                {
                  keypath: "microfone", // Nome da camada no Lottie
                  color: "#29C1D6",
                },
                {
                  keypath: "texto",
                  color: "#0AA7D1",
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
    width: width * 0.7,
    height: height * 0.5,
    maxWidth: 300,
    maxHeight: 200,
  },
});
