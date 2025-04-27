import React from 'react'
import Navbar from '@/components/Navbar'
import UserManagement from '@/components/UserManagement'
import FloatingChat from '@/components/FloatingChat'

const UsersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <UserManagement />
      </main>
      <FloatingChat />
    </div>
  )
}

export default UsersPage
