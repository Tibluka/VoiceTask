import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ProgressBarProps {
  currentValue: number;
  totalValue: number;
  label?: string;
  progressColor?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentValue,
  totalValue,
  label = "Progresso",
  progressColor = "#4caf50",
  backgroundColor,
  showPercentage = true,
  height = 8,
}) => {
  const textColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");
  const subtitleColor = useThemeColor({ light: "#666", dark: "#aaa" }, "text");

  const defaultBgColor = useThemeColor(
    { light: "rgba(0, 0, 0, 0.1)", dark: "rgba(255, 255, 255, 0.1)" },
    "background"
  );

  // Calcula a porcentagem
  const percentage =
    totalValue > 0 ? Math.round((currentValue / totalValue) * 100) : 0;
  const progressWidth =
    totalValue > 0 ? `${(currentValue / totalValue) * 100}%` : "0%";

  // Se não há valor total, não renderiza nada
  if (totalValue <= 0) return null;

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressInfo}>
        <ThemedText style={[styles.progressLabel, { color: subtitleColor }]}>
          {label}
        </ThemedText>
        {showPercentage && (
          <ThemedText style={[styles.progressPercentage, { color: textColor }]}>
            {percentage}%
          </ThemedText>
        )}
      </View>
      <View
        style={[
          styles.progressBarBg,
          {
            height,
            backgroundColor: backgroundColor || defaultBgColor,
          },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressBarBg: {
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});
