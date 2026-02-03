import Features from '@/components/landing/features'
import Footer from '@/components/landing/footer'
import Hero from '@/components/landing/hero'
import Integration from '@/components/landing/integration'
import Navbar from '@/components/landing/nav'
import Pricing from '@/components/landing/pricing'
import Social from '@/components/landing/social'

const Page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Social />
      <Features />
      <Integration />
      <Pricing />
      <Footer />
    </div>
  )
}

export default Page