'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const sponsorshipTiers = [
  {
    id: 'student',
    title: 'Adopt a Student',
    amount: 1200,
    period: 'per year',
    description: 'Provide one student with complete access to our AI-powered English learning app for an entire academic year.',
    features: [
      'Full app access for 12 months',
      'Personalized learning path',
      'Progress tracking & reports',
      'Direct impact updates',
      'Tax-exemption certificate (80G)',
    ],
    impact: 'Transform one student\'s future',
    cta: 'Adopt Now',
    popular: true,
    images: [
      '/images/adopt_student.png',
      '/images/adopt_student_1.png',
      '/images/adopt_student_2.png'
    ]
  },
  {
    id: 'classroom',
    title: 'Adopt a Classroom',
    amount: 25000,
    period: 'per year',
    description: 'Sponsor an entire classroom of 30+ students, multiplying your impact across a whole learning community.',
    features: [
      'Full access for 30+ students',
      'Teacher training & support',
      'Classroom performance analytics',
      'Quarterly impact reports',
      'Recognition as classroom sponsor',
    ],
    impact: 'Empower an entire classroom',
    cta: 'Sponsor Classroom',
    popular: false,
    images: [
      '/images/adopt_classroom.png',
      '/images/adopt_classroom_1.png',
      '/images/adopt_classroom_2.png'
    ]
  },
  {
    id: 'school',
    title: 'Adopt a School',
    amount: 100000,
    period: 'per year',
    description: 'Make the biggest impact by supporting an entire school, reaching hundreds of students and their families.',
    features: [
      'Full school access (200+ students)',
      'Comprehensive teacher training',
      'Infrastructure support',
      'Community engagement programs',
      'Partnership recognition',
    ],
    impact: 'Transform an entire community',
    cta: 'Partner with Us',
    popular: false,
    images: [
      '/images/adopt_school.png',
      '/images/adopt_school_1.png'
    ]
  },
]

