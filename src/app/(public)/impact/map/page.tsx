import TamilNaduMapExact from '@/components/public/TamilNaduMapExact'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Target, TrendingUp, Users } from 'lucide-react'

const impactStats = [
  {
    icon: Users,
    value: '15,234',
    label: 'Students Reached',
    color: 'text-blue-600'
  },
  {
    icon: Target,
    value: '387',
    label: 'Schools Connected',
    color: 'text-green-600'
  },
  {
    icon: TrendingUp,
    value: '2,156',
    label: 'Schools Available',
    color: 'text-orange-600'
  },
  {
    icon: MapPin,
    value: '38',
    label: 'Districts Covered',
    color: 'text-purple-600'
  }
]

export default function ImpactMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/impact" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Impact
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tamil Nadu Impact Map
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our reach across Tamil Nadu. Each district shows our current school coverage 
            and opportunities for sponsorship. Click on any district to see detailed information.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impactStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Interactive District Map
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Each district is color-coded based on school funding status. 
                Red districts need the most support, while green districts are fully funded.
              </p>
            </div>

            <TamilNaduMapExact />

            {/* Legend Explanation */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-red-700">Needs Funding</div>
                <div className="text-sm text-gray-600">0-40% coverage</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-orange-700">Partially Funded</div>
                <div className="text-sm text-gray-600">41-70% coverage</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-blue-700">Well Funded</div>
                <div className="text-sm text-gray-600">71-99% coverage</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-green-700">Fully Funded</div>
                <div className="text-sm text-gray-600">100% coverage</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Make a Difference?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Choose a district that needs support and start sponsoring schools today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
                  <Link href="/donate">Start Sponsoring</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}