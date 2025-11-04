import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Be the Change
            </h2>
            <p className="mx-auto max-w-3xl text-lg sm:text-xl lg:text-2xl text-gray-200 leading-relaxed">
              Every student deserves a chance to dream bigger. Your contribution today becomes their opportunity tomorrow.
            </p>
          </div>

          {/* Impact statement */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-white text-lg font-medium leading-relaxed">
              &quot;Education is the most powerful weapon which you can use to change the world.&quot; 
              <span className="block mt-4 text-gray-300 text-base">- Nelson Mandela</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              asChild 
              size="xl" 
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <Link href="/donate" className="flex items-center gap-3">
                <Heart className="w-6 h-6" />
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="xl"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10"
            >
              <Link href="/impact" className="flex items-center gap-2">
                Learn About Our Impact
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">🔒 Secure</div>
                <p className="text-gray-300 text-sm">SSL encrypted donations</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">📋 80G Certified</div>
                <p className="text-gray-300 text-sm">Tax exemption available</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-2xl font-bold text-white">💯 Transparent</div>
                <p className="text-gray-300 text-sm">Full impact reporting</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
    </section>
  )
}