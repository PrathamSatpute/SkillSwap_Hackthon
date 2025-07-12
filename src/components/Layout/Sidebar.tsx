import React from 'react';
import { Home, User, MessageSquare, Settings, Shield, BarChart3 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const { state } = useApp();
  const { currentUser } = state;

  const userMenuItems = [
    { id: 'home', label: 'Browse Skills', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'swaps', label: 'Swap Requests', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const adminMenuItems = [
    ...userMenuItems,
    { id: 'admin', label: 'Admin Panel', icon: Shield },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}