'use client'

import { useState, useRef } from 'react'
import CircularGallery from './CircularGallery'

export default function WorksSection() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number } | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const eventDetails: Record<string, any> = {
    'Orientation': {
      title: 'Orientation',
      details: 'Developing Business Plan',
      date: 'Wednesday, 17th Jun',
      time: '8:00 - 11:00AM',
      location: 'Hall 3, Khwopa College',
      facilitator: 'Nikhil Shakya',
      role: 'Managing Director, Skill Square Pvt. Ltd'
    },
    'Workshop': {
      title: 'Workshop',
      details: 'Business Model Canvas',
      date: 'Wednesday, 18th Jun',
      time: '9:00 - 12:00PM',
      location: 'Hall 2, Khwopa College',
      facilitator: 'Jane Smith',
      role: 'Business Strategist'
    },
    'Pitch Day': {
      title: 'Pitch Day',
      details: 'Final Presentations',
      date: 'Wednesday, 19th Jun',
      time: '10:00 - 1:00PM',
      location: 'Hall 1, Khwopa College',
      facilitator: 'Raj Patel',
      role: 'Innovation Lead'
    },
    'Networking': {
      title: 'Networking',
      details: 'Industry Meetup',
      date: 'Thursday, 20th Jun',
      time: '2:00 - 5:00PM',
      location: 'Auditorium, Khwopa College',
      facilitator: 'Lisa Chen',
      role: 'Startup Mentor'
    },
    'Training': {
      title: 'Training',
      details: 'Social Impact',
      date: 'Thursday, 21st Jun',
      time: '9:00 - 12:00PM',
      location: 'Lab A, Khwopa College',
      facilitator: 'David Kumar',
      role: 'Impact Consultant'
    },
    'Awards': {
      title: 'Awards',
      details: 'Prize Distribution',
      date: 'Friday, 22nd Jun',
      time: '3:00 - 5:00PM',
      location: 'Main Hall, Khwopa College',
      facilitator: 'Priya Singh',
      role: 'Program Coordinator'
    }
  }

  const galleryItems = [
    { 
      text: 'Orientation', 
      image: '/slide-1.jpeg'
    },
    { 
      text: 'Workshop', 
      image: '/slide-2.jpeg'
    },
    { 
      text: 'Pitch Day', 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    },
    { 
      text: 'Networking', 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    },
    { 
      text: 'Training', 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    },
    { 
      text: 'Awards', 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
    }
  ]

  // Handle gallery item click - calculate position and animate
  const handleGalleryClick = (itemText: string) => {
    if (!selectedCard && eventDetails[itemText] && galleryRef.current) {
      // Calculate initial position (center of gallery)
      const rect = galleryRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      setCardPosition({ x: centerX, y: centerY })
      setSelectedCard(itemText)
    }
  }

  const closeCard = () => {
    setSelectedCard(null)
    setCardPosition(null)
  }

  return (
    <section id="works" className="min-h-screen bg-white py-20 md:py-40 flex flex-col relative">
      <div className="absolute top-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-300/15 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 w-full relative z-10 mb-12">
        {/* Title in Box */}
        <div className="border-4 border-purple-500 rounded-2xl p-8 md:p-12 bg-white inline-block">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black">Our Recent Works</h2>
        </div>
      </div>

      {/* Description */}
      <div className="container mx-auto px-4 w-full relative z-10 mb-12">
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-2xl">
          Lorem sunt enim ut tempor voluptate voluptate sint dolore officia laboris tempor duis excepteur dolor ipsum ullamco eiusmod laborum fugiat duis cupidatat proident nulla irure fugiat nisi deserunt in do sit nostrud officia aliqua ex ipsum laboris laborum consequat laborum sunt labore dolor duis culpa veniam nisi ullamco cillum amet
        </p>
      </div>

      {/* Circular Gallery */}
      <div ref={galleryRef} className="w-full h-96 md:h-[500px] relative">
        <CircularGallery 
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          font="bold 30px Figtree"
          scrollSpeed={2}
          scrollEase={0.05}
          onItemClick={handleGalleryClick}
        />
      </div>

      {/* Selected Card - Animates from gallery to top-right */}
      {selectedCard && eventDetails[selectedCard] && (
        <div 
          className={`fixed w-96 bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto transition-all duration-700 ease-out ${
            selectedCard ? 'top-6 right-6 opacity-100 z-50' : ''
          }`}
          style={{
            transformOrigin: 'center center',
          }}
        >
          <button
            onClick={closeCard}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
          
          <div className="space-y-4 pr-6">
            <div>
              <h3 className="text-3xl font-bold text-black">{eventDetails[selectedCard].title}</h3>
            </div>

            <div className="bg-gradient-to-br from-pink-300 to-yellow-300 rounded-xl p-4 h-48 flex items-center justify-center">
              <p className="text-gray-700 text-center font-semibold">Event Image</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-pink-600 font-bold text-lg">{eventDetails[selectedCard].details}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-gray-700 text-sm flex items-center gap-2">
                    <span className="font-bold">📅</span>
                    <span>{eventDetails[selectedCard].date}</span>
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 text-sm flex items-center gap-2">
                    <span className="font-bold">⏰</span>
                    <span>{eventDetails[selectedCard].time}</span>
                  </p>
                </div>

                <div>
                  <p className="text-gray-700 text-sm flex items-center gap-2">
                    <span className="font-bold">📍</span>
                    <span>{eventDetails[selectedCard].location}</span>
                  </p>
                </div>

                <div className="pt-3">
                  <p className="text-gray-600 text-sm font-semibold">{eventDetails[selectedCard].facilitator}</p>
                  <p className="text-gray-600 text-sm">{eventDetails[selectedCard].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </section>
  )
}
