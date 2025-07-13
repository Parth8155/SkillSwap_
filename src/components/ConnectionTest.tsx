import React, { useState } from 'react';
import { config } from '../config/environment';

const ConnectionTest: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');

    const testConnection = async () => {
        setStatus('testing');
        setMessage('');

        try {
            // Test backend connection
            const response = await fetch(`${config.API_BASE_URL}/health`);
            if (response.ok) {
                const data = await response.json();
                setStatus('success');
                setMessage(`Backend connection successful! Server: ${data.message}`);
            } else {
                throw new Error('Backend not responding');
            }
        } catch (error) {
            setStatus('error');
            setMessage(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Backend Connection Test</h3>
            <button
                onClick={testConnection}
                disabled={status === 'testing'}
                className={`px-4 py-2 rounded ${status === 'testing'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
            >
                {status === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>

            {message && (
                <p className={`mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default ConnectionTest;
