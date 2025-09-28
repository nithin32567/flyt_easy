import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
        🔄 Checking authentication...
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="fixed top-4 left-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
        ✅ Authenticated as: {user?.name || user?.email}
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
      ❌ Not authenticated
    </div>
  );
};

export default AuthStatus;
