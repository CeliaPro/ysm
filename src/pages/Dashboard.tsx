
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import Navbar from '@/components/Navbar';
import FloatingChat from '@/components/FloatingChat';

const DashboardPage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si non authentifié, rediriger vers la connexion
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
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
        <Dashboard />
      </main>
      <FloatingChat />
    </div>
  );
};

export default DashboardPage;
