import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSocket } from './context/SocketContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Sidebar from './components/Sidebar';
import Dashboard from './components/pages/Dashboard';
import MySkills from './components/pages/MySkills';
import FindSkills from './components/pages/FindSkills';
import SwapRequests from './components/pages/SwapRequests';
import Messages from './components/pages/Messages';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import ConnectionStatus from './components/ConnectionStatus';
import AuthTest from './components/AuthTest';
import TokenDebugger from './components/TokenDebugger';
import { PageType } from './types';

function App() {
  const { user, isLoading, error, login, register, logout, clearError, isAuthenticated } = useAuth();
  const { connect, disconnect } = useSocket();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('authToken');
      if (token) {
        connect(token);
      }
    } else {
      disconnect();
    }
    // Only run when authentication status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogout = () => {
    disconnect();
    logout();
  };

  // If not authenticated, show auth pages with connection test
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-lime-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <ConnectionStatus />
          </div>
          <div className="mb-8">
            <AuthTest />
          </div>
          <div className="mb-8">
            <TokenDebugger />
          </div>
          {authMode === 'login' ? (
            <Login
              onLogin={login}
              onSwitchToRegister={() => {
                setAuthMode('register');
                clearError();
              }}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <Register
              onRegister={register}
              onSwitchToLogin={() => {
                setAuthMode('login');
                clearError();
              }}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard isSidebarCollapsed={isSidebarCollapsed} />;
      case 'my-skills':
        return <MySkills isSidebarCollapsed={isSidebarCollapsed} />;
      case 'find-skills':
        return <FindSkills isSidebarCollapsed={isSidebarCollapsed} />;
      case 'swap-requests':
        return <SwapRequests isSidebarCollapsed={isSidebarCollapsed} />;
      case 'messages':
        return <Messages isSidebarCollapsed={isSidebarCollapsed} />;
      case 'profile':
        return <Profile isSidebarCollapsed={isSidebarCollapsed} />;
      case 'settings':
        return <Settings isSidebarCollapsed={isSidebarCollapsed} />;
      default:
        return <Dashboard isSidebarCollapsed={isSidebarCollapsed} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-lime-50 flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        user={user}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
      />
      {renderPage()}
    </div>
  );
}

export default App;