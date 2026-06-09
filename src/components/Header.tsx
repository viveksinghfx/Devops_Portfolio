import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Menu, X, Command } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'Manifesto',   href: '#manifesto'   },
  { label: 'Stack',       href: '#stack'       },
  { label: 'Experience',  href: '#experience'  },
  { label: 'Work',        href: '#work'        },
  { label: 'Architect',   href: '#architect'   },
  { label: 'Terminal',    href: '#terminal'    },
  { label: 'Contact',     href: '#contact'     },
]

export default function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [open, setOpen]           = useState(false)
  const [active, setActive]       = useState('')
  const navigate                  = useNavigate()
  const location                  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.pathname !== '/') return
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive('#' + e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [location.pathname])

  const scrollTo = useCallback((href: string) => {
    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 64
    if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.1 })
    else window.scrollTo({ top, behavior: 'smooth' })
  }, [])

  const handleNav = (href: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => scrollTo(href), 220)
    } else {
      scrollTo(href)
    }
  }

  const openCommand = () => {
    window.dispatchEvent(new CustomEvent('cmdk:open'))
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'glass border-b border-line/70'
            : 'border-b border-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-2.5"
            aria-label="Vivek Singh — Home"
          >
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-sm border border-line bg-elevated transition group-hover:border-accent/70">
              <svg viewBox="0 0 32 32" className="h-3.5 w-3.5">
                <path d="M5 8 L16 26 L27 8" stroke="rgb(255,107,0)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute -inset-px rounded-sm anim-pulse pointer-events-none opacity-0 group-hover:opacity-100 transition" />
            </span>
            <span className="mono text-[12px] tracking-[0.18em] text-text">
              VIVEK<span className="text-muted">.</span><span className="text-accent">SINGH</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((l) => {
              const isActive = active === l.href
              return (
                <button
                  key={l.label}
                  onClick={() => handleNav(l.href)}
                  className={`relative px-3 py-2 mono text-[11.5px] tracking-[0.12em] uppercase transition ${
                    isActive ? 'text-text' : 'text-muted hover:text-text'
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute inset-x-3 -bottom-px h-px bg-accent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openCommand}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-line hover:border-line-strong bg-elevated/60 transition group"
              aria-label="Open command palette"
            >
              <Command size={12} className="text-muted group-hover:text-text" />
              <span className="mono text-[10.5px] tracking-[0.1em] text-muted group-hover:text-text">⌘K</span>
            </button>
            <a
              href="mailto:viveksinghfx@gmail.com"
              className="hidden sm:inline-flex btn-primary btn py-2"
            >
              Hire Me
            </a>
            <button
              className="lg:hidden p-2 rounded-sm border border-line hover:border-line-strong"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[300] bg-bg/95 backdrop-blur-md lg:hidden"
          >
            <div className="container-x pt-24">
              <ul className="space-y-1">
                {NAV.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <button
                      onClick={() => handleNav(l.href)}
                      className="w-full flex items-baseline justify-between border-b border-line py-5"
                    >
                      <span className="text-3xl font-light tracking-tight text-text">{l.label}</span>
                      <span className="mono text-[10px] text-faint">0{i + 1}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex flex-col gap-3">
                <a href="mailto:viveksinghfx@gmail.com" className="btn btn-primary justify-center">Send Email</a>
                <a href="https://github.com/viveksinghfx" target="_blank" rel="noreferrer" className="btn justify-center">GitHub</a>
                <a href="https://linkedin.com/in/vsdevop" target="_blank" rel="noreferrer" className="btn justify-center">LinkedIn</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
