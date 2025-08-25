import React, { useRef, useState } from "react";
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (disabled) return false;
        const { dx, dy } = gestureState;
        // Threshold maior para evitar conflito com taps
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 2;
      },

      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        if (disabled) return false;
        const { dx, dy } = gestureState;
        // Só captura se for claramente um movimento horizontal
        return Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy) * 3;
      },

      // Importante: previne que o gesto seja cancelado por outros componentes
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        // Para qualquer animação em andamento ANTES de setar offset
        translateX.stopAnimation(() => {
          // @ts-ignore
          const currentValue = translateX._value;
          translateX.setOffset(currentValue);
          translateX.setValue(0);
        });
      },

      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { dx } = gestureState;

        // @ts-ignore
        const currentOffset = translateX._offset;
        let newValue = dx;

        if (currentOffset === 0) {
          // Fechado - permite arrastar para ambos os lados, mas limita à esquerda
          newValue = Math.min(0, Math.max(-deleteThreshold, dx));
        } else {
          // Aberto - permite movimento controlado em ambas direções
          const totalValue = currentOffset + dx;
          if (totalValue > 0) {
            // Permite swipe para direita além da posição fechada para reset
            newValue = Math.min(deleteThreshold * 0.3, -currentOffset + dx);
          } else if (totalValue < -deleteThreshold) {
            newValue = -deleteThreshold - currentOffset;
          } else {
            newValue = dx;
          }
        }

        // Aplicar o valor calculado
        translateX.setValue(newValue);
      },

      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset();

        const { vx, dx } = gestureState;
        // @ts-ignore
        const currentValue = translateX._value;

        let shouldOpen = false;
        let shouldReset = false;

        if (Math.abs(vx) > 0.3) {
          // Velocidade alta - usa direção
          if (vx < 0) {
            shouldOpen = true; // Swipe rápido para esquerda - abre
          } else {
            shouldReset = true; // Swipe rápido para direita - reset
          }
        } else {
          // Velocidade baixa - usa posição
          if (currentValue < -deleteThreshold * 0.4) {
            shouldOpen = true; // Posição suficiente à esquerda - abre
          } else if (currentValue > deleteThreshold * 0.1) {
            shouldReset = true; // Posição à direita - reset
          } else {
            // Posição neutra - decide baseado na direção do movimento
            shouldReset = dx > 0;
          }
        }

        let targetValue = 0; // Fechado por padrão
        let finalIsOpen = false;

        if (shouldReset) {
          targetValue = 0; // Reset para posição fechada
          finalIsOpen = false;
        } else if (shouldOpen) {
          targetValue = -deleteThreshold; // Abre
          finalIsOpen = true;
        } else {
          // Mantém estado atual se não há decisão clara
          targetValue = isOpen ? -deleteThreshold : 0;
          finalIsOpen = isOpen;
        }

        Animated.spring(translateX, {
          toValue: targetValue,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }).start(() => {
          setIsOpen(finalIsOpen);
        });
      },

      onPanResponderTerminate: () => {
        translateX.flattenOffset();

        Animated.spring(translateX, {
          toValue: isOpen ? -deleteThreshold : 0,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }).start();
      },

      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  const handleDelete = () => {
    setIsOpen(false);
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
        {...panResponder.panHandlers}
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
    backgroundColor: "transparent",
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
