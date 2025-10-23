import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

const LogoutButton = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // console.error('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 transition duration-200 rounded-md"
        >
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          )}
          <span className="hidden sm:block">{user?.name || 'User'}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <button
              onClick={handleProfileClick}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
            >
              <Settings className="w-4 h-4 mr-3" />
              My Profile
            </button>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutButton;
