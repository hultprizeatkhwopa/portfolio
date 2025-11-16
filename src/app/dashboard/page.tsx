import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.user_metadata?.full_name || user.email}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
            <h3 className="text-lg font-semibold mb-2">My Teams</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-pink-100 mt-2">Teams you're part of</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
            <h3 className="text-lg font-semibold mb-2">Events Registered</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-purple-100 mt-2">Upcoming events</p>
          </div>
          <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
            <h3 className="text-lg font-semibold mb-2">Submissions</h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-blue-100 mt-2">Project submissions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/profile" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-2">�</div>
              <p className="font-semibold text-gray-800">My Profile & QR</p>
            </Link>
            <Link href="/dashboard/team" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-2">�</div>
              <p className="font-semibold text-gray-800">Create Team</p>
            </Link>
            <Link href="/events" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-2">�</div>
              <p className="font-semibold text-gray-800">Browse Events</p>
            </Link>
            <Link href="/admin/scanner" className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center">
              <div className="text-3xl mb-2">📷</div>
              <p className="font-semibold text-gray-800">Admin Scanner</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start by creating a team or registering for an event!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