function ParticleExplosion({ tierId, cardIndex }: { tierId: string, cardIndex: number }) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const particles = [...Array(12)].map((_, index) => {
    const colors = [
      '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
      '#ec4899', '#6366f1', '#f97316', '#14b8a6', '#06b6d4',
      '#84cc16', '#059669'
    ];
    
    const randomColor = colors[index % colors.length];
    const randomDelay = Math.random() * 200; // 0-200ms delay
    const randomDuration = 2000 + Math.random() * 1000; // 2-3s duration for longer fall
    const randomX = -60 + Math.random() * 120; // -60px to +60px (wider spread)
    const randomY = 200 + Math.random() * 100; // 200-300px fall distance (much longer)
    const randomRotation = Math.random() * 1080; // 0-1080 degrees (more rotation)
    const randomSize = 6 + Math.random() * 6; // 6-12px size
    
    return {
      id: index,
      color: randomColor,
      delay: randomDelay,
      duration: randomDuration,
      x: randomX,
      y: randomY,
      rotation: randomRotation,
      size: randomSize
    };
  });

  // Calculate card position in grid (assumes 3 columns on large screens)
  const getCardPosition = () => {
    if (!isClient) {
      return {
        left: '50%',
        priceTop: '380px'
      };
    }
    
    if (window.innerWidth >= 1024) { // lg breakpoint
      // Large screens: 3 columns
      const cardWidth = 100 / 3; // 33.33% each
      const leftOffset = cardIndex * cardWidth;
      return {
        left: `${leftOffset + (cardWidth / 2)}%`, // Center of the card
        priceTop: '380px' // Approximate position of price area
      };
    } else {
      // Mobile: single column, cards are stacked
      return {
        left: '50%',
        priceTop: `${380 + (cardIndex * 600)}px` // Estimate card height and spacing
      };
    }
  };

  const cardPos = getCardPosition();

  return (
    <div className="absolute inset-0 pointer-events-none z-30" style={{ overflow: 'visible' }}>
      {particles.map((particle) => (
        <div
          key={`${tierId}-particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: cardPos.left,
            top: cardPos.priceTop,
            transformOrigin: 'center',
            animation: `particle-${tierId}-${particle.id} ${particle.duration}ms ease-out ${particle.delay}ms forwards`
          }}
        />
      ))}
      <style>{`
        ${particles.map((particle) => `
          @keyframes particle-${tierId}-${particle.id} {
            0% {
              transform: translate(-50%, 0) scale(0) rotate(0deg);
              opacity: 1;
            }
            15% {
              transform: translate(calc(-50% + ${particle.x * 0.3}px), -30px) scale(1.3) rotate(${particle.rotation * 0.2}deg);
              opacity: 1;
            }
            100% {
              transform: translate(calc(-50% + ${particle.x}px), ${particle.y}px) scale(0.2) rotate(${particle.rotation}deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
}

function CountSlider({ baseAmount, tierId, onCountChange, tierType, initialCount = 1 }: { baseAmount: number, tierId: string, onCountChange: (count: number, total: number, skipEffect?: boolean) => void, tierType: 'student' | 'classroom' | 'school', initialCount?: number }) {
  const getSliderConfig = () => {
    switch (tierType) {
      case 'student':
        return { min: 1, max: 25, label: 'students', singular: 'student' }
      case 'classroom':
        return { min: 1, max: 10, label: 'classrooms', singular: 'classroom' }
      case 'school':
        return { min: 1, max: 5, label: 'schools', singular: 'school' }
    }
  }

  const config = getSliderConfig()
  const [count, setCount] = useState(initialCount)

  // Initialize the count on mount and notify parent
  useEffect(() => {
    onCountChange(initialCount, baseAmount * initialCount, true) // Skip effect on initial load
  }, []) // Only run on mount

  const handleCountChange = (newCount: number) => {
    setCount(newCount)
    onCountChange(newCount, baseAmount * newCount) // Show effect on user interaction
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
      <div className="mb-3">
        <label className="block text-sm font-medium text-blue-800 mb-2">
          Number of {config.label} to adopt: {count}
        </label>
        <input
          type="range"
          min={config.min}
          max={config.max}
          value={count}
          onChange={(e) => handleCountChange(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((count - config.min) / (config.max - config.min)) * 100}%, #cbd5e1 ${((count - config.min) / (config.max - config.min)) * 100}%, #cbd5e1 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-blue-600 mt-1">
          <span>1 {config.singular}</span>
          <span>{config.max} {config.label}</span>
        </div>
      </div>
    </div>
  )
}

function ImageCarousel({ images, alt }: { images: string[], alt: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative h-full overflow-hidden">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="min-w-full h-full relative">
            <Image
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default function SponsorshipCards() {
  const [cardPricing, setCardPricing] = useState<{[key: string]: {count: number, total: number}}>({
    student: { count: 1, total: 1200 },
    classroom: { count: 1, total: 25000 },
    school: { count: 1, total: 100000 }
  })

  const [showPopper, setShowPopper] = useState<{[key: string]: boolean}>({})

  const handleCountChange = (tierId: string, count: number, total: number, skipEffect?: boolean) => {
    setCardPricing(prev => ({
      ...prev,
      [tierId]: { count, total }
    }))
    
    // Show popper effect only if not skipped
    if (!skipEffect) {
      setShowPopper(prev => ({ ...prev, [tierId]: true }))
      
      // Hide popper after animation
      setTimeout(() => {
        setShowPopper(prev => ({ ...prev, [tierId]: false }))
      }, 1500)
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Impact Level
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Every contribution, no matter the size, directly transforms lives. Choose how you want to make a difference in Tamil Nadu.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 relative">
          {/* Particle Effects for all cards */}
          {Object.keys(showPopper).map((tierId) => 
            showPopper[tierId] && (
              <ParticleExplosion key={`particles-${tierId}`} tierId={tierId} cardIndex={sponsorshipTiers.findIndex(t => t.id === tierId)} />
            )
          )}
          
          {sponsorshipTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                tier.popular
                  ? 'ring-4 ring-blue-500 bg-white'
                  : 'bg-white'
              }`}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              {/* Image Area - 50% height */}
              <div className="h-72 relative">
                <ImageCarousel 
                  images={tier.images} 
                  alt={tier.title}
                />
              </div>

              {/* Content Area - 50% */}
              <div className="p-6 lg:p-8 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  {tier.title}
                </h3>

                {/* Price */}
                <div className="text-center mb-4 relative">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(cardPricing[tier.id]?.total || tier.amount)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">{tier.period}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
                  {tier.description}
                </p>


                {/* Count Slider */}
                <CountSlider 
                  baseAmount={tier.amount} 
                  tierId={tier.id} 
                  tierType={tier.id as 'student' | 'classroom' | 'school'}
                  initialCount={cardPricing[tier.id]?.count || 1}
                  onCountChange={(count, total, skipEffect) => handleCountChange(tier.id, count, total, skipEffect)}
                />

                {/* CTA */}
                <Button
                  asChild
                  size="lg"
                  className={`w-full font-semibold ${
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <Link href={`/donate?type=${tier.id}&amount=${cardPricing[tier.id]?.total || 1200}&count=${cardPricing[tier.id]?.count || 1}`} className="flex items-center justify-center gap-2">
                    {tier.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Amount CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Want to contribute a different amount?
          </p>
          <Button asChild variant="outline" size="lg" className="border-2 hover:bg-gray-50">
            <Link href="/donate" className="flex items-center gap-2">
              Make a Custom Donation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}