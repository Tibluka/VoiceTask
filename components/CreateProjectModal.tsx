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

interface CreateProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateProject: (projectData: CreateProjectData) => void;
}

export interface CreateProjectData {
  projectName: string;
  description?: string;
  targetValue?: number;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  visible,
  onClose,
  onCreateProject,
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

  const [formData, setFormData] = useState<CreateProjectData>({
    projectName: "",
    description: "",
    targetValue: undefined,
  });

  const [targetValueText, setTargetValueText] = useState("");

  const resetForm = () => {
    setFormData({
      projectName: "",
      description: "",
      targetValue: undefined,
    });
    setTargetValueText("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTargetValueChange = (text: string) => {
    // Remove tudo que não é número ou vírgula
    const cleanText = text.replace(/[^\d,]/g, "");
    setTargetValueText(cleanText);

    // Converte para número (substitui vírgula por ponto)
    const numericValue = parseFloat(cleanText.replace(",", ".")) || undefined;
    setFormData((prev) => ({ ...prev, targetValue: numericValue }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    return `R$ ${value}`;
  };

  const validateForm = (): boolean => {
    if (!formData.projectName.trim()) {
      Alert.alert("Erro", "Nome do projeto é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreateProject(formData);
      handleClose();
    }
  };

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
          <ThemedText style={styles.title}>Novo Projeto</ThemedText>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.saveButton,
              { opacity: formData.projectName ? 1 : 0.5 },
            ]}
          >
            <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nome do Projeto */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Nome do Projeto *
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
              value={formData.projectName}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, projectName: text }))
              }
              placeholder="Ex: Reforma da casa, Viagem para Europa..."
              placeholderTextColor={subtitleColor}
              maxLength={50}
            />
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Descrição (opcional)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
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
              placeholder="Descreva seu projeto..."
              placeholderTextColor={subtitleColor}
              maxLength={200}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Valor Alvo */}
          <View style={styles.section}>
            <ThemedText style={[styles.label, { color: textColor }]}>
              Valor Alvo (opcional)
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
              value={formatCurrency(targetValueText)}
              onChangeText={handleTargetValueChange}
              placeholder="R$ 0,00"
              placeholderTextColor={subtitleColor}
              keyboardType="numeric"
            />
            <ThemedText style={[styles.helper, { color: subtitleColor }]}>
              Defina uma meta de gasto para acompanhar o progresso
            </ThemedText>
          </View>

          {/* Informações Adicionais */}
          <View
            style={[
              styles.infoBox,
              { backgroundColor: inputBgColor, borderColor },
            ]}
          >
            <MaterialIcons name="info" size={20} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <ThemedText style={[styles.infoTitle, { color: textColor }]}>
                Como funciona?
              </ThemedText>
              <ThemedText style={[styles.infoText, { color: subtitleColor }]}>
                Os projetos ajudam você a organizar e acompanhar gastos
                específicos. Quando você registrar gastos, poderá vinculá-los ao
                projeto correspondente.
              </ThemedText>
            </View>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  helper: {
    fontSize: 12,
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
