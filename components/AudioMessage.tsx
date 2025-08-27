import { CATEGORY_TRANSLATIONS } from "@/constants/CategoryTranslations";
import { ConsultResult } from "@/interfaces/Transcription";
import { deleteSpending } from "@/services/spendings/spendings.service";
import { formatCurrency } from "@/utils/format";
import { renderFormattedText } from "@/utils/textFormat";
import { useSwipeStore } from "@/zustand/SwipeStore/SwipeStore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ChartScreen from "./ChartScreen";
import { SwipeableCard } from "./SwipeableCard";
import { ThemedText } from "./ThemedText";

interface Props {
  message: string;
  consult_results?: ConsultResult[];
  type: string;
  chart_data: {
    chartType: "pie" | "pyramid" | "bar" | "radar" | "line";
    data: {
      value: number;
      label?: string;
    }[];
  };
}

// Função para determinar a cor do texto em negrito
function getBoldColor(type: string) {
  if (type === "PROJECT_CREATION") return "#000";
  return type === "user" ? "#fff" : "#333";
}

export const AudioMessage = ({
  message,
  consult_results,
  chart_data,
  type,
}: Props) => {
  const isUser = type === "user";
  const setCardSwiping = useSwipeStore((state) => state.setCardSwiping);

  const [results, setResults] = useState(consult_results ?? []);

  const handleDelete = (item: ConsultResult) => {
    Alert.alert("Remover registro", "Deseja realmente remover esse registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          await deleteSpending(item._id);
          const filtered = results.filter((r) => r !== item);
          setResults(filtered);
        },
      },
    ]);
  };

  const handleSwipeStart = () => {
    setCardSwiping(true);
  };

  const handleSwipeEnd = () => {
    setCardSwiping(false);
  };

  // Componente do conteúdo do botão de delete
  const DeleteButtonContent = () => (
    <View style={styles.deleteButtonContent}>
      <Icon name="trash-can-outline" size={24} color="#fff" />
      <ThemedText style={styles.deleteButtonText}>Remover</ThemedText>
    </View>
  );

  const renderResults = () => {
    const total = results.reduce((acc, cur) => {
      const value = Number(cur.value || 0);
      return cur.type === "SPENDING" ? acc - value : acc + value;
    }, 0);

    if (chart_data || results.length === 0) return null;

    return (
      <View style={{ marginVertical: 24, width: "100%" }}>
        {results.map((row, i) => (
          <SwipeableCard
            key={i}
            onDelete={() => handleDelete(row)}
            deleteThreshold={100}
            deleteButtonContent={<DeleteButtonContent />}
            deleteButtonStyle={styles.deleteBackground}
            containerStyle={styles.swipeContainer}
            disabled={row.type === "PROJECT_CREATION"}
            onSwipeStart={handleSwipeStart}
            onSwipeEnd={handleSwipeEnd}
          >
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <ThemedText style={styles.cardCategory}>
                  {CATEGORY_TRANSLATIONS[row.category] || row.category}
                </ThemedText>
                <ThemedText style={styles.cardDescription}>
                  {row.description}
                </ThemedText>
                {row.installment_info && (
                  <ThemedText style={styles.cardInstallment}>
                    Parcela {row.installment_info}
                  </ThemedText>
                )}
                <ThemedText style={styles.cardDate}>
                  {moment(row.date).format("DD/MM/yyyy")}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.cardValue,
                  row.type !== "SPENDING"
                    ? row.type === "PROJECT_CREATION"
                      ? styles.valueProject
                      : styles.valueIncome
                    : styles.valueExpense,
                ]}
              >
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(row.value || 0))}
              </ThemedText>
            </View>
          </SwipeableCard>
        ))}
        {total !== 0 && (
          <ThemedText
            style={{
              marginTop: 4,
              fontWeight: "bold",
              color: total < 0 ? "red" : "green",
            }}
          >
            Total: {formatCurrency(total)}
          </ThemedText>
        )}
      </View>
    );
  };

  const renderChart = () => {
    if (!chart_data) return;
    return (
      <View style={{ marginVertical: 24 }}>
        <ChartScreen chartType={chart_data.chartType} data={chart_data.data} />
      </View>
    );
  };

  useEffect(() => {
    if (consult_results) {
      setResults(consult_results);
    }
  }, [consult_results]);

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userContainer : styles.systemContainer,
      ]}
    >
      {renderResults()}
      {renderChart()}
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.systemBubble,
        ]}
      >
        {renderFormattedText(message, {
          baseStyle: [
            styles.messageText,
            isUser ? styles.userText : styles.systemText,
          ],
          boldStyle: {
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 4,
            color: getBoldColor(type),
          },
          bulletStyle: {
            marginLeft: 8,
            marginVertical: 2,
            color: isUser ? "#fff" : "#333",
          },
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 16,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  systemContainer: {
    alignItems: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#4A90E2",
    alignSelf: "flex-end",
  },
  systemBubble: {
    backgroundColor: "#e6e6fa",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
  },
  userText: {
    color: "#fff",
  },
  systemText: {
    color: "#333",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
  },
  cardCategory: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
    color: "#333",
  },
  cardDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  cardInstallment: {
    color: "#666",
    fontSize: 11,
    fontWeight: "700",
    marginVertical: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#999",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  valueExpense: {
    color: "#e53935",
  },
  valueIncome: {
    color: "#43a047",
  },
  valueProject: {
    color: "#000",
  },
  // Estilos para SwipeableCard
  swipeContainer: {
    marginBottom: 8,
    borderRadius: 8,
  },
  deleteBackground: {
    backgroundColor: "#e53935",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonContent: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    gap: 4,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
