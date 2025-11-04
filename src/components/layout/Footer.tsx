import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = {
  main: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Impact', href: '/impact' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Contact', href: '/contact' },
  ],
  programs: [
    { name: 'Adopt a Student', href: '/donate?type=student' },
    { name: 'Adopt a School', href: '/donate?type=school' },
    { name: 'Corporate Partnerships', href: '/partnerships' },
    { name: 'Impact Stories', href: '/impact/stories' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Refund Policy', href: '/refund' },
    { name: '80G Certificate', href: '/80g' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        {/* Newsletter Section */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full dreamdaa-gradient flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">DreamDaa</span>
            </Link>
            <p className="text-sm leading-6 text-gray-300">
              Empowering underprivileged students in Tamil Nadu through AI-powered English learning. 
              Breaking language barriers, building brighter futures.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Quick Links</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.main.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Programs</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.programs.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">info@dreamdaa.org</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">+91 9876543210</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-300">
                      Chennai, Tamil Nadu<br />India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 border-t border-gray-700 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Stay updated with our impact</h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Get monthly updates on how your contributions are changing lives.
            </p>
          </div>
          <form className="mt-6 sm:flex sm:max-w-md md:mt-0">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              type="email"
              name="email-address"
              id="email-address"
              autoComplete="email"
              required
              className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
              placeholder="Enter your email"
            />
            <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
              <Button type="submit" className="dreamdaa-gradient text-white font-semibold">
                Subscribe
              </Button>
            </div>
          </form>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {navigation.legal.slice(0, 2).map((item) => (
              <Link key={item.name} href={item.href} className="text-sm leading-6 text-gray-400 hover:text-gray-300">
                {item.name}
              </Link>
            ))}
          </div>
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; 2024 DreamDaa Initiative. All rights reserved. Registered under Section 12A & 80G of the Income Tax Act.
          </p>
        </div>
      </div>
    </footer>
  )
}