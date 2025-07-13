import React, { useState } from 'react';

const TokenDebugger: React.FC = () => {
    const [tokenInfo, setTokenInfo] = useState<any>(null);

    const checkToken = () => {
        const token = localStorage.getItem('authToken');
        console.log('Raw token from localStorage:', token);

        if (token) {
            try {
                // Try to decode the JWT token (just the payload, not verifying signature)
                const parts = token.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(atob(parts[1]));
                    setTokenInfo({
                        token: token,
                        length: token.length,
                        parts: parts.length,
                        payload: payload,
                        isValid: true
                    });
                } else {
                    setTokenInfo({
                        token: token,
                        length: token.length,
                        parts: parts.length,
                        isValid: false,
                        error: 'Invalid JWT format'
                    });
                }
            } catch (error) {
                setTokenInfo({
                    token: token,
                    length: token.length,
                    isValid: false,
                    error: (error as Error).message
                });
            }
        } else {
            setTokenInfo({
                token: null,
                message: 'No token found in localStorage'
            });
        }
    };

    const clearToken = () => {
        localStorage.removeItem('authToken');
        setTokenInfo(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">JWT Token Debugger</h2>

            <div className="space-y-4">
                <div className="flex space-x-4">
                    <button
                        onClick={checkToken}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Check Token
                    </button>
                    <button
                        onClick={clearToken}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Clear Token
                    </button>
                </div>

                {tokenInfo && (
                    <div className="p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold mb-2">Token Information:</h3>
                        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                            {JSON.stringify(tokenInfo, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenDebugger;
