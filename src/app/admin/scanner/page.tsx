'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the QR scanner to avoid SSR issues
const QRScanner = dynamic(
  () => import('@/components/QRScanner'),
  { 
    ssr: false,
    loading: () => <div className="text-center p-4">Loading scanner...</div>
  }
)

export default function AdminScannerPage() {
  const [user, setUser] = useState<any>(null)
  const [scanning, setScanning] = useState(false)
  const [recentScans, setRecentScans] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>('')
  const [events, setEvents] = useState<any[]>([])
  const [location, setLocation] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      fetchEvents()
      fetchRecentScans(user.id)
    }

    checkAuth()
  }, [router])

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false })

    if (data) {
      setEvents(data)
    }
  }

  const fetchRecentScans = async (adminId: string) => {
    const { data } = await supabase
      .from('attendance')
      .select(`
        *,
        profiles:user_id(full_name, email),
        events(title)
      `)
      .eq('scanned_by', adminId)
      .order('scanned_at', { ascending: false })
      .limit(20)

    if (data) {
      setRecentScans(data)
    }
  }

  const handleScan = async (scannedData: string) => {
    try {
      // Try to parse as JSON first
      let qrData: any
      try {
        qrData = JSON.parse(scannedData)
      } catch {
        // If not JSON, treat as plain user ID
        qrData = { userId: scannedData }
      }

      const userId = qrData.userId || qrData.id || qrData.user_id

      if (!userId) {
        setMessage({ type: 'error', text: 'Invalid QR code format - no user ID found' })
        console.error('QR Data received:', qrData)
        return
      }

      console.log('Scanning for user ID:', userId)

      // Verify it's a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(userId)) {
        setMessage({ type: 'error', text: `Invalid user ID format: ${userId}` })
        return
      }

      // Check if user exists in profiles table
      console.log('Looking up profile for user:', userId)
      const { data: profile, error: profileError, count } = await supabase
        .from('profiles')
        .select('full_name, email', { count: 'exact' })
        .eq('id', userId)
        .maybeSingle()

      console.log('Profile query result:', { profile, error: profileError, count })

      if (profileError) {
        console.error('Profile lookup error:', JSON.stringify(profileError, null, 2))
        setMessage({ 
          type: 'error', 
          text: `Database error: ${profileError.message || 'Unknown error occurred'}` 
        })
        return
      }

      if (!profile) {
        // Try to get user info from QR data as fallback
        const userName = qrData.fullName || qrData.email || 'Unknown User'
        
        setMessage({ 
          type: 'error', 
          text: `User "${userName}" not found in profiles table. They may need to complete registration.` 
        })
        return
      }

      console.log('✓ Found profile:', profile)

      // Insert attendance record
      const { error: insertError } = await supabase
        .from('attendance')
        .insert({
          user_id: userId,
          scanned_by: user?.id,
          event_id: selectedEvent || null,
          location: location || null,
          scanned_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        setMessage({ type: 'error', text: `Error: ${insertError.message}` })
        return
      }

      const displayName = profile?.full_name || qrData.fullName || qrData.email || 'User'
      setMessage({ 
        type: 'success', 
        text: `✓ Attendance recorded for ${displayName}` 
      })
      
      // Play success sound (optional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE')
        audio.play().catch(() => {})
      } catch {}
      
      // Refresh recent scans
      if (user?.id) {
        fetchRecentScans(user.id)
      }
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err: any) {
      console.error('Scan error:', err)
      setMessage({ type: 'error', text: err.message || 'Invalid QR code data' })
    }
  }

  const handleError = (error: any) => {
    console.error('Scanner error:', error)
    setMessage({ type: 'error', text: 'Camera access denied or error occurred' })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin QR Scanner</h1>
            <p className="text-gray-600">Scan participant QR codes to track attendance</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scanner Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code Scanner</h2>

              {/* Scanner Controls */}
              <div className="mb-4 space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Event (Optional)
                  </label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">General Attendance</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., KCE Auditorium"
                  />
                </div>
              </div>

              {/* Message Display */}
              {message.text && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Scanner Toggle */}
              <button
                onClick={() => setScanning(!scanning)}
                className={`w-full mb-4 ${scanning ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'}`}
              >
                {scanning ? '⏸ Stop Scanning' : '📷 Start Scanning'}
              </button>

              {/* QR Scanner Component */}
              {scanning && (
                <div className="border-4 border-primary rounded-lg overflow-hidden">
                  <QRScanner onScan={handleScan} onError={handleError} />
                </div>
              )}

              {!scanning && (
                <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <p className="text-gray-500">Click "Start Scanning" to begin</p>
                </div>
              )}
            </div>

            {/* Recent Scans */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Scans</h2>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {recentScans.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scans yet</p>
                ) : (
                  recentScans.map((scan) => (
                    <div key={scan.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {scan.profiles?.full_name || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-600">{scan.profiles?.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(scan.scanned_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>📅 {scan.events?.title || 'General'}</p>
                        {scan.location && <p>📍 {scan.location}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="card bg-gradient-to-br from-primary to-primary-dark text-white">
              <h3 className="text-lg font-semibold mb-2">Total Scans Today</h3>
              <p className="text-3xl font-bold">
                {recentScans.filter(s => 
                  new Date(s.scanned_at).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="card bg-gradient-to-br from-purple-500 to-purple-700 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Scans</h3>
              <p className="text-3xl font-bold">{recentScans.length}</p>
            </div>
            <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <h3 className="text-lg font-semibold mb-2">Active Events</h3>
              <p className="text-3xl font-bold">
                {events.filter(e => e.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
