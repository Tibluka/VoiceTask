import React, { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface SwipeableCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  deleteThreshold?: number;
  deleteButtonContent?: React.ReactNode;
  deleteButtonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onDelete,
  deleteThreshold = 80,
  deleteButtonContent,
  deleteButtonStyle,
  containerStyle,
  disabled = false,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);

  // Estados para controle manual do toque
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isTracking = useRef(false);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);

  const handleTouchStart = (event: GestureResponderEvent) => {
    if (disabled) return;

    const { pageX, pageY } = event.nativeEvent;
    startX.current = pageX;
    startY.current = pageY;
    currentX.current = currentTranslateX;
    isTracking.current = true;

    // Para animações em andamento
    translateX.stopAnimation();
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (!isTracking.current || disabled) return;

    const { pageX, pageY } = event.nativeEvent;
    const deltaX = pageX - startX.current;
    const deltaY = pageY - startY.current;

    // Verifica se é movimento horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      // Limita o movimento
      let newValue = deltaX;
      if (isOpen) {
        // Se aberto, permite fechar (movimento para direita)
        newValue = Math.min(
          deleteThreshold,
          Math.max(-deleteThreshold * 0.5, deltaX)
        );
      } else {
        // Se fechado, permite apenas abrir (movimento para esquerda)
        newValue = Math.min(0, Math.max(-deleteThreshold * 1.2, deltaX));
      }

      translateX.setValue(currentX.current + newValue);
      setCurrentTranslateX(currentX.current + newValue);
    }
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!isTracking.current || disabled) return;

    const { pageX } = event.nativeEvent;
    const deltaX = pageX - startX.current;

    isTracking.current = false;

    // Decide se abre ou fecha baseado na distância
    if (deltaX < -deleteThreshold * 0.4) {
      // Swipe para esquerda - abre
      Animated.spring(translateX, {
        toValue: -deleteThreshold,
        useNativeDriver: true,
      }).start();
      setIsOpen(true);
      setCurrentTranslateX(-deleteThreshold);
    } else if (deltaX > deleteThreshold * 0.3) {
      // Swipe para direita - fecha
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setIsOpen(false);
      setCurrentTranslateX(0);
    } else {
      // Volta para o estado anterior
      const targetValue = isOpen ? -deleteThreshold : 0;
      Animated.spring(translateX, {
        toValue: targetValue,
        useNativeDriver: true,
      }).start();
      setCurrentTranslateX(targetValue);
    }
  };

  const handleDelete = () => {
    setIsOpen(false);
    setCurrentTranslateX(0);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDelete?.();
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Botão de delete (background) */}
      <View
        style={[
          styles.deleteBackground,
          { width: deleteThreshold },
          deleteButtonStyle,
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          {deleteButtonContent || (
            <View style={styles.defaultDeleteContent}>
              <View style={styles.deleteIcon}>
                <View style={styles.deleteLine1} />
                <View style={styles.deleteLine2} />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  deleteBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#ff4444",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  content: {
    backgroundColor: "white",
    zIndex: 1,
  },
  defaultDeleteContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    width: 24,
    height: 24,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteLine1: {
    position: "absolute",
    width: 20,
    height: 2,
    backgroundColor: "white",
    transform: [{ rotate: "45deg" }],
  },
  deleteLine2: {
    position: "absolute",
    width: 20,
    height: 2,
    backgroundColor: "white",
    transform: [{ rotate: "-45deg" }],
  },
});
