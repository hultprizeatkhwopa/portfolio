'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: 'We pride in',
      description: 'veniam officia fugiat ea culpa aute occaecat nulla elit ex consequat ipsum et Lorem consectetur et labore nisi minim officia nulla Lorem pariatur consequat officia proident non fugiat mollit commodo',
      image: '/slide-1.jpeg'
    },
    {
      id: 2,
      title: 'Our Vision',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      image: '/slide-2.jpeg'
    },
    {
      id: 3,
      title: 'Our Mission',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.',
      image: '/slide-3.jpg'
    },
    {
      id: 4,
      title: 'Our Values',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
      image: '/slide-4.jpg'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      {/* Carousel Section */}
      <section className="relative w-full h-screen flex items-center overflow-hidden">
        {/* Bottom-right pink effect */}
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-300/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slides Container */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center h-full px-6 container mx-auto">
                {/* Left Side - Text Content */}
                <div className="space-y-6 relative z-20">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                    {slide.description}
                  </p>
                </div>

                {/* Right Side - Image */}
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] hidden lg:block">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover rounded-2xl"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 z-30"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 z-30"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
