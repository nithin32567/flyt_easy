import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const LogoutButton = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      {/* User info */}
      <div className="flex items-center space-x-2 text-white">
        {user?.picture ? (
          <img 
            src={user.picture} 
            alt={user.name} 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <span className="text-sm font-medium">{user?.name || 'User'}</span>
      </div>
      
      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton;
