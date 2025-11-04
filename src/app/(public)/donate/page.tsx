'use client'

import { Suspense } from 'react'
import DonationForm from '@/components/public/DonationForm'

function DonatePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Distraction-free header */}
      <div className="py-8 text-center border-b bg-white/80 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Support DreamDaa&apos;s Mission
        </h1>
        <p className="text-gray-600 mt-2">Every donation directly transforms a student&apos;s future</p>
      </div>

      {/* Main content */}
      <div className="py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donation form...</p>
            </div>
          </div>
        }>
          <DonationForm />
        </Suspense>
      </div>

      {/* Trust indicators footer */}
      <div className="bg-white border-t py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="text-green-500">🔒</div>
              <span className="text-sm text-gray-600">SSL Secured</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="text-blue-500">📋</div>
              <span className="text-sm text-gray-600">80G Tax Benefits</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="text-purple-500">💯</div>
              <span className="text-sm text-gray-600">100% to Programs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DonatePage() {
  return <DonatePageContent />
}