import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";
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
      console.log("Iniciando carregamento do token...");
      await loadToken();
      console.log("Token carregado, loading = false");
      setLoading(false);
    };
    init();
  }, []);

  // Função chamada quando a animação Lottie termina
  const handleAnimationFinish = () => {
    console.log("Animação finalizada, escondendo splash");
    setShowSplash(false);
  };

  console.log("Estados atuais:", { loading, showSplash, isLoggedIn });

  // SEMPRE mostra o splash primeiro, independente do loading
  if (showSplash) {
    return (
      <AnimatedSplashScreen
        isDark={isDark}
        // Só permite que a animação termine se o loading também terminou
        onAnimationFinish={!loading ? handleAnimationFinish : undefined}
      />
    );
  }

  // Só depois que o splash acabou, verifica se ainda está carregando
  if (loading) {
    // Se por algum motivo ainda estiver carregando após a animação,
    // poderia mostrar um loading simples aqui, mas normalmente não chegará aqui
    return (
      <AnimatedSplashScreen
        isDark={isDark}
        onAnimationFinish={handleAnimationFinish}
      />
    );
  }

  // Se não estiver logado, redireciona para login
  if (!isLoggedIn) {
    console.log("Não logado, redirecionando para login");
    return <Redirect href="/(auth)/login" />;
  }

  // Se estiver logado, mostra o app principal
  console.log("Logado, mostrando app principal");
  return <MainTabs />;
}
