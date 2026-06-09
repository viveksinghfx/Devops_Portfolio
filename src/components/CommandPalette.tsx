import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowRight, Mail, Github, Linkedin, FileText,
  Terminal, Layers, Gamepad2, Cpu, Workflow,
} from 'lucide-react'

type CmdItem = {
  id: string
  label: string
  hint?: string
  group: 'Navigate' | 'Contact' | 'External' | 'Actions'
  keywords?: string
  icon: React.ReactNode
  action: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const scrollTo = useCallback((hash: string) => {
    const go = () => {
      const el = document.querySelector(hash) as HTMLElement | null
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - 64
      if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.1 })
      else window.scrollTo({ top, behavior: 'smooth' })
    }
    if (window.location.hash !== '#/') {
      navigate('/')
      setTimeout(go, 240)
    } else go()
  }, [navigate])

  const items: CmdItem[] = [
    { id: 'manifesto', label: 'Manifesto', group: 'Navigate', icon: <Layers size={14}/>, action: () => scrollTo('#manifesto') },
    { id: 'stack',     label: 'Tech Stack', group: 'Navigate', icon: <Cpu size={14}/>, action: () => scrollTo('#stack') },
    { id: 'experience',label: 'Experience timeline', group: 'Navigate', icon: <Workflow size={14}/>, action: () => scrollTo('#experience') },
    { id: 'work',      label: 'Featured Work', group: 'Navigate', icon: <ArrowRight size={14}/>, action: () => scrollTo('#work') },
    { id: 'architect', label: 'Architecture Builder Game', group: 'Navigate', icon: <Gamepad2 size={14}/>, action: () => scrollTo('#architect') },
    { id: 'terminal',  label: 'Interactive Terminal', group: 'Navigate', icon: <Terminal size={14}/>, action: () => scrollTo('#terminal') },
    { id: 'dossier',   label: 'View full Dossier', group: 'Actions', icon: <FileText size={14}/>, action: () => navigate('/dossier') },
    { id: 'email',     label: 'Send Vivek an email', group: 'Contact', icon: <Mail size={14}/>, action: () => (window.location.href = 'mailto:viveksinghfx@gmail.com') },
    { id: 'github',    label: 'Open GitHub', group: 'External', icon: <Github size={14}/>, action: () => window.open('https://github.com/viveksinghfx', '_blank') },
    { id: 'linkedin',  label: 'Open LinkedIn', group: 'External', icon: <Linkedin size={14}/>, action: () => window.open('https://linkedin.com/in/vsdevop', '_blank') },
  ]

  const filtered = items.filter((it) =>
    !query ? true : (it.label + ' ' + it.group + ' ' + (it.keywords ?? '')).toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(v => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('cmdk:open', onOpen as EventListener)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('cmdk:open', onOpen as EventListener)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => {
    if (active >= filtered.length) setActive(0)
  }, [filtered.length, active])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setActive(a => Math.min(filtered.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setActive(a => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filtered[active]
      if (item) {
        item.action()
        setOpen(false)
      }
    }
  }

  const groups: Array<CmdItem['group']> = ['Navigate', 'Actions', 'Contact', 'External']

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-start justify-center pt-[18vh] px-4 bg-bg/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -16, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="w-full max-w-xl card overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
              <Search size={14} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActive(0) }}
                onKeyDown={onInputKey}
                placeholder="Jump anywhere — type a section or action…"
                className="flex-1 bg-transparent text-sm text-text placeholder:text-faint outline-none"
              />
              <span className="mono text-[10px] tracking-[0.1em] text-faint border border-line px-1.5 py-0.5 rounded">ESC</span>
            </div>
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {groups.map((group) => {
                const groupItems = filtered.filter(i => i.group === group)
                if (!groupItems.length) return null
                return (
                  <div key={group} className="px-2 pb-1">
                    <div className="mono-label text-faint px-3 pt-3 pb-1">{group}</div>
                    {groupItems.map((it) => {
                      const idx = filtered.indexOf(it)
                      const isActive = idx === active
                      return (
                        <button
                          key={it.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => { it.action(); setOpen(false) }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left text-sm transition ${
                            isActive ? 'bg-elevated text-text' : 'text-muted'
                          }`}
                        >
                          <span className={`${isActive ? 'text-accent' : 'text-faint'} transition`}>{it.icon}</span>
                          <span className="flex-1">{it.label}</span>
                          {isActive && <ArrowRight size={12} className="text-accent" />}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
              {filtered.length === 0 && (
                <div className="px-5 py-10 text-center mono-caption text-faint">No matches. Try “stack”, “game”, or “hire”.</div>
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-line flex items-center justify-between mono text-[10px] tracking-[0.08em] text-faint">
              <span>↑↓ navigate · ↵ select</span>
              <span>⌘K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
