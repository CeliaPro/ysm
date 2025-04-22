
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import UserManagement from '@/components/UserManagement';
import FloatingChat from '@/components/FloatingChat';

const UsersPage = () => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  // Si non authentifié, rediriger vers la connexion
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si non admin, rediriger vers le tableau de bord
  if (!isLoading && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <UserManagement />
      </main>
      <FloatingChat />
    </div>
  );
};

export default UsersPage;
