'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Users, BookOpen, Heart } from 'lucide-react'

const stats = [
  { label: 'Students Sponsored', value: '2,500+', icon: Users },
  { label: 'Schools Connected', value: '150+', icon: BookOpen },
  { label: 'Lives Transformed', value: '10,000+', icon: Heart },
]

export default function HeroBanner() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)

  return (
    <section className="min-h-screen flex items-center py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900" style={{ lineHeight: '1.15' }}>
                <span className="block">Unlock a Future.</span>
                <span className="block bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Gift the Power of English.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Help underprivileged students in Tamil Nadu break language barriers with our 
                AI-powered English learning app. Every donation directly transforms lives.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="xl" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Link href="/donate" className="flex items-center gap-2">
                  Adopt a Student Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-gray-300 hover:bg-gray-50"
                onClick={() => setVideoModalOpen(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hero_section_image.png"
                alt="Students learning with AI-powered English app"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating element */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal - placeholder for now */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={() => setVideoModalOpen(false)}>
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-4">
            <p className="text-center text-gray-600">Video player would be implemented here with the organization&apos;s story video.</p>
            <Button 
              className="mt-4 mx-auto block" 
              onClick={() => setVideoModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}