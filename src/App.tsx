import { useEffect, useRef, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CommandPalette from './components/CommandPalette'
import Home from './pages/Home'
const Dossier = lazy(() => import('./pages/Dossier'))

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

function App() {
  const location = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    ScrollTrigger.refresh()
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-bg">
      <ScrollProgress />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dossier" element={
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center mono text-faint text-sm">Loading dossier…</div>}>
            <Dossier />
          </Suspense>
        } />
      </Routes>
      <Footer />
      <CommandPalette />
    </div>
  )
}

export default App
