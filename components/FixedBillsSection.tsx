import { useThemeColor } from "@/hooks/useThemeColor";
import { FixedBill, FixedBillsSectionProps } from "@/interfaces/FixedBills";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { CreateBillData, CreateBillModal } from "./CreateBillModal";
import { ProgressBar } from "./ProgressBar";
import { SwipeableCard } from "./SwipeableCard"; // Import do componente criado
import { ThemedText } from "./ThemedText";

export const FixedBillsSection: React.FC<FixedBillsSectionProps> = ({
  fixedBills,
  onBillPaid,
  onCreateBill,
  onDeleteFixedBill,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const cardBg = useThemeColor(
    { light: "#f5f5f5", dark: "#1a1a1a" },
    "background"
  );
  const textColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");
  const subtitleColor = useThemeColor({ light: "#666", dark: "#aaa" }, "text");

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateBill = (billData: CreateBillData) => {
    if (onCreateBill) {
      onCreateBill(billData);
    }
  };

  // Se não há contas fixas, mostra apenas o botão de criar
  if (!fixedBills || fixedBills.length === 0) {
    return (
      <>
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <MaterialIcons name="receipt-long" size={24} color={textColor} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Contas Fixas
          </ThemedText>
        </View>

        <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
          <MaterialIcons name="receipt" size={48} color={subtitleColor} />
          <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
            Nenhuma conta fixa cadastrada
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: subtitleColor }]}>
            Adicione suas contas mensais para melhor controle financeiro
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.createButton,
              {
                backgroundColor: isDark ? "#2d5aa0" : "#007AFF",
                shadowColor: isDark ? "#2d5aa0" : "#007AFF",
              },
            ]}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.createButtonIcon}>
              <MaterialIcons name="add" size={24} color="white" />
            </View>
            <ThemedText style={styles.createButtonText}>
              Adicionar Conta Fixa
            </ThemedText>
          </TouchableOpacity>
        </View>

        <CreateBillModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateBill={handleCreateBill}
          onDeleteFixedBill={onDeleteFixedBill}
        />
      </>
    );
  }

  // Filtra apenas contas ativas
  const activeBills = fixedBills.filter((b) => b.status === "ACTIVE");
  if (activeBills.length === 0) return null;

  // Calcula o status de pagamento do mês atual
  const currentMonth = new Date().toISOString().slice(0, 7);

  const billsWithStatus = activeBills.map((bill: FixedBill) => {
    const currentPayment = bill.paymentHistory?.find(
      (p) => p.month === currentMonth
    );
    return {
      ...bill,
      isPaid: currentPayment?.paid || false,
      paidDate: currentPayment?.paidDate,
    };
  });

  // Calcula estatísticas
  const totalAmount = billsWithStatus.reduce(
    (sum, bill) => sum + bill.amount,
    0
  );
  const paidBills = billsWithStatus.filter((b) => b.isPaid);
  const paidAmount = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingBills = billsWithStatus.filter((b) => !b.isPaid);
  const pendingAmount = pendingBills.reduce(
    (sum, bill) => sum + bill.amount,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getCategoryIcon = (category: string): any => {
    const icons: Record<string, string> = {
      HOUSING: "home",
      UTILITIES: "flash-on",
      TRANSPORTATION: "directions-car",
      INSURANCE: "security",
      EDUCATION: "school",
      ENTERTAINMENT: "tv",
      HEALTH: "local-hospital",
      OTHER: "receipt",
    };
    return icons[category] || "receipt";
  };

  const handleDeleteBill = (bill: FixedBill) => {
    Alert.alert(
      "Excluir Conta Fixa",
      `Deseja realmente excluir "${bill.name}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            if (onDeleteFixedBill) {
              onDeleteFixedBill(bill.billId);
            }
          },
        },
      ]
    );
  };

  // Componente do conteúdo do botão de delete customizado
  const DeleteButtonContent = () => (
    <View style={styles.deleteButtonContent}>
      <MaterialIcons name="delete" size={24} color="#fff" />
      <ThemedText style={styles.deleteButtonText}>Excluir</ThemedText>
    </View>
  );

  return (
    <>
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="receipt-long" size={24} color={textColor} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Contas Fixas
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: isDark ? "#2d5aa0" : "#007AFF",
              shadowColor: isDark ? "#2d5aa0" : "#007AFF",
            },
          ]}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <ThemedText style={styles.addButtonText}>Nova</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={isDark ? ["#1b5e20", "#2e7d32"] : ["#e8f5e9", "#c8e6c9"]}
          style={styles.statCard}
        >
          <ThemedText
            style={[styles.statValue, { color: isDark ? "white" : "black" }]}
          >
            {formatCurrency(totalAmount)}
          </ThemedText>
          <ThemedText
            style={[styles.statLabel, { color: isDark ? "white" : "black" }]}
          >
            Total Mensal
          </ThemedText>
        </LinearGradient>

        <View style={styles.statsRight}>
          <View style={[styles.miniStatCard, { backgroundColor: cardBg }]}>
            <View style={styles.miniStatRow}>
              <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              <ThemedText
                style={[styles.miniStatLabel, { color: subtitleColor }]}
              >
                Pagas
              </ThemedText>
            </View>
            <ThemedText style={[styles.miniStatValue, { color: textColor }]}>
              {paidBills.length} • {formatCurrency(paidAmount)}
            </ThemedText>
          </View>

          <View style={[styles.miniStatCard, { backgroundColor: cardBg }]}>
            <View style={styles.miniStatRow}>
              <Ionicons name="time-outline" size={16} color="#ff9800" />
              <ThemedText
                style={[styles.miniStatLabel, { color: subtitleColor }]}
              >
                Pendentes
              </ThemedText>
            </View>
            <ThemedText style={[styles.miniStatValue, { color: textColor }]}>
              {pendingBills.length} • {formatCurrency(pendingAmount)}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.billsList}>
        {billsWithStatus
          .sort((a, b) => {
            if (a.isPaid !== b.isPaid) return a.isPaid ? 1 : -1;
            return a.dueDay - b.dueDay;
          })
          .map((bill) => (
            <SwipeableCard
              key={bill.billId}
              onDelete={() => handleDeleteBill(bill)}
              deleteThreshold={80}
              deleteButtonContent={<DeleteButtonContent />}
              deleteButtonStyle={styles.deleteBackground}
              containerStyle={styles.swipeContainer}
              disabled={bill.isPaid} // Desabilita swipe quando pago
            >
              <TouchableOpacity
                disabled={bill.isPaid}
                onPress={() => !bill.isPaid && onBillPaid(bill)}
                activeOpacity={bill.isPaid ? 1 : 0.7}
              >
                <View style={[styles.billCard, { backgroundColor: cardBg }]}>
                  <View style={styles.billHeader}>
                    <View style={styles.billInfo}>
                      <View
                        style={[
                          styles.billIcon,
                          {
                            backgroundColor: bill.isPaid
                              ? "rgba(76, 175, 80, 0.1)"
                              : "rgba(255, 152, 0, 0.1)",
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={getCategoryIcon(bill.category)}
                          size={20}
                          color={bill.isPaid ? "#4caf50" : "#ff9800"}
                        />
                      </View>
                      <View style={styles.billDetails}>
                        <ThemedText
                          style={[styles.billName, { color: textColor }]}
                        >
                          {bill.name}
                        </ThemedText>
                        <ThemedText
                          style={[styles.billDueDate, { color: subtitleColor }]}
                        >
                          Vence dia {bill.dueDay} •{" "}
                          {bill.autopay
                            ? "Débito automático"
                            : "Pagamento manual"}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.billAmount}>
                      <ThemedText
                        style={[
                          styles.billAmountText,
                          { color: bill.isPaid ? "#4caf50" : textColor },
                        ]}
                      >
                        {formatCurrency(bill.amount)}
                      </ThemedText>
                      {bill.isPaid && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#4caf50"
                            style={styles.paidIcon}
                          />
                          {bill.autopay && (
                            <Ionicons
                              name="repeat"
                              size={18}
                              color="#4caf50"
                              style={[styles.paidIcon, { marginLeft: 2 }]}
                            />
                          )}
                        </View>
                      )}

                      {!bill.isPaid && bill.autopay && (
                        <Ionicons
                          name="repeat"
                          size={18}
                          color="#4caf50"
                          style={[styles.paidIcon, { marginTop: 2 }]}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </SwipeableCard>
          ))}
      </View>

      <ProgressBar
        currentValue={paidAmount}
        totalValue={totalAmount}
        label="Progresso de pagamento"
        progressColor="#4caf50"
        showPercentage={true}
      />

      <CreateBillModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateBill={handleCreateBill}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 36,
    minWidth: 80,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 16,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minHeight: 56,
  },
  createButtonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1.2,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsRight: {
    flex: 1,
    gap: 8,
  },
  miniStatCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  miniStatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 12,
  },
  miniStatValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  billsList: {
    gap: 8,
  },
  billCard: {
    padding: 14,
    borderRadius: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  billIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  billDetails: {
    flex: 1,
  },
  billName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  billDueDate: {
    fontSize: 12,
  },
  billAmount: {
    alignItems: "flex-end",
  },
  billAmountText: {
    fontSize: 16,
    fontWeight: "600",
  },
  paidIcon: {
    marginTop: 2,
  },
  swipeContainer: {
    marginBottom: 8,
    borderRadius: 12,
  },
  deleteBackground: {
    backgroundColor: "#ff4444",
    borderRadius: 12,
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
  billTouchable: {
    flex: 1,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});
