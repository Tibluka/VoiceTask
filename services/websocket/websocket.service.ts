// services/websocket/websocket.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Socket } from 'socket.io-client';

interface NotificationData {
    type: string;
    title: string;
    message: string;
    timestamp: string;
    data?: any;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 5000;
    private isConnecting = false;
    private notificationListeners: ((notification: NotificationData) => void)[] = [];

    constructor() {
        this.setupNotificationHandler();
    }

    private setupNotificationHandler() {
        // Configurar como as notificações devem ser apresentadas
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }

    async connect() {
        if (this.socket?.connected || this.isConnecting) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        this.isConnecting = true;

        try {
            const token = await AsyncStorage.getItem('token');
            const apiUrl = process.env.EXPO_PUBLIC_API_URL;

            if (!token || !apiUrl) {
                console.error('No auth token or API URL found');
                this.isConnecting = false;
                return;
            }

            // Converter URL da API para URL do WebSocket
            // Se a API está em https://voicetaskapi.onrender.com

            const wsUrl = apiUrl
                .replace('/api', '')
                .replace('https://', 'wss://');

            console.log('Connecting to WebSocket:', wsUrl);

            // Conectar ao servidor WebSocket
            /*  this.socket = io(wsUrl, {
                 transports: ['websocket'],
                 autoConnect: true,
                 reconnection: true,
                 reconnectionDelay: this.reconnectDelay,
                 reconnectionAttempts: this.maxReconnectAttempts,
             }); */

            this.setupEventListeners(token);
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            this.isConnecting = false;
        }
    }

    private setupEventListeners(token: string) {
        if (!this.socket) return;

        // Evento de conexão estabelecida
        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.isConnecting = false;
            this.reconnectAttempts = 0;

            // Autenticar imediatamente após conectar
            this.authenticate(token);
        });

        // Evento de autenticação bem-sucedida
        this.socket.on('authenticated', () => {
            console.log('WebSocket authenticated');
            // Inscrever-se em todas as notificações
            this.subscribeToNotifications('all');
        });

        // Evento de erro de autenticação
        this.socket.on('auth_error', (data) => {
            console.error('WebSocket auth error:', data.message);
            this.disconnect();
        });

        // Evento de notificação recebida
        this.socket.on('notification', async (notification: NotificationData) => {
            console.log('Notification received:', notification);
            await this.handleNotification(notification);

            // Notificar listeners
            this.notificationListeners.forEach(listener => listener(notification));
        });

        // Evento de desconexão
        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            this.isConnecting = false;

            if (reason === 'io server disconnect') {
                // Servidor forçou desconexão, tentar reconectar
                this.attemptReconnect();
            }
        });

        // Evento de erro
        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // Evento de conexão bem-sucedida
        this.socket.on('connected', (data) => {
            console.log('Connected to notification service:', data.message);
        });

        // Evento de inscrição bem-sucedida
        this.socket.on('subscribed', (data) => {
            console.log('Subscribed to notifications:', data.type);
        });
    }

    private authenticate(token: string) {
        if (!this.socket) return;

        this.socket.emit('authenticate', { token });
    }

    private subscribeToNotifications(type: string = 'all') {
        if (!this.socket) return;

        this.socket.emit('subscribe_notifications', { type });
    }

    private async handleNotification(notification: NotificationData) {
        // Criar notificação local
        await this.scheduleLocalNotification(notification);
    }

    private async scheduleLocalNotification(notification: NotificationData) {
        try {
            // Solicitar permissão se necessário
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    console.log('Notification permissions not granted');
                    return;
                }
            }

            // Configurar conteúdo da notificação
            const notificationContent: Notifications.NotificationContentInput = {
                title: notification.title,
                body: notification.message,
                data: notification.data || {},
                sound: true,
                priority: this.getPriority(notification.severity),
            };

            // Android specific
            if (Platform.OS === 'android') {
                notificationContent.priority = this.getPriority(notification.severity);
                notificationContent.vibrate = [0, 250, 250, 250];
            }

            // iOS specific
            if (Platform.OS === 'ios') {
                notificationContent.sound = true;
            }

            // Agendar notificação imediata
            await Notifications.scheduleNotificationAsync({
                content: notificationContent,
                trigger: null, // null = imediato
            });

        } catch (error) {
            console.error('Error scheduling notification:', error);
        }
    }

    private getPriority(severity?: string): Notifications.AndroidNotificationPriority {
        switch (severity) {
            case 'critical':
                return Notifications.AndroidNotificationPriority.MAX;
            case 'high':
                return Notifications.AndroidNotificationPriority.HIGH;
            case 'medium':
                return Notifications.AndroidNotificationPriority.DEFAULT;
            case 'low':
                return Notifications.AndroidNotificationPriority.LOW;
            default:
                return Notifications.AndroidNotificationPriority.DEFAULT;
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(async () => {
            await this.connect();
        }, delay);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.isConnecting = false;
        this.reconnectAttempts = 0;
    }

    // Adicionar listener para notificações
    addNotificationListener(listener: (notification: NotificationData) => void) {
        this.notificationListeners.push(listener);

        // Retornar função para remover listener
        return () => {
            this.notificationListeners = this.notificationListeners.filter(l => l !== listener);
        };
    }

    // Métodos utilitários
    getConnectionStatus(): boolean {
        return this.socket?.connected || false;
    }

    isAuthenticated(): boolean {
        return this.socket?.connected || false;
    }
}

// Exportar instância única (singleton)
export const websocketService = new WebSocketService();

// Hook para usar em componentes React
import { useEffect, useState } from 'react';

export function useWebSocket() {
    const [isConnected, setIsConnected] = useState(false);
    const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);

    useEffect(() => {
        // Conectar ao montar
        websocketService.connect();

        // Adicionar listener para notificações
        const removeListener = websocketService.addNotificationListener((notification) => {
            setLastNotification(notification);
        });

        // Verificar status de conexão periodicamente
        const interval = setInterval(() => {
            setIsConnected(websocketService.getConnectionStatus());
        }, 1000);

        return () => {
            clearInterval(interval);
            removeListener();
        };
    }, []);

    return {
        isConnected,
        lastNotification,
        connect: () => websocketService.connect(),
        disconnect: () => websocketService.disconnect(),
    };
}