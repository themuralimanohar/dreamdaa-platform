import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Target, Heart, Zap, Globe } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Targeted Impact',
    description: 'Focused exclusively on Tamil Nadu students who need English skills to access better educational and career opportunities.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Learning',
    description: 'Our mobile app uses advanced AI to provide personalized, Tamil-based English learning experiences.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description: 'Built by the community, for the community, with deep understanding of local educational challenges.',
  },
  {
    icon: Globe,
    title: 'Breaking Barriers',
    description: 'Removing language as a barrier to academic success and career advancement for underprivileged students.',
  },
]

export default function AboutSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                What is{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DreamDaa?
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                DreamDaa is a non-profit initiative dedicated to empowering underprivileged students 
                in Tamil Nadu by providing them access to our AI-powered, Tamil-based English learning mobile app.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Language should never be a barrier to dreams. That&apos;s why we&apos;ve created an innovative 
                learning platform that teaches English through Tamil, making it accessible and effective 
                for local students.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Every donation directly funds app access, ensuring students can learn at their own pace, 
                build confidence, and unlock opportunities for higher education and better careers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="dreamdaa-gradient text-white font-semibold">
                <Link href="/about" className="flex items-center gap-2">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 hover:bg-gray-50">
                <Link href="/impact" className="flex items-center gap-2">
                  See Our Impact
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-50 to-blue-50"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics Row */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100 text-sm">Donations go to programs</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100 text-sm">Students sponsored</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100 text-sm">Schools connected</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100 text-sm">Improvement in English skills</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}