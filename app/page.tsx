import Header from "@/components/landing/header"
import Hero from "@/components/landing/hero"
import AboutUs from "@/components/landing/about"
import Features from "@/components/landing/features"
import USP from "@/components/landing/usp"
import B2BPartnership from "@/components/landing/b2b"
import Footer from "@/components/landing/footer"
import AnimatedBackground from "@/components/landing/animated-background"

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen">
      <AnimatedBackground />
      <Header />
      <main className="flex-1 w-full flex flex-col relative z-10">
        <Hero />
        <AboutUs />
        <Features />
        <USP />
        <B2BPartnership />
      </main>
      <Footer />
    </div>
  )
}
