import AnimatedSplashScreen from "@/components/AnimatedSplashScreen"; // Ajuste o caminho
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/zustand/AuthStore/useAuthStore";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import MainTabs from "./(tabs)/main-tabs";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { isLoggedIn, loadToken } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadToken();
      setLoading(false);
    };
    init();
  }, []);

  // Função chamada quando a animação Lottie termina
  const handleAnimationFinish = () => {
    setShowSplash(false);
  };

  // Enquanto carrega ou mostra splash animado
  if (loading || showSplash) {
    return (
      <AnimatedSplashScreen
        isDark={isDark}
        onAnimationFinish={loading ? undefined : handleAnimationFinish}
      />
    );
  }

  // Se não estiver logado, redireciona para login
  if (!isLoggedIn) {
    return <Redirect href="/(auth)/login" />;
  }

  // Se estiver logado, mostra o app principal
  return <MainTabs />;
}
