import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/zustand/AuthStore/useAuthStore";
import { Redirect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import MainTabs from "./(tabs)/main-tabs";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { isLoggedIn, loadToken } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [isRenderingMainContent, setIsRenderingMainContent] = useState(false);

  // Animação de fade
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      console.log("🚀 Iniciando carregamento do token...");

      // Simular tempo mínimo + carregar token
      const [_] = await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 2000)), // Mínimo 2s
        loadToken(),
      ]);

      console.log("✅ Token carregado + tempo mínimo atingido");
      setLoading(false);
    };

    init();
  }, []);

  // Efeito para iniciar fade quando ambos estão prontos
  useEffect(() => {
    if (!loading && animationCompleted) {
      console.log("🎯 Loading + Animação prontos - iniciando fade out");

      // Começa a renderizar o conteúdo principal (invisível)
      setIsRenderingMainContent(true);

      // Inicia as animações de transição
      Animated.parallel([
        // Fade out do splash
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800, // 800ms para fade out suave
          useNativeDriver: true,
        }),
        // Fade in do conteúdo principal (com delay)
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200, // Começa um pouco depois
          useNativeDriver: true,
        }),
      ]).start(() => {
        console.log("✨ Fade concluído - removendo splash");
        setShowSplash(false);
      });
    }
  }, [loading, animationCompleted, fadeAnim, contentFadeAnim]);

  // Função chamada quando a animação Lottie termina
  const handleAnimationFinish = () => {
    console.log("🎬 Animação finalizada");
    setAnimationCompleted(true);
  };

  console.log("📊 Estados:", {
    loading,
    showSplash,
    animationCompleted,
    isLoggedIn,
    isRenderingMainContent,
  });

  // Determina qual conteúdo mostrar
  let mainContent;
  if (!isLoggedIn) {
    console.log("🔐 Conteúdo: Login");
    mainContent = <Redirect href="/(auth)/login" />;
  } else {
    console.log("🏠 Conteúdo: App principal");
    mainContent = <MainTabs />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Conteúdo principal (renderizado mas pode estar invisível) */}
      {isRenderingMainContent && (
        <Animated.View
          style={{
            flex: 1,
            opacity: showSplash ? contentFadeAnim : 1, // Só anima durante transição
          }}
        >
          {mainContent}
        </Animated.View>
      )}

      {/* Splash screen com fade out */}
      {showSplash && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: fadeAnim,
            zIndex: 1000, // Garante que fica por cima
          }}
        >
          <AnimatedSplashScreen
            isDark={isDark}
            onAnimationFinish={handleAnimationFinish}
          />
        </Animated.View>
      )}

      {/* Fallback se não estiver renderizando conteúdo ainda */}
      {!showSplash && !isRenderingMainContent && mainContent}
    </View>
  );
}
