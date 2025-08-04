import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from './ThemedText';

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
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const cardBg = useThemeColor({ light: '#f5f5f5', dark: '#1a1a1a' }, 'background');
    const textColor = useThemeColor({ light: '#333', dark: '#fff' }, 'text');
    const subtitleColor = useThemeColor({ light: '#666', dark: '#aaa' }, 'text');

    const activeProjects = projects.filter(p => p.status === 'ACTIVE');
    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const totalProjectsValue = projects.reduce((sum, p) => sum + p.totalValueRegistered, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
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

    if (!projects || projects.length === 0) return null;

    return (
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
                        R$ {formatCompactCurrency(totalProjectsValue)}
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
    );
};

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
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
        minHeight: 90,
    },
    projectStatValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
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