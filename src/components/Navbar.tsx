'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Hult Prize Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-800 hover:text-pink-500 transition-colors text-sm font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-800 hover:text-pink-500 transition-colors text-sm font-medium">
                About
              </a>
              <a href="#works" className="text-gray-800 hover:text-pink-500 transition-colors text-sm font-medium">
                Works
              </a>
              <a href="#team" className="text-gray-800 hover:text-pink-500 transition-colors text-sm font-medium">
                Team
              </a>
              <a href="#contact" className="text-gray-800 hover:text-pink-500 transition-colors text-sm font-medium">
                Contact
              </a>
            </div>

            {/* Right Side - Profile Icon (Menu Toggle) */}
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed right-6 top-20 bg-white shadow-xl rounded-lg border border-gray-200 py-2 min-w-[220px] z-50"
        >
          <Link
            href="/signup"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link
            href="/admin/login"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-pink-500 text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            Admin Login
          </Link>
        </div>
      )}
    </>
  )
}
