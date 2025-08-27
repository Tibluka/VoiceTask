import { FixedBill } from "@/interfaces/FixedBills";
import {
  createFixedBill,
  deleteFixedBill,
  payBill,
} from "@/services/fixed-bills/fixed-bills.service";
import {
  createProject,
  deleteProject,
} from "@/services/projects/projects.service";
import { useConfigStore } from "@/zustand/ConfigStore/useConfigStore";
import { useUserStore } from "@/zustand/UserStores/useUserStore";
import React, { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { CreateBillData } from "./CreateBillModal";
import { CreateProjectData } from "./CreateProjectModal";
import { FinanceSection } from "./FinanceSection";
import { FixedBillsSection } from "./FixedBillsSection";
import { GoalsSection } from "./GoalsSection";
import { ProjectsSection } from "./ProjectsSection";
import { StrategySection } from "./StrategySection";

export const UserStats = () => {
  const { user } = useUserStore();
  const { cfg, loadConfig } = useConfigStore();

  useEffect(() => {
    if (user) {
      loadConfig(user.id);
    }
  }, [user, loadConfig]);

  const strategyValues =
    cfg?.budgetStrategy === "custom"
      ? cfg?.customPercentages
      : { needs: 50, wants: 30, investments: 20 };

  // Função para criar conta fixa
  const createBill = async (billData: CreateBillData) => {
    try {
      console.log("Criando conta fixa completa:", billData);

      const response = await createFixedBill(
        billData.name,
        billData.amount,
        billData.dueDay,
        billData.category,
        billData.autopay,
        billData.reminder,
        billData.description
      );

      console.log("Conta criada:", response);

      Alert.alert(
        "✅ Conta Criada!",
        `${billData.name} adicionada com sucesso!\n\n💰 R$ ${billData.amount
          .toFixed(2)
          .replace(".", ",")}\n📅 Vence dia ${billData.dueDay}\n${
          billData.autopay ? "🔄 Débito automático ativo" : ""
        }`,
        [{ text: "Perfeito!" }]
      );
      loadConfig(user!.id);
    } catch (error: any) {
      console.error("Erro:", error);

      Alert.alert(
        "Ops! ❌",
        error.response?.data?.message || error.message || "Erro ao criar conta",
        [{ text: "Tentar novamente" }]
      );
    }
  };

  // Função para criar projeto
  const createNewProject = async (projectData: CreateProjectData) => {
    try {
      console.log("Criando projeto:", projectData);

      const response = await createProject(
        projectData.projectName,
        projectData.description,
        projectData.targetValue
      );

      console.log("Projeto criado:", response);

      Alert.alert(
        "✅ Projeto Criado!",
        `${projectData.projectName} criado com sucesso!\n\n${
          projectData.description ? `📝 ${projectData.description}\n` : ""
        }${
          projectData.targetValue
            ? `🎯 Meta: R$ ${projectData.targetValue
                .toFixed(2)
                .replace(".", ",")}`
            : ""
        }`,
        [{ text: "Perfeito!" }]
      );
      loadConfig(user!.id);
    } catch (error: any) {
      console.error("Erro:", error);

      Alert.alert(
        "Ops! ❌",
        error.response?.data?.message ||
          error.message ||
          "Erro ao criar projeto",
        [{ text: "Tentar novamente" }]
      );
    }
  };

  // Função para deletar projeto
  const deleteProjectHandler = async (projectId: string) => {
    try {
      await deleteProject(projectId);

      Alert.alert("✅ Projeto Removido!", `Projeto removido com sucesso!`, [
        { text: "Ok!" },
      ]);
      loadConfig(user!.id);
    } catch (error: any) {
      console.error("Erro:", error);

      Alert.alert(
        "Ops! ❌",
        error.response?.data?.message ||
          error.message ||
          "Erro ao remover projeto",
        [{ text: "Tentar novamente" }]
      );
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      await deleteFixedBill(billId);

      Alert.alert("✅ Conta Removida!", `Removida com sucesso!`, [
        { text: "Ok!" },
      ]);
      loadConfig(user!.id);
    } catch (error: any) {
      console.error("Erro:", error);

      Alert.alert(
        "Ops! ❌",
        error.response?.data?.message ||
          error.message ||
          "Erro ao remover conta",
        [{ text: "Tentar novamente" }]
      );
    }
  };

  const confirmPaidBill = (bill: FixedBill) => {
    Alert.alert(
      "Confirmar pagamento",
      `Deseja marcar a conta "${bill.name}" como paga?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Pagar",
          style: "default",
          onPress: async () => {
            try {
              const yearMonth = new Date().toISOString().slice(0, 7);
              await payBill(bill.billId, bill.amount, yearMonth);
              Alert.alert("Sucesso", "Conta marcada como paga!");
              loadConfig(user!.id);
            } catch (error: any) {
              Alert.alert(
                "Erro",
                "Não foi possível marcar a conta como paga. Tente novamente."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      {/* Seção de Finanças */}
      <FinanceSection monthLimit={cfg?.monthLimit} />

      {/* Cards de Estratégia */}
      <StrategySection
        values={strategyValues || { needs: 50, wants: 30, investments: 20 }}
      />

      {/* Seção de Projetos */}
      <ProjectsSection
        projects={cfg?.projects || []}
        onCreateProject={createNewProject}
        onDeleteProject={deleteProjectHandler}
      />

      {/* Card de Metas */}
      <GoalsSection goalsCount={cfg?.goals?.length || 0} />

      {/* Seção de Contas Fixas */}
      <FixedBillsSection
        fixedBills={cfg?.fixedBills}
        onBillPaid={confirmPaidBill}
        onCreateBill={createBill}
        onDeleteFixedBill={deleteBill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
});
