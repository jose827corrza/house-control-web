import React from 'react';
import type { AuthUser } from 'aws-amplify/auth'; // Standard AWS Amplify v6 auth user type

interface TopHeaderProps {
  user: AuthUser | undefined;
  signOut: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ user, signOut }) => {
  // Extract a readable identifier from the Cognito user object safely
  const username = user?.signInDetails?.loginId || 'User';

  return (
    <header className="flex justify-between items-center bg-gray-900 border-b border-gray-800 px-6 py-4 text-white shadow-md w-full">
      {/* Persistent Title */}
      <div>
        <h1 className="text-xl font-bold tracking-wide">House Control Dashboard</h1>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center space-x-4">
        {user && (
          <span className="text-sm text-gray-300 hidden sm:inline">
            Welcome, <span className="font-semibold text-blue-400">{username}</span>
          </span>
        )}
        
        <button
          onClick={signOut}
          className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors shadow"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};