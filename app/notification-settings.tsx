// screens/NotificationSettings.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiRequest } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotificationSettings {
    billReminders: boolean;
    spendingAlerts: boolean;
    projectMilestones: boolean;
    reminderDays: number[];
}

export function NotificationSettingsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [settings, setSettings] = useState<NotificationSettings>({
        billReminders: true,
        spendingAlerts: true,
        projectMilestones: true,
        reminderDays: [3, 0, -1],
    });
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        loadSettings();
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        const { status } = await Notifications.getPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        setHasPermission(status === 'granted');

        if (status !== 'granted') {
            Alert.alert(
                'Permissão Negada',
                'Para receber notificações, você precisa permitir nas configurações do dispositivo.'
            );
        }
    };

    const loadSettings = async () => {
        try {
            const response = await apiRequest('/notifications/settings');
            setSettings(response);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSetting = async (key: keyof NotificationSettings, value: any) => {
        try {
            const newSettings = { ...settings, [key]: value };
            setSettings(newSettings);

            await apiRequest('/notifications/settings', 'PUT', {
                [key]: value,
            });
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a configuração');
            // Reverter mudança
            setSettings(settings);
        }
    };

    const testNotification = async () => {
        try {
            await apiRequest('/notifications/test', 'POST', {
                title: '🔔 Teste de Notificação',
                message: 'Se você está vendo isso, as notificações estão funcionando!',
            });
            Alert.alert('Sucesso', 'Notificação de teste enviada!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar notificação de teste');
        }
    };

    const backgroundColor = isDark ? '#1a1a1a' : '#f5f5f5';
    const cardBg = isDark ? '#2a2a2a' : '#ffffff';
    const textColor = isDark ? '#ffffff' : '#000000';
    const subtitleColor = isDark ? '#aaa' : '#666';

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Carregando...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor }]}>
            {/* Permissão de Notificações */}
            {!hasPermission && (
                <TouchableOpacity
                    style={[styles.permissionCard, { backgroundColor: '#ff9800' }]}
                    onPress={requestPermissions}
                >
                    <Ionicons name="notifications-off" size={24} color="white" />
                    <View style={styles.permissionTextContainer}>
                        <ThemedText style={styles.permissionTitle}>
                            Notificações Desativadas
                        </ThemedText>
                        <ThemedText style={styles.permissionSubtitle}>
                            Toque para ativar notificações
                        </ThemedText>
                    </View>
                </TouchableOpacity>
            )}

            {/* Configurações de Notificações */}
            <View style={[styles.section, { backgroundColor: cardBg }]}>
                <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
                    Tipos de Notificações
                </ThemedText>

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={[styles.settingTitle, { color: textColor }]}>
                            Lembretes de Contas
                        </ThemedText>
                        <ThemedText style={[styles.settingDescription, { color: subtitleColor }]}>
                            Receba lembretes sobre contas a vencer
                        </ThemedText>
                    </View>
                    <Switch
                        value={settings.billReminders}
                        onValueChange={(value) => updateSetting('billReminders', value)}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={settings.billReminders ? '#2196F3' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={[styles.settingTitle, { color: textColor }]}>
                            Alertas de Gastos
                        </ThemedText>
                        <ThemedText style={[styles.settingDescription, { color: subtitleColor }]}>
                            Notificações quando atingir limites de gastos
                        </ThemedText>
                    </View>
                    <Switch
                        value={settings.spendingAlerts}
                        onValueChange={(value) => updateSetting('spendingAlerts', value)}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={settings.spendingAlerts ? '#2196F3' : '#f4f3f4'}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <ThemedText style={[styles.settingTitle, { color: textColor }]}>
                            Marcos de Projetos
                        </ThemedText>
                        <ThemedText style={[styles.settingDescription, { color: subtitleColor }]}>
                            Avisos sobre progresso em projetos
                        </ThemedText>
                    </View>
                    <Switch
                        value={settings.projectMilestones}
                        onValueChange={(value) => updateSetting('projectMilestones', value)}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={settings.projectMilestones ? '#2196F3' : '#f4f3f4'}
                    />
                </View>
            </View>

            {/* Teste de Notificação */}
            <TouchableOpacity
                style={[styles.testButton, { backgroundColor: '#4CAF50' }]}
                onPress={testNotification}
            >
                <Ionicons name="notifications" size={20} color="white" />
                <ThemedText style={styles.testButtonText}>
                    Testar Notificações
                </ThemedText>
            </TouchableOpacity>

            {/* Informações Adicionais */}
            <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
                <Ionicons
                    name="information-circle"
                    size={20}
                    color={isDark ? '#4CAF50' : '#2196F3'}
                />
                <ThemedText style={[styles.infoText, { color: subtitleColor }]}>
                    As notificações são enviadas para lembrá-lo de contas a vencer,
                    alertar sobre limites de gastos e informar sobre o progresso dos seus projetos.
                </ThemedText>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    permissionTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    permissionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    permissionSubtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginTop: 2,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingDescription: {
        fontSize: 14,
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginVertical: 8,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        margin: 16,
        borderRadius: 12,
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        margin: 16,
        marginTop: 8,
        borderRadius: 12,
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        lineHeight: 20,
    },
});