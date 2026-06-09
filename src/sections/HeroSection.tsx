import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ArrowRight, Github, FileText, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusHUD from '../components/StatusHUD'

const ROLES = [
  'Platform Engineer',
  'DevOps · MLOps',
  'AI Infrastructure',
  'Kubernetes · GitOps',
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const titleY    = useTransform(scrollYProgress, [0, 1], [0, 120])
  const titleOpa  = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const gridOpa   = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const chars = titleRef.current?.querySelectorAll('.char')
    if (!chars?.length) return
    gsap.fromTo(chars,
      { y: 80, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.85, stagger: 0.022, ease: 'power4.out', delay: 0.15 }
    )
  }, [])

  const lines = [
    ['T','H','E',' ','I','N','T','E','R','N','E','T'],
    ['R','U','N','S',' ','A','T'],
    ['M','I','D','N','I','G','H','T','.'],
  ]

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100svh] flex flex-col overflow-hidden noise"
    >
      {/* layered background */}
      <motion.div style={{ opacity: gridOpa }} className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,107,0,0.10) 0%, transparent 65%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
        background: 'radial-gradient(ellipse 80% 60% at 90% 100%, rgba(110,178,255,0.05) 0%, transparent 70%)'
      }} />
      {/* faint horizontal lines */}
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none opacity-40" aria-hidden>
        {[12, 36, 64, 88].map((pct) => (
          <div key={pct} className="absolute inset-x-0 h-px bg-line/40" style={{ top: pct + '%' }} />
        ))}
      </div>

      {/* top strip */}
      <div className="relative z-10 container-x pt-24 lg:pt-28 flex items-center justify-between">
        <div className="flex items-center gap-3 mono text-[10.5px] tracking-[0.12em] text-muted">
          <span className="chip">SYS · OPERATIONAL</span>
          <span className="hidden sm:inline">v2026.06</span>
        </div>
        <StatusHUD />
      </div>

      {/* central title */}
      <motion.div style={{ y: titleY, opacity: titleOpa }} className="relative z-10 flex-1 flex items-center">
        <div className="container-x w-full">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-9">
              <div className="mono-label text-accent mb-6 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-accent"/>
                CHAPTER 00 — PROLOGUE
              </div>
              <h1
                ref={titleRef}
                className="font-light text-text leading-[0.86] tracking-tightest"
                style={{ fontSize: 'clamp(3rem, 11vw, 12rem)' }}
              >
                {lines.map((line, li) => (
                  <span key={li} className="block">
                    {line.map((ch, ci) => (
                      <span
                        key={li + '-' + ci}
                        className={`char inline-block ${ch === '.' ? 'text-accent' : ''}`}
                        style={{ whiteSpace: ch === ' ' ? 'pre' : undefined }}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>

            <div className="col-span-12 lg:col-span-3 lg:pl-6 lg:border-l lg:border-line">
              <div className="mono-label text-faint mb-3">// SIGNED</div>
              <div className="text-text text-lg">Vivek Singh</div>
              <div className="text-muted text-sm">New Delhi · Asia/Kolkata</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {ROLES.map((r) => <span key={r} className="chip">{r}</span>)}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="max-w-xl text-muted text-base md:text-lg leading-relaxed">
              I build the quiet systems that hold software up while everyone sleeps —
              <span className="text-text"> GitOps pipelines, self-healing Kubernetes clusters, LLM inference platforms</span>,
              and the observability that makes them survivable.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#work" className="btn btn-primary">
                See Featured Work <ArrowRight size={14}/>
              </a>
              <Link to="/dossier" className="btn">
                <FileText size={14}/> Dossier
              </Link>
              <a href="https://github.com/viveksinghfx" target="_blank" rel="noreferrer" className="btn">
                <Github size={14}/> GitHub
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* command palette hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        className="relative z-10 container-x pb-10 flex items-center justify-between mono text-[10.5px] tracking-[0.12em] text-faint"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-accent" />
          Press <kbd className="mx-1 px-1.5 py-0.5 border border-line rounded text-text">⌘</kbd>
          <kbd className="px-1.5 py-0.5 border border-line rounded text-text">K</kbd>
          to jump anywhere
        </div>
        <ScrollCue />
      </motion.div>
    </section>
  )
}

function ScrollCue() {
  return (
    <div className="flex items-center gap-3 text-faint">
      <span>SCROLL</span>
      <span className="relative inline-block w-px h-8 bg-gradient-to-b from-accent/80 via-line to-transparent overflow-hidden">
        <motion.span
          className="absolute inset-x-0 top-0 h-2 bg-accent"
          animate={{ y: [-8, 36] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </div>
  )
}
