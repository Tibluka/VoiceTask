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
  const [minTimeReached, setMinTimeReached] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log("🚀 Iniciando carregamento do token...");

      // Tempo mínimo de splash (3 segundos)
      const minTimePromise = new Promise((resolve) => {
        setTimeout(() => {
          console.log("⏰ Tempo mínimo de splash atingido");
          setMinTimeReached(true);
          resolve(true);
        }, 3000);
      });

      // Carregamento do token
      const tokenPromise = loadToken().then(() => {
        console.log("✅ Token carregado");
      });

      // Aguardar ambos: tempo mínimo E carregamento do token
      await Promise.all([minTimePromise, tokenPromise]);

      console.log("🎯 Pronto para esconder splash");
      setLoading(false);
    };

    init();
  }, []);

  // Função chamada quando o usuário pode prosseguir
  const handleAnimationFinish = () => {
    console.log("🎬 Splash pode ser escondido agora");
    setShowSplash(false);
  };

  console.log("📊 Estados:", {
    loading,
    showSplash,
    minTimeReached,
    isLoggedIn,
  });

  // Mostra splash enquanto não terminou o loading OU ainda está em showSplash
  if (showSplash || loading) {
    return (
      <AnimatedSplashScreen
        isDark={isDark}
        // Só permite esconder quando tanto o loading quanto o tempo mínimo terminaram
        onAnimationFinish={
          !loading && minTimeReached ? handleAnimationFinish : undefined
        }
      />
    );
  }

  // Se não estiver logado, redireciona para login
  if (!isLoggedIn) {
    console.log("🔐 Não logado, redirecionando para login");
    return <Redirect href="/(auth)/login" />;
  }

  // Se estiver logado, mostra o app principal
  console.log("✅ Logado, mostrando app principal");
  return <MainTabs />;
}
