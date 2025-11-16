'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'

interface QRScannerProps {
  onScan: (data: string) => void
  onError: (error: any) => void
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [initError, setInitError] = useState<string>('')
  const [permissionStatus, setPermissionStatus] = useState<string>('checking')
  const [isRequesting, setIsRequesting] = useState(false)
  const lastScanRef = useRef<string>('')
  const lastScanTimeRef = useRef<number>(0)
  const permissionRequestedRef = useRef(false)

  // Request camera permission when component mounts
  const requestCameraPermission = async () => {
    if (permissionRequestedRef.current) return
    permissionRequestedRef.current = true
    setIsRequesting(true)

    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please use HTTPS or update your browser.')
      }

      console.log('Requesting camera permission...')
      
      // Request permission explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera on mobile
        } 
      })
      
      console.log('Camera permission granted')
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop())
      
      setPermissionStatus('granted')
      setIsRequesting(false)
    } catch (err: any) {
      console.error('Permission request failed:', err)
      setIsRequesting(false)
      
      // Check for HTTPS requirement
      const hostname = window.location.hostname
      const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
      const isLocalNetwork = /^192\.168\.\d+\.\d+$/.test(hostname) || /^10\.\d+\.\d+\.\d+$/.test(hostname) || /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname)
      
      if (window.location.protocol !== 'https:' && !isLocalHost && !isLocalNetwork) {
        setInitError('Camera requires HTTPS. Please access this page using https:// or localhost')
        setPermissionStatus('error')
        onError(new Error('HTTPS required'))
        return
      }
      
      // For local network IPs without HTTPS, show a different message
      if (window.location.protocol !== 'https:' && isLocalNetwork) {
        setInitError(`Camera access blocked on local network IP (${hostname}). Try: (1) Use http://localhost:3000 on this device, or (2) Set up HTTPS for local testing, or (3) Deploy to a server with HTTPS.`)
        setPermissionStatus('error')
        onError(new Error('Camera not available on local network without HTTPS'))
        return
      }
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setInitError('Camera permission denied. Please allow camera access and refresh the page.')
        setPermissionStatus('denied')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setInitError('No camera found on this device.')
        setPermissionStatus('no-camera')
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setInitError('Camera is already in use by another application.')
        setPermissionStatus('error')
      } else if (err.message && err.message.includes('not supported')) {
        setInitError('Camera API not supported. Please use a modern browser (Chrome, Safari, Edge) with HTTPS.')
        setPermissionStatus('error')
      } else {
        setInitError(`Camera access error: ${err.message || 'Unknown error'}`)
        setPermissionStatus('error')
      }
      onError(err)
    }
  }

  // Check and request permissions on mount
  useEffect(() => {
    requestCameraPermission()
  }, [])

  useEffect(() => {
    // Only start scanner if permission is granted
    if (permissionStatus !== 'granted') {
      return
    }

    let isMounted = true

    const startScanner = async () => {
      try {
        // Clear any previous error
        setInitError('')

        console.log('Starting QR scanner...')

        // Create scanner instance
        const html5QrCode = new Html5Qrcode('qr-reader', { verbose: false })
        scannerRef.current = html5QrCode

        // Get available cameras
        const cameras = await Html5Qrcode.getCameras()
        
        if (!cameras || cameras.length === 0) {
          throw new Error('No cameras found on this device')
        }

        console.log('Available cameras:', cameras.length)

        // Try to find back camera (environment) for mobile
        let cameraId = cameras[0].id
        
        // Look for back camera
        const backCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear') ||
          camera.label.toLowerCase().includes('environment')
        )
        
        if (backCamera) {
          cameraId = backCamera.id
          console.log('Using back camera:', backCamera.label)
        } else {
          console.log('Using default camera:', cameras[0].label)
        }

        // Start scanning with mobile-optimized config
        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              // Calculate QR box size based on screen size
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight)
              const qrboxSize = Math.floor(minEdge * 0.7)
              return {
                width: qrboxSize,
                height: qrboxSize
              }
            },
            aspectRatio: 1.0
          },
          (decodedText, decodedResult) => {
            // Prevent duplicate scans (debounce by 2 seconds)
            const now = Date.now()
            if (decodedText === lastScanRef.current && now - lastScanTimeRef.current < 2000) {
              return
            }

            lastScanRef.current = decodedText
            lastScanTimeRef.current = now

            console.log('QR Code scanned:', decodedText)
            
            // Vibrate on success (mobile only)
            if (navigator.vibrate) {
              navigator.vibrate(200)
            }
            
            onScan(decodedText)
          },
          (errorMessage) => {
            // Ignore common scanning errors (these happen continuously)
          }
        )

        if (isMounted) {
          setIsScanning(true)
          console.log('Scanner started successfully')
        }
      } catch (err: any) {
        console.error('Failed to start scanner:', err)
        const errorMsg = err.message || 'Failed to start camera'
        setInitError(errorMsg)
        onError(errorMsg)
      }
    }

    startScanner()

    // Cleanup function
    return () => {
      isMounted = false
      
      if (scannerRef.current) {
        const scanner = scannerRef.current
        
        try {
          // Check scanner state before stopping
          if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            scanner.stop()
              .then(() => {
                console.log('Scanner stopped successfully')
                scanner.clear()
              })
              .catch((err) => {
                console.error('Error stopping scanner:', err)
              })
          }
        } catch (err) {
          console.error('Cleanup error:', err)
        }
      }
    }
  }, [onScan, onError, permissionStatus])

  if (initError) {
    return (
      <div className="w-full p-8 text-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-700 font-semibold mb-2 text-lg">⚠️ Camera Error</p>
        <p className="text-red-600 text-sm mb-4">{initError}</p>
        
        {(initError.includes('HTTPS') || initError.includes('local network')) && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-semibold mb-2">🔒 Security Restriction</p>
            <p className="text-xs text-yellow-700 mb-3">
              Modern browsers require HTTPS for camera access (security feature).
            </p>
            <div className="text-xs text-left space-y-2">
              <p className="font-semibold text-yellow-800">Quick Solutions:</p>
              <div className="bg-yellow-100 p-3 rounded">
                <p className="font-semibold mb-1">✅ Option 1: Use localhost (Same Device)</p>
                <code className="text-xs bg-white px-2 py-1 rounded block">http://localhost:3000</code>
              </div>
              <div className="bg-yellow-100 p-3 rounded">
                <p className="font-semibold mb-1">✅ Option 2: Deploy with HTTPS</p>
                <p className="text-xs">Deploy to Vercel, Netlify, or any hosting with HTTPS</p>
              </div>
              {window.location.hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./) && (
                <div className="bg-yellow-100 p-3 rounded">
                  <p className="font-semibold mb-1">⚠️ Your Current URL:</p>
                  <code className="text-xs bg-white px-2 py-1 rounded block">{window.location.href}</code>
                  <p className="text-xs mt-2">This is a local network IP. Camera won't work without HTTPS.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-600 text-left mb-4">
          <p className="mb-2 font-semibold">Troubleshooting tips:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Use HTTPS:</strong> Make sure the URL starts with https:// (not http://)</li>
            <li><strong>Mobile:</strong> Tap "Allow" when prompted for camera access</li>
            <li><strong>Desktop:</strong> Click the camera icon 🎥 in the address bar and select "Allow"</li>
            <li><strong>Browser:</strong> Use Chrome, Safari, or Edge (latest version)</li>
            <li>Make sure no other app is using the camera</li>
            <li>Close other tabs that might be using the camera</li>
            <li>On mobile: Settings → Browser → Permissions → Camera → Allow</li>
          </ul>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold shadow-lg"
        >
          🔄 Try Again
        </button>
      </div>
    )
  }

  if (isRequesting || permissionStatus === 'checking') {
    return (
      <div className="w-full p-8 text-center bg-blue-50 rounded-lg border border-blue-200">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mb-4"></div>
        <p className="text-blue-700 font-semibold mb-2">Requesting Camera Permission</p>
        <p className="text-sm text-blue-600">Please allow camera access when prompted</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div id="qr-reader" className="w-full rounded-lg overflow-hidden"></div>
      {isScanning && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-center text-sm text-green-700 font-semibold">
            ✓ Camera Active - Position QR code within the frame
          </p>
        </div>
      )}
      {!isScanning && !initError && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-center text-sm text-blue-700">
            Initializing camera...
          </p>
        </div>
      )}
    </div>
  )
}
