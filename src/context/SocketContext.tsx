import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socket';

interface SocketContextType {
    isConnected: boolean;
    onlineUsers: string[];
    connect: (token: string) => void;
    disconnect: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const connect = (token: string) => {
        const socket = socketService.connect(token);

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('userOnline', (userId: string) => {
            setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId]);
        });

        socket.on('userOffline', (userId: string) => {
            setOnlineUsers(prev => prev.filter(id => id !== userId));
        });

        socket.on('onlineUsers', (users: string[]) => {
            setOnlineUsers(users);
        });
    };

    const disconnect = () => {
        socketService.disconnect();
        setIsConnected(false);
        setOnlineUsers([]);
    };

    // Disconnect on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SocketContext.Provider value={{ isConnected, onlineUsers, connect, disconnect }}>
            {children}
        </SocketContext.Provider>
    );
};
