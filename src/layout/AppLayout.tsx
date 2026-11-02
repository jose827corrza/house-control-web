import React from 'react';
import { Outlet } from 'react-router';
import { TopHeader } from '../components/TopHeader';
import type { AuthUser } from 'aws-amplify/auth';

interface AppLayoutProps {
  user: AuthUser | null;
  signOut: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ user, signOut }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header stays persistent and sticky across all child routes */}
      <TopHeader user={user} signOut={signOut} />

      {/* Dynamic screen content renders here */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};