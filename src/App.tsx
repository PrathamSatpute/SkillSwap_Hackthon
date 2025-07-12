import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import BrowseSkills from './components/Home/BrowseSkills';
import ProfileView from './components/Profile/ProfileView';
import SwapRequestsList from './components/Swaps/SwapRequestsList';
import AdminPanel from './components/Admin/AdminPanel';

function AppContent() {
  const { state, searchUsers } = useApp();
  const { currentUser } = state;
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState('home');

  if (!currentUser) {
    return authMode === 'login' ? (
      <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <BrowseSkills />;
      case 'profile':
        return <ProfileView />;
      case 'swaps':
        return <SwapRequestsList />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return <ProfileView />;
      default:
        return <BrowseSkills />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={(term) => searchUsers(term, state.selectedCategory)} searchTerm={state.searchTerm} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {state.adminMessages.filter(msg => msg.isActive).slice(0, 1).map(message => (
            <div key={message.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-purple-900">{message.title}</h3>
                  <p className="text-sm text-purple-800 mt-1">{message.content}</p>
                  <p className="text-xs text-purple-600 mt-2">
                    {new Date(message.createdDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;