import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Target, Heart, Lightbulb, Award, Globe } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description: 'We believe every child deserves access to quality education, regardless of their economic background.',
  },
  {
    icon: Target,
    title: 'Impact-Driven',
    description: 'Every decision we make is focused on creating measurable, positive change in students\' lives.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI technology to make learning more effective and accessible.',
  },
  {
    icon: Globe,
    title: 'Cultural Sensitivity',
    description: 'Our solutions respect and build upon the rich cultural heritage of Tamil Nadu.',
  },
]

const team = [
  {
    name: 'Priya Krishnan',
    role: 'Founder & CEO',
    bio: 'Former tech executive with 15 years of experience in educational technology and social impact.',
    image: '/team/priya.jpg', // placeholder
  },
  {
    name: 'Dr. Raj Murugan',
    role: 'Head of Pedagogy',
    bio: 'Educational researcher specializing in multilingual learning and AI-assisted education.',
    image: '/team/raj.jpg', // placeholder
  },
  {
    name: 'Arun Kumar',
    role: 'Technology Director',
    bio: 'AI/ML engineer with expertise in natural language processing and mobile app development.',
    image: '/team/arun.jpg', // placeholder
  },
  {
    name: 'Meera Shankar',
    role: 'Community Outreach',
    bio: 'Social worker with deep connections in Tamil Nadu&apos;s rural education ecosystem.',
    image: '/team/meera.jpg', // placeholder
  },
]

const milestones = [
  { year: '2022', event: 'DreamDaa Initiative Founded', description: 'Started with a vision to break language barriers' },
  { year: '2022', event: 'First 100 Students', description: 'Reached our first milestone of sponsored students' },
  { year: '2023', event: 'AI App Launch', description: 'Launched our Tamil-based English learning app' },
  { year: '2023', event: '1000+ Students', description: 'Crossed 1,000 students using our platform' },
  { year: '2024', event: '150 Schools Connected', description: 'Partnered with 150+ schools across Tamil Nadu' },
  { year: '2024', event: '2,500+ Lives Transformed', description: 'Reached 2,500+ students with measurable impact' },
]

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DreamDaa
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              We are a non-profit organization dedicated to empowering underprivileged students in Tamil Nadu 
              through innovative AI-powered English learning solutions.
            </p>
            <Button asChild size="lg" className="dreamdaa-gradient text-white font-semibold">
              <Link href="/donate" className="flex items-center gap-2">
                Support Our Mission
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  To break down language barriers that prevent underprivileged students in Tamil Nadu 
                  from accessing quality education and career opportunities by providing them with 
                  innovative, AI-powered English learning tools.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Do</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-2">•</span>
                    Provide free access to our AI-powered English learning app
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-2">•</span>
                    Support students with personalized, Tamil-based learning paths
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-2">•</span>
                    Connect with schools to integrate technology into classrooms
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-2">•</span>
                    Track and measure student progress to ensure effectiveness
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  A Tamil Nadu where every student, regardless of their economic background, 
                  has the English language skills needed to pursue their dreams and contribute 
                  to their community&apos;s growth.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Impact Goals</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">10,000+</div>
                    <div className="text-sm text-gray-600">Students reached by 2025</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Schools partnered by 2025</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-gray-600">Student improvement rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every program we develop.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a vision to impact thousands of lives - see how we&apos;ve grown.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate individuals working together to transform education in Tamil Nadu.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-blue-600 text-sm font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in our mission to empower students across Tamil Nadu. 
            Every contribution brings us closer to our goal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              <Link href="/donate">Start Sponsoring</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}