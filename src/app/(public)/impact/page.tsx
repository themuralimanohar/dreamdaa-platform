import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Map, Users, BookOpen, Heart, Target, TrendingUp } from 'lucide-react'

const impactAreas = [
  {
    icon: Map,
    title: 'Interactive District Map',
    description: 'Explore our reach across all 38 districts of Tamil Nadu with real-time funding status.',
    link: '/impact/map',
    cta: 'View Map',
    highlight: true
  },
  {
    icon: Users,
    title: 'Impact Stories',
    description: 'Read inspiring stories from students whose lives have been transformed by our program.',
    link: '/impact/stories',
    cta: 'Read Stories',
    highlight: false
  },
  {
    icon: BookOpen,
    title: 'The DreamDaa App',
    description: 'Learn about our AI-powered English learning app designed specifically for Tamil students.',
    link: '/impact/app',
    cta: 'Learn More',
    highlight: false
  }
]

const stats = [
  { icon: Users, value: '15,234', label: 'Students Reached' },
  { icon: Target, value: '387', label: 'Schools Connected' },
  { icon: Heart, value: '2,156', label: 'Lives Transformed' },
  { icon: TrendingUp, value: '95%', label: 'Improvement Rate' }
]

export default function ImpactPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Impact
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              See how your contributions are transforming lives across Tamil Nadu. 
              From individual students to entire districts, every donation creates measurable change.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the different ways we measure and share our impact across Tamil Nadu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {impactAreas.map((area, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  area.highlight 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' 
                    : 'bg-white'
                }`}
              >
                <div className="p-8">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                    area.highlight 
                      ? 'bg-white/20' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  }`}>
                    <area.icon className={`w-6 h-6 ${area.highlight ? 'text-white' : 'text-white'}`} />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-4 ${area.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {area.title}
                  </h3>
                  
                  <p className={`mb-6 leading-relaxed ${area.highlight ? 'text-blue-100' : 'text-gray-600'}`}>
                    {area.description}
                  </p>
                  
                  <Button
                    asChild
                    size="lg"
                    className={`w-full font-semibold ${
                      area.highlight
                        ? 'bg-white text-blue-600 hover:bg-gray-100'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    <Link href={area.link} className="flex items-center justify-center gap-2">
                      {area.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Impact Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">
                  Real-Time Impact Tracking
                </h3>
                <p className="text-lg text-blue-100 mb-6">
                  Our interactive map shows live data on school coverage across Tamil Nadu. 
                  See exactly where your donations are making the biggest difference.
                </p>
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100 font-semibold">
                  <Link href="/impact/map" className="flex items-center gap-2">
                    Explore the Map
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="text-center">
                <div className="inline-block p-8 bg-white/10 rounded-full mb-4">
                  <Map className="w-16 h-16 text-white" />
                </div>
                <div className="text-2xl font-bold mb-2">38 Districts</div>
                <div className="text-blue-200">Covered across Tamil Nadu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Be Part of the Impact
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Every donation creates measurable change. Join thousands of supporters 
            who are transforming education across Tamil Nadu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold">
              <Link href="/donate">Start Donating</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Link href="/contact">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}