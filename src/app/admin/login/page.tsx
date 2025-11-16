'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Admin credentials check
      // In a real app, you'd validate against a secure admin table
      // For now, we'll use email format: admin-{id}@hultprize.kce
      const adminEmail = `${adminId}@hultprize.kce`

      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password,
      })

      if (error) {
        setError('Invalid Admin ID or Password')
      } else {
        router.push('/admin/scanner')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Admin Access</h2>
          <p className="text-gray-600">Enter your administrator credentials</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-2">
              Admin ID
            </label>
            <input
              id="adminId"
              type="text"
              required
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter your admin ID"
              autoComplete="username"
            />
            <p className="text-xs text-gray-500 mt-1">Example: admin001, admin-hult, etc.</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In as Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm mb-2">
            Not an admin?
          </p>
          <Link href="/login" className="text-primary hover:text-primary-dark font-semibold text-sm">
            Regular User Login
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ⚠️ Admin access is restricted to authorized personnel only.
            All login attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  )
}
