import HeroBanner from '@/components/public/HeroBanner'
import AboutSection from '@/components/public/AboutSection'
import SponsorshipCards from '@/components/public/SponsorshipCards'
import CTASection from '@/components/public/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <AboutSection />
      <SponsorshipCards />
      <CTASection />
    </>
  )
}