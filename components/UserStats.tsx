import { useConfigStore } from '@/zustand/ConfigStore/useConfigStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { FinanceSection } from './FinanceSection';
import { FixedBillsSection } from './FixedBillsSection';
import { GoalsSection } from './GoalsSection';
import { ProjectsSection } from './ProjectsSection';
import { StrategySection } from './StrategySection';

export const UserStats = () => {
    const { user } = useUserStore();
    const { cfg, loadConfig } = useConfigStore();

    useEffect(() => {
        if (user) {
            loadConfig(user.id);
        }
    }, [user, loadConfig]);

    const strategyValues =
        cfg?.budgetStrategy === 'custom'
            ? cfg?.customPercentages
            : { needs: 50, wants: 30, investments: 20 };

    return (
        <View style={styles.wrapper}>
            {/* Seção de Finanças */}
            <FinanceSection
                monthlyIncome={cfg?.monthlyIncome}
                monthLimit={cfg?.monthLimit}
            />

            {/* Cards de Estratégia */}
            <StrategySection values={strategyValues || { needs: 50, wants: 30, investments: 20 }} />

            {/* Card de Metas */}
            <GoalsSection goalsCount={cfg?.goals?.length || 0} />

            {/* Seção de Contas Fixas */}
            <FixedBillsSection fixedBills={cfg?.fixedBills} />

            {/* Seção de Projetos */}
            <ProjectsSection projects={cfg?.projects || []} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
});