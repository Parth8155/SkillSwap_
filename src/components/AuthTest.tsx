import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { config } from '../config/environment';

const AuthTest: React.FC = () => {
    const { user, isLoading, error, login, register, logout, clearError, isAuthenticated } = useAuth();
    const [testResult, setTestResult] = useState<string>('');
    const [testLoading, setTestLoading] = useState(false);

    const testLoginAPI = async () => {
        setTestLoading(true);
        setTestResult('');

        try {
            // Test login with dummy credentials
            const response = await authAPI.login({
                email: 'test@example.com',
                password: 'password123'
            });

            setTestResult(`✅ Login API Test Success: ${response.user.name}`);
        } catch (err: any) {
            setTestResult(`❌ Login API Test Failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setTestLoading(false);
        }
    };

    const testRegisterAPI = async () => {
        setTestLoading(true);
        setTestResult('');

        try {
            // Test register with dummy data
            const response = await authAPI.register({
                name: 'Test User',
                email: 'newuser@example.com',
                password: 'password123',
                confirmPassword: 'password123',
                role: 'Developer',
                location: 'Test City'
            });

            setTestResult(`✅ Register API Test Success: ${response.user.name}`);
        } catch (err: any) {
            setTestResult(`❌ Register API Test Failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setTestLoading(false);
        }
    };

    const testConnection = async () => {
        setTestLoading(true);
        setTestResult('');

        try {
            const response = await fetch(`${config.API_BASE_URL}/health`);
            const data = await response.json();

            if (response.ok) {
                setTestResult(`✅ Backend Connection: ${data.message}`);
            } else {
                setTestResult(`❌ Backend Connection Failed: ${data.message}`);
            }
        } catch (err: any) {
            setTestResult(`❌ Backend Connection Failed: ${err.message}`);
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Authentication Test Panel</h2>

            {/* Current Auth State */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Current Auth State</h3>
                <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Loading:</strong> {isLoading ? '🔄 Yes' : '✅ No'}</p>
                <p><strong>User:</strong> {user ? `${user.name} (${user.email})` : 'None'}</p>
                <p><strong>Error:</strong> {error || 'None'}</p>
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                    onClick={testConnection}
                    disabled={testLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {testLoading ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                    onClick={testLoginAPI}
                    disabled={testLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                    {testLoading ? 'Testing...' : 'Test Login API'}
                </button>

                <button
                    onClick={testRegisterAPI}
                    disabled={testLoading}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
                >
                    {testLoading ? 'Testing...' : 'Test Register API'}
                </button>
            </div>

            {/* Test Results */}
            {testResult && (
                <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h3 className="font-semibold mb-2">Test Result</h3>
                    <p className="text-sm">{testResult}</p>
                </div>
            )}

            {/* Auth Controls */}
            <div className="space-y-4">
                <h3 className="font-semibold">Auth Controls</h3>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-700">{error}</p>
                        <button
                            onClick={clearError}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Clear Error
                        </button>
                    </div>
                )}

                {isAuthenticated ? (
                    <div className="space-y-2">
                        <p className="text-green-600">✅ Logged in as {user?.name}</p>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-gray-600">Not authenticated</p>
                        <button
                            onClick={() => {
                                login({
                                    email: 'test@example.com',
                                    password: 'password123'
                                }).catch(() => {
                                    // Error handled by useAuth
                                });
                            }}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Logging in...' : 'Test Login'}
                        </button>
                    </div>
                )}
            </div>

            {/* API Configuration */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">API Configuration</h3>
                <p className="text-sm text-gray-600">
                    <strong>API Base URL:</strong> {config.API_BASE_URL}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>Socket URL:</strong> {config.SOCKET_URL}
                </p>
            </div>
        </div>
    );
};

export default AuthTest;
