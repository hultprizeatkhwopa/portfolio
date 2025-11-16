'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Generate QR Code with user UUID
      const qrData = JSON.stringify({
        userId: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || profileData?.full_name || '',
        timestamp: new Date().toISOString()
      })

      try {
        const url = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#ec4899',
            light: '#ffffff'
          }
        })
        setQrCodeUrl(url)
      } catch (err) {
        console.error('Error generating QR code:', err)
      }

      setLoading(false)
    }

    fetchUserData()
  }, [router])

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `hult-prize-qr-${user?.id}.png`
      link.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
          <p className="text-xl text-gray-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-gray-800">{user?.user_metadata?.full_name || profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">User ID</label>
                  <p className="text-gray-800 text-xs font-mono break-all">{user?.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Student ID</label>
                  <p className="text-gray-800">{profile?.student_id || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Department</label>
                  <p className="text-gray-800">{profile?.department || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Year</label>
                  <p className="text-gray-800">{profile?.year || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My QR Code</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Show this QR code to administrators for attendance tracking
              </p>
              
              {qrCodeUrl && (
                <div className="mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="Profile QR Code" 
                    className="mx-auto border-4 border-primary rounded-lg shadow-lg"
                  />
                </div>
              )}

              <button
                onClick={downloadQRCode}
                className="btn-primary"
              >
                Download QR Code
              </button>

              <p className="text-xs text-gray-500 mt-4">
                This QR code contains your unique user ID and profile information
              </p>
            </div>
          </div>

          {/* Attendance History */}
          <div className="card mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Attendance History</h2>
            <AttendanceHistory userId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AttendanceHistory({ userId }: { userId: string }) {
  const [attendance, setAttendance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, events(title)')
        .eq('user_id', userId)
        .order('scanned_at', { ascending: false })
        .limit(10)

      if (data) {
        setAttendance(data)
      }
      setLoading(false)
    }

    if (userId) {
      fetchAttendance()
    }
  }, [userId])

  if (loading) {
    return <p className="text-gray-600">Loading attendance history...</p>
  }

  if (attendance.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No attendance records yet</p>
        <p className="text-sm mt-2">Your QR code scans will appear here</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Event</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id} className="border-b border-gray-100">
              <td className="py-3 px-4 text-gray-800">
                {new Date(record.scanned_at).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {record.events?.title || 'General Attendance'}
              </td>
              <td className="py-3 px-4 text-gray-800">
                {record.location || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
