import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

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
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("🎬 AnimatedSplashScreen montado");

    // Fade in suave do splash
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 300, // 500ms fade in
      useNativeDriver: true,
    }).start();

    // Auto-play a animação quando o componente monta
    const timer = setTimeout(() => {
      console.log("▶️ Iniciando animação Lottie");
      animationRef.current?.play();
    }, 300); // Pequeno delay após fade in

    return () => {
      clearTimeout(timer);
      console.log("🗑️ AnimatedSplashScreen desmontado");
    };
  }, [fadeInAnim]);

  const handleAnimationComplete = () => {
    console.log("✅ Animação Lottie completada!");

    if (onAnimationFinish) {
      console.log("🎯 Chamando onAnimationFinish callback");
      onAnimationFinish();
    } else {
      console.log(
        "⏳ onAnimationFinish = undefined - aguardando loading terminar"
      );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#000000" : "#FFFFFF",
          opacity: fadeInAnim, // Fade in do splash
        },
      ]}
    >
      <LottieView
        ref={animationRef}
        source={require("../assets/animations/voicetask-splash.json")}
        style={styles.animation}
        autoPlay={true}
        loop={false}
        onAnimationFinish={handleAnimationComplete}
        resizeMode="contain"
        speed={1.2}
        colorFilters={
          isDark
            ? [
                {
                  keypath: "**",
                  color: "#29C1D6",
                },
              ]
            : []
        }
      />
    </Animated.View>
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
