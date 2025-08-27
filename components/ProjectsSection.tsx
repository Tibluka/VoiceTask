import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { CreateProjectData, CreateProjectModal } from "./CreateProjectModal";
import { SwipeableCard } from "./SwipeableCard";
import { ThemedText } from "./ThemedText";

type Project = {
  projectId: string;
  projectName: string;
  description?: string;
  totalValueRegistered: number;
  targetValue?: number;
  status: "ACTIVE" | "COMPLETED" | "PAUSED";
  dateHourCreated: string;
  dateHourUpdated: string;
  completedAt?: string;
};

interface ProjectsSectionProps {
  projects: Project[];
  onCreateProject?: (projectData: CreateProjectData) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onCreateProject,
  onDeleteProject,
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

  const handleCreateProject = (projectData: CreateProjectData) => {
    if (onCreateProject) {
      onCreateProject(projectData);
    }
  };

  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      "Excluir Projeto",
      `Deseja realmente excluir "${project.projectName}"?\n\nEsta ação não pode ser desfeita. Os gastos vinculados ao projeto não serão removidos.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            if (onDeleteProject) {
              onDeleteProject(project.projectId);
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

  const activeProjects = projects.filter((p) => p.status === "ACTIVE");
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const totalProjectsValue = projects.reduce(
    (sum, p) => sum + p.totalValueRegistered,
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
  };

  // Se não há projetos, mostra apenas o botão de criar
  if (!projects || projects.length === 0) {
    return (
      <>
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <MaterialIcons name="architecture" size={24} color={textColor} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Projetos
          </ThemedText>
        </View>

        <View style={[styles.emptyState, { backgroundColor: cardBg }]}>
          <MaterialIcons name="architecture" size={48} color={subtitleColor} />
          <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
            Nenhum projeto cadastrado
          </ThemedText>
          <ThemedText style={[styles.emptySubtitle, { color: subtitleColor }]}>
            Organize seus gastos criando projetos específicos
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
              Criar Primeiro Projeto
            </ThemedText>
          </TouchableOpacity>
        </View>

        <CreateProjectModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateProject={handleCreateProject}
        />
      </>
    );
  }

  return (
    <>
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="architecture" size={24} color={textColor} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Projetos
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
          <ThemedText style={styles.addButtonText}>Novo</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Estatísticas de Projetos */}
      <View style={styles.projectsStatsContainer}>
        <LinearGradient
          colors={isDark ? ["#0f2027", "#203a43"] : ["#e0f7fa", "#b2ebf2"]}
          style={styles.projectStatCard}
        >
          <ThemedText style={[styles.projectStatValue, { color: "#00796b" }]}>
            {activeProjects.length}
          </ThemedText>
          <ThemedText style={[styles.projectStatLabel, { color: "#00796b" }]}>
            Ativos
          </ThemedText>
        </LinearGradient>

        <LinearGradient
          colors={isDark ? ["#232526", "#414345"] : ["#f3e5f5", "#e1bee7"]}
          style={styles.projectStatCard}
        >
          <ThemedText style={[styles.projectStatValue, { color: "#6a1b9a" }]}>
            {completedProjects}
          </ThemedText>
          <ThemedText style={[styles.projectStatLabel, { color: "#6a1b9a" }]}>
            Concluídos
          </ThemedText>
        </LinearGradient>

        <LinearGradient
          colors={isDark ? ["#1a237e", "#283593"] : ["#fff3e0", "#ffe0b2"]}
          style={styles.projectStatCard}
        >
          <ThemedText style={[styles.projectStatValue, { color: "#e65100" }]}>
            R$ {formatCompactCurrency(totalProjectsValue)}
          </ThemedText>
          <ThemedText style={[styles.projectStatLabel, { color: "#e65100" }]}>
            Investido
          </ThemedText>
        </LinearGradient>
      </View>

      {/* Lista de Projetos Ativos */}
      {activeProjects.length > 0 && (
        <View style={styles.activeProjectsList}>
          {activeProjects.map((project) => {
            const progress = project.targetValue
              ? (project.totalValueRegistered / project.targetValue) * 100
              : null;

            return (
              <SwipeableCard
                key={project.projectId}
                onDelete={() => handleDeleteProject(project)}
                deleteThreshold={80}
                deleteButtonContent={<DeleteButtonContent />}
                deleteButtonStyle={styles.deleteBackground}
                containerStyle={styles.swipeContainer}
              >
                <View style={[styles.projectCard, { backgroundColor: cardBg }]}>
                  <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                      <View style={styles.projectNameRow}>
                        <MaterialIcons
                          name="folder-special"
                          size={20}
                          color="#4caf50"
                          style={styles.projectIcon}
                        />
                        <ThemedText
                          style={[styles.projectName, { color: textColor }]}
                        >
                          {project.projectName}
                        </ThemedText>
                      </View>
                      {project.description && (
                        <ThemedText
                          style={[
                            styles.projectDescription,
                            { color: subtitleColor },
                          ]}
                        >
                          {project.description}
                        </ThemedText>
                      )}
                    </View>
                    <View style={styles.projectValue}>
                      <ThemedText
                        style={[styles.projectAmount, { color: textColor }]}
                      >
                        {formatCurrency(project.totalValueRegistered)}
                      </ThemedText>
                      {project.targetValue && (
                        <ThemedText
                          style={[
                            styles.projectTarget,
                            { color: subtitleColor },
                          ]}
                        >
                          de {formatCurrency(project.targetValue)}
                        </ThemedText>
                      )}
                    </View>
                  </View>

                  {progress !== null && (
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { backgroundColor: isDark ? "#333" : "#e0e0e0" },
                        ]}
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor:
                                progress >= 100 ? "#4CAF50" : "#007AFF",
                            },
                          ]}
                        />
                      </View>
                      <ThemedText
                        style={[styles.progressText, { color: subtitleColor }]}
                      >
                        {progress.toFixed(1)}%
                      </ThemedText>
                    </View>
                  )}
                </View>
              </SwipeableCard>
            );
          })}
        </View>
      )}

      <CreateProjectModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateProject={handleCreateProject}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    borderRadius: 12,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createButtonIcon: {
    marginRight: 8,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  projectsStatsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  projectStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 70,
    justifyContent: "center",
  },
  projectStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  projectStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  activeProjectsList: {
    gap: 12,
  },
  projectCard: {
    padding: 16,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 16,
  },
  projectNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  projectIcon: {
    marginRight: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  projectDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  projectValue: {
    alignItems: "flex-end",
  },
  projectAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  projectTarget: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
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
  deleteButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  swipeContainer: {
    marginBottom: 8,
    borderRadius: 12,
  },
});
