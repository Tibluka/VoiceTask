import { FixedBill } from '@/interfaces/FixedBills';
import { payBill } from '@/services/fixed-bills/fixed-bills.service';
import { useConfigStore } from '@/zustand/ConfigStore/useConfigStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
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

    const confirmPaidBill = (bill: FixedBill) => {
        Alert.alert(
            'Confirmar pagamento',
            `Deseja marcar a conta "${bill.name}" como paga?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Pagar', style: 'default', onPress: async () => {
                        try {
                            const yearMonth = new Date().toISOString().slice(0, 7);
                            await payBill(bill.billId, bill.amount, yearMonth);
                            Alert.alert('Sucesso', 'Conta marcada como paga!');
                            await loadConfig(user!.id);
                        } catch (error: any) {
                            Alert.alert('Erro', 'Não foi possível marcar a conta como paga. Tente novamente.');
                        }
                    }
                }
            ]
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Seção de Finanças */}
            <FinanceSection
                monthLimit={cfg?.monthLimit}
            />

            {/* Cards de Estratégia */}
            <StrategySection values={strategyValues || { needs: 50, wants: 30, investments: 20 }} />

            {/* Seção de Projetos */}
            <ProjectsSection projects={cfg?.projects || []} />
            
            {/* Card de Metas */}
            <GoalsSection goalsCount={cfg?.goals?.length || 0} />

            {/* Seção de Contas Fixas */}
            <FixedBillsSection fixedBills={cfg?.fixedBills} onBillPaid={confirmPaidBill} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
});