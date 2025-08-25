import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface CreateBillModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateBill: (billData: CreateBillData) => void;
}

export interface CreateBillData {
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  autopay?: boolean;
  reminder?: boolean;
  description?: string;
}

const CATEGORIES = [
  { key: "HOUSING", label: "Moradia", icon: "home" },
  { key: "UTILITIES", label: "Utilidades", icon: "flash-on" },
  { key: "TRANSPORTATION", label: "Transporte", icon: "directions-car" },
  { key: "INSURANCE", label: "Seguros", icon: "security" },
  { key: "EDUCATION", label: "Educação", icon: "school" },
  { key: "ENTERTAINMENT", label: "Entretenimento", icon: "tv" },
  { key: "HEALTH", label: "Saúde", icon: "local-hospital" },
  { key: "OTHER", label: "Outros", icon: "receipt" },
] as const;

export const CreateBillModal: React.FC<CreateBillModalProps> = ({
  visible,
  onClose,
  onCreateBill,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = useThemeColor(
    { light: "#fff", dark: "#1a1a1a" },
    "background"
  );
  const textColor = useThemeColor({ light: "#333", dark: "#fff" }, "text");
  const subtitleColor = useThemeColor({ light: "#666", dark: "#aaa" }, "text");
  const inputBgColor = useThemeColor(
    { light: "#f5f5f5", dark: "#2a2a2a" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e0e0e0", dark: "#333" },
    "border"
  );

  const [formData, setFormData] = useState<CreateBillData>({
    name: "",
    amount: 0,
    dueDay: 1,
    category: "OTHER",
    autopay: false,
    reminder: true,
    description: "",
  });

  const [amountText, setAmountText] = useState("");

  const resetForm = () => {
    setFormData({
      name: "",
      amount: 0,
      dueDay: 1,
      category: "OTHER",
      autopay: false,
      reminder: true,
      description: "",
    });
    setAmountText("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAmountChange = (text: string) => {
    // Remove tudo que não é número ou vírgula
    const cleanText = text.replace(/[^\d,]/g, "");
    setAmountText(cleanText);

    // Converte para número (substitui vírgula por ponto)
    const numericValue = parseFloat(cleanText.replace(",", ".")) || 0;
    setFormData((prev) => ({ ...prev, amount: numericValue }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    return `R$ ${value}`;
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert("Erro", "Nome da conta é obrigatório");
      return false;
    }
    if (formData.amount <= 0) {
      Alert.alert("Erro", "Valor deve ser maior que zero");
      return false;
    }
    if (formData.dueDay < 1 || formData.dueDay > 31) {
      Alert.alert("Erro", "Dia de vencimento deve estar entre 1 e 31");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateBill(formData);
      handleClose();
    }
  };

  const selectedCategory = CATEGORIES.find(
    (cat) => cat.key === formData.category
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Nova Conta Fixa</ThemedText>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.saveButton,
              { opacity: formData.name && formData.amount > 0 ? 1 : 0.5 },
            ]}
          >
            <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nome */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Nome da Conta *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="Ex: Aluguel, Luz, Internet..."
              placeholderTextColor={subtitleColor}
              maxLength={50}
            />
          </View>

          {/* Valor */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Valor *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              value={formatCurrency(amountText)}
              onChangeText={handleAmountChange}
              placeholder="R$ 0,00"
              placeholderTextColor={subtitleColor}
              keyboardType="numeric"
            />
          </View>

          {/* Dia de Vencimento */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Dia de Vencimento *
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBgColor,
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              value={formData.dueDay.toString()}
              onChangeText={(text) => {
                const day = parseInt(text) || 1;
                if (day >= 1 && day <= 31) {
                  setFormData((prev) => ({ ...prev, dueDay: day }));
                }
              }}
              placeholder="Dia (1-31)"
              placeholderTextColor={subtitleColor}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          {/* Categoria */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Categoria
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryItem,
                    {
                      backgroundColor:
                        formData.category === category.key
                          ? isDark
                            ? "#2d5aa0"
                            : "#007AFF"
                          : inputBgColor,
                      borderColor:
                        formData.category === category.key
                          ? isDark
                            ? "#2d5aa0"
                            : "#007AFF"
                          : borderColor,
                    },
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, category: category.key }))
                  }
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={20}
                    color={
                      formData.category === category.key ? "white" : textColor
                    }
                  />
                  <ThemedText
                    style={[
                      styles.categoryLabel,
                      {
                        color:
                          formData.category === category.key
                            ? "white"
                            : textColor,
                      },
                    ]}
                  >
                    {category.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Opções */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Opções
            </ThemedText>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() =>
                setFormData((prev) => ({ ...prev, autopay: !prev.autopay }))
              }
            >
              <View style={styles.optionLeft}>
                <MaterialIcons name="repeat" size={20} color={textColor} />
                <View style={styles.optionText}>
                  <ThemedText
                    style={[styles.optionTitle, { color: textColor }]}
                  >
                    Débito Automático
                  </ThemedText>
                  <ThemedText
                    style={[styles.optionSubtitle, { color: subtitleColor }]}
                  >
                    Esta conta é debitada automaticamente
                  </ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: formData.autopay ? "#007AFF" : borderColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: formData.autopay ? 20 : 2 }],
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={() =>
                setFormData((prev) => ({ ...prev, reminder: !prev.reminder }))
              }
            >
              <View style={styles.optionLeft}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color={textColor}
                />
                <View style={styles.optionText}>
                  <ThemedText
                    style={[styles.optionTitle, { color: textColor }]}
                  >
                    Lembrete
                  </ThemedText>
                  <ThemedText
                    style={[styles.optionSubtitle, { color: subtitleColor }]}
                  >
                    Receber notificações de vencimento
                  </ThemedText>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: formData.reminder
                      ? "#007AFF"
                      : borderColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: formData.reminder ? 20 : 2 }],
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Descrição (Opcional) */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Descrição (Opcional)
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: inputBgColor,
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Detalhes adicionais sobre esta conta..."
              placeholderTextColor={subtitleColor}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    height: 80,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  bottomSpacing: {
    height: 40,
  },
});
