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
      console.log("🎬 Iniciando animação Lottie");
      animationRef.current?.play();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log("🎬 Animação Lottie completada");

    // Chama imediatamente quando a animação terminar
    if (onAnimationFinish) {
      console.log("✅ Chamando onAnimationFinish");
      onAnimationFinish();
    } else {
      console.log("⏳ onAnimationFinish não fornecido - aguardando loading...");
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
        source={require("../assets/animations/voicetask-splash.json")} // ⚠️ CORRIGI O NOME
        style={styles.animation}
        autoPlay={true}
        loop={false} // ✨ SEM loop - deixa terminar naturalmente
        onAnimationFinish={handleAnimationComplete}
        resizeMode="contain"
        speed={1} // ✨ Velocidade normal
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
