import Features from '@/components/landing/features'
import Hero from '@/components/landing/hero'
import Navbar from '@/components/landing/nav'
import Social from '@/components/landing/social'

const Page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Social />
      <Features />
    </div>
  )
}

export default Page