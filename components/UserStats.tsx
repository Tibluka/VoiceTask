import { useThemeColor } from '@/hooks/useThemeColor';
import { useConfigStore } from '@/zustand/ConfigStore/useConfigStore';
import { useUserStore } from '@/zustand/UserStores/useUserStore';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

export const UserStats = () => {
    const { user } = useUserStore();
    const { cfg, loadConfig } = useConfigStore();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Cores temáticas
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

    useEffect(() => {
        if (user) {
            loadConfig(user.id);
        }
    }, [user, loadConfig]);

    const values =
        cfg?.budgetStrategy === 'custom'
            ? cfg?.customPercentages
            : { needs: 50, wants: 30, investments: 20 };

    // Calcula estatísticas dos projetos
    const activeProjects = cfg?.projects?.filter(p => p.status === 'ACTIVE') || [];
    const totalProjectsValue = cfg?.projects?.reduce((sum, p) => sum + p.totalValueRegistered, 0) || 0;
    const completedProjects = cfg?.projects?.filter(p => p.status === 'COMPLETED')?.length || 0;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const formatCompactCurrency = (value: number) => {
        if (value >= 1000000) {
            return `R$ ${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(1)}K`;
        }
        return formatCurrency(value);
    };

    return (
        <View style={styles.wrapper}>
            {/* Seção de Finanças */}
            <View style={styles.sectionHeader}>
                <MaterialIcons name="account-balance-wallet" size={24} color={textColor} />
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Finanças
                </ThemedText>
            </View>

            {/* Card de Salário com gradiente */}
            <LinearGradient
                colors={isDark ? ['#1e3c72', '#2a5298'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.salaryCard}
            >
                <View style={styles.salaryContent}>
                    <View>
                        <ThemedText style={styles.salaryLabel}>Renda Mensal</ThemedText>
                        <ThemedText style={styles.salaryValue}>
                            {cfg?.monthlyIncome ? formatCurrency(cfg.monthlyIncome) : 'Não definido'}
                        </ThemedText>
                    </View>
                    <FontAwesome5 name="money-bill-wave" size={32} color="rgba(255,255,255,0.3)" />
                </View>

                <View style={styles.limitContainer}>
                    <ThemedText style={styles.limitLabel}>Limite mensal</ThemedText>
                    <ThemedText style={styles.limitValue}>
                        {cfg?.monthLimit ? formatCurrency(cfg.monthLimit) : 'Não definido'}
                    </ThemedText>
                </View>
            </LinearGradient>

            {/* Cards de Estratégia */}
            <View style={styles.strategyContainer}>
                <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                    <Ionicons name="trending-up" size={20} color="#4caf50" />
                    <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                        Necessidades
                    </ThemedText>
                    <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                        {values?.needs}%
                    </ThemedText>
                </View>

                <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                    <Ionicons name="heart" size={20} color="#ff6b6b" />
                    <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                        Desejos
                    </ThemedText>
                    <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                        {values?.wants}%
                    </ThemedText>
                </View>

                <View style={[styles.miniCard, { backgroundColor: cardBg }]}>
                    <Ionicons name="rocket" size={20} color="#4ecdc4" />
                    <ThemedText style={[styles.miniCardLabel, { color: subtitleColor }]}>
                        Investimentos
                    </ThemedText>
                    <ThemedText style={[styles.miniCardValue, { color: textColor }]}>
                        {values?.investments}%
                    </ThemedText>
                </View>
            </View>

            {/* Card de Metas */}
            <View style={[styles.goalsCard, { backgroundColor: cardBg }]}>
                <View style={styles.goalsHeader}>
                    <View style={styles.goalsIconContainer}>
                        <Ionicons name="flag" size={24} color="#ffd93d" />
                    </View>
                    <View style={styles.goalsInfo}>
                        <ThemedText style={[styles.goalsLabel, { color: subtitleColor }]}>
                            Metas ativas
                        </ThemedText>
                        <ThemedText style={[styles.goalsValue, { color: textColor }]}>
                            {cfg?.goals?.length || 0}
                        </ThemedText>
                    </View>
                </View>
            </View>

            {/* Seção de Projetos */}
            {cfg?.projects && cfg.projects.length > 0 && (
                <>
                    <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                        <MaterialIcons name="architecture" size={24} color={textColor} />
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Projetos
                        </ThemedText>
                    </View>

                    {/* Estatísticas de Projetos */}
                    <View style={styles.projectsStatsContainer}>
                        <LinearGradient
                            colors={isDark ? ['#0f2027', '#203a43'] : ['#e0f7fa', '#b2ebf2']}
                            style={styles.projectStatCard}
                        >
                            <ThemedText style={[styles.projectStatValue, { color: '#00796b' }]}>
                                {activeProjects.length}
                            </ThemedText>
                            <ThemedText style={[styles.projectStatLabel, { color: '#00796b' }]}>
                                Ativos
                            </ThemedText>
                        </LinearGradient>

                        <LinearGradient
                            colors={isDark ? ['#232526', '#414345'] : ['#f3e5f5', '#e1bee7']}
                            style={styles.projectStatCard}
                        >
                            <ThemedText style={[styles.projectStatValue, { color: '#6a1b9a' }]}>
                                {completedProjects}
                            </ThemedText>
                            <ThemedText style={[styles.projectStatLabel, { color: '#6a1b9a' }]}>
                                Concluídos
                            </ThemedText>
                        </LinearGradient>

                        <LinearGradient
                            colors={isDark ? ['#1a237e', '#283593'] : ['#fff3e0', '#ffe0b2']}
                            style={styles.projectStatCard}
                        >
                            <ThemedText style={[styles.projectStatValue, { color: '#e65100' }]}>
                                {formatCompactCurrency(totalProjectsValue)}
                            </ThemedText>
                            <ThemedText style={[styles.projectStatLabel, { color: '#e65100' }]}>
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
                                    : 0;

                                return (
                                    <View
                                        key={project.projectId}
                                        style={[styles.projectCard, { backgroundColor: cardBg }]}
                                    >
                                        <View style={styles.projectHeader}>
                                            <View style={styles.projectTitleContainer}>
                                                <MaterialIcons
                                                    name="folder-special"
                                                    size={20}
                                                    color="#4caf50"
                                                />
                                                <ThemedText style={[styles.projectName, { color: textColor }]}>
                                                    {project.projectName}
                                                </ThemedText>
                                            </View>
                                            {project.targetValue && (
                                                <ThemedText style={[styles.projectPercentage, { color: '#4caf50' }]}>
                                                    {Math.min(progress, 100).toFixed(0)}%
                                                </ThemedText>
                                            )}
                                        </View>

                                        <View style={styles.projectAmounts}>
                                            <ThemedText style={[styles.projectSpent, { color: textColor }]}>
                                                {formatCurrency(project.totalValueRegistered)}
                                            </ThemedText>
                                            {project.targetValue && (
                                                <ThemedText style={[styles.projectTarget, { color: subtitleColor }]}>
                                                    de {formatCurrency(project.targetValue)}
                                                </ThemedText>
                                            )}
                                        </View>

                                        {project.targetValue && (
                                            <View style={styles.progressContainer}>
                                                <View style={styles.progressBarBg}>
                                                    <View
                                                        style={[
                                                            styles.progressBar,
                                                            {
                                                                width: `${Math.min(progress, 100)}%`,
                                                                backgroundColor: progress > 90 ? '#ff9800' : '#4caf50'
                                                            }
                                                        ]}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    salaryCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    salaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    salaryLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    salaryValue: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    limitContainer: {
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    limitLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    limitValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    strategyContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    miniCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    miniCardLabel: {
        fontSize: 11,
        marginTop: 8,
        marginBottom: 4,
    },
    miniCardValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    goalsCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    goalsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    goalsIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    goalsInfo: {
        flex: 1,
    },
    goalsLabel: {
        fontSize: 14,
        marginBottom: 2,
    },
    goalsValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    projectsStatsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    projectStatCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    projectStatValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    projectStatLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    activeProjectsList: {
        gap: 12,
    },
    projectCard: {
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    projectTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    projectName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    projectPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    projectAmounts: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 12,
    },
    projectSpent: {
        fontSize: 18,
        fontWeight: '600',
    },
    projectTarget: {
        fontSize: 14,
    },
    progressContainer: {
        marginTop: 4,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
});