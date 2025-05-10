import Dashboard from '@/components/Dashboard'
import Navbar from '@/components/Navbar'
import FloatingChat from '@/components/FloatingChat'

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Dashboard />
      </main>
      <FloatingChat />
    </div>
  )
}
