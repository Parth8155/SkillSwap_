import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { config } from '../config/environment';

interface ConnectionStatus {
    api: 'connected' | 'disconnected' | 'checking';
    socket: 'connected' | 'disconnected' | 'checking';
}

const ConnectionStatus: React.FC = () => {
    const [status, setStatus] = useState<ConnectionStatus>({
        api: 'checking',
        socket: 'checking'
    });
    const [apiMessage, setApiMessage] = useState<string>('');

    const checkApiConnection = async () => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                setStatus(prev => ({ ...prev, api: 'connected' }));
                setApiMessage(data.message || 'API Connected');
            } else {
                setStatus(prev => ({ ...prev, api: 'disconnected' }));
                setApiMessage('API not responding');
            }
        } catch (error) {
            setStatus(prev => ({ ...prev, api: 'disconnected' }));
            setApiMessage('API connection failed');
        }
    };

    const checkSocketConnection = async () => {
        try {
            // Check if socket.io server is running by connecting briefly
            const testSocket = io(config.SOCKET_URL, {
                autoConnect: false,
                timeout: 5000
            });

            testSocket.connect();

            testSocket.on('connect', () => {
                setStatus(prev => ({ ...prev, socket: 'connected' }));
                testSocket.disconnect();
            });

            testSocket.on('connect_error', () => {
                setStatus(prev => ({ ...prev, socket: 'disconnected' }));
                testSocket.disconnect();
            });

            // Timeout fallback
            setTimeout(() => {
                if (testSocket.connected === false) {
                    setStatus(prev => ({ ...prev, socket: 'disconnected' }));
                    testSocket.disconnect();
                }
            }, 5000);

        } catch (error) {
            setStatus(prev => ({ ...prev, socket: 'disconnected' }));
        }
    };

    useEffect(() => {
        checkApiConnection();
        checkSocketConnection();

        // Check every 30 seconds
        const interval = setInterval(() => {
            checkApiConnection();
            checkSocketConnection();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'text-green-600';
            case 'disconnected': return 'text-red-600';
            case 'checking': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return '✅';
            case 'disconnected': return '❌';
            case 'checking': return '🔄';
            default: return '❓';
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Connection Status</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Backend:</span>
                    <span className={`text-sm font-medium ${getStatusColor(status.api)}`}>
                        {getStatusIcon(status.api)} {status.api}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Socket Server:</span>
                    <span className={`text-sm font-medium ${getStatusColor(status.socket)}`}>
                        {getStatusIcon(status.socket)} {status.socket}
                    </span>
                </div>

                {apiMessage && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
                        {apiMessage}
                    </div>
                )}

                <div className="mt-3 text-xs text-gray-500">
                    <div>API: {config.API_BASE_URL}</div>
                    <div>Socket: {config.SOCKET_URL}</div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionStatus;
