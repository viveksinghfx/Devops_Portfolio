import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Trophy, ArrowRight, Repeat, X, Sparkles, Briefcase } from 'lucide-react'
import type { EvalResult, LevelDef } from '../types'
import { rankColor } from '../scoring'

interface Props {
  level: LevelDef | null
  result: EvalResult | null
  open: boolean
  onClose: () => void
  onRetry: () => void
  onNext: () => void
  hasNext: boolean
}

export function LevelComplete({ level, result, open, onClose, onRetry, onNext, hasNext }: Props) {
  return (
    <AnimatePresence>
      {open && level && result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* particles */}
          {result.passed && <Particles />}

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-elevated border border-line rounded-sm overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded hover:bg-bg text-faint hover:text-text transition z-10">
              <X size={14} />
            </button>

            {/* header */}
            <div
              className={`relative p-7 border-b border-line text-center overflow-hidden ${result.passed ? '' : ''}`}
              style={{
                background: result.passed
                  ? 'radial-gradient(circle at 50% 0%, rgba(255,107,0,0.22), transparent 60%)'
                  : 'radial-gradient(circle at 50% 0%, rgba(255,86,86,0.15), transparent 60%)',
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                className="inline-flex items-center justify-center mb-3"
              >
                <div className="relative">
                  <div className={`text-[120px] leading-none font-serif italic ${rankColor(result.rank)}`}>
                    {result.rank}
                  </div>
                  {result.passed && (
                    <div className="absolute inset-0 blur-xl opacity-60" style={{
                      background: result.rank === 'S' ? 'rgba(255,215,90,0.5)' : 'rgba(255,107,0,0.4)',
                    }} />
                  )}
                </div>
              </motion.div>
              <div className="mono text-[10px] tracking-[0.18em] text-faint uppercase">
                {result.passed ? 'MISSION COMPLETE' : 'MISSION FAILED'}
              </div>
              <h3 className="text-2xl font-light text-text mt-1">
                {level.codename}
              </h3>
            </div>

            {/* scores grid */}
            <div className="grid grid-cols-3 gap-px bg-line">
              <Stat label="SCORE" value={result.score.toString()} accent />
              <Stat label="XP EARNED" value={`+${result.xp}`} />
              <Stat label="TIME" value={formatTime(result.elapsedMs)} />
            </div>

            {/* breakdown */}
            <div className="p-5 border-t border-line">
              <div className="mono-label text-faint mb-3">BREAKDOWN</div>
              <div className="space-y-1.5">
                {result.breakdown.map((b) => (
                  <Row key={b.label} label={b.label} value={b.value} />
                ))}
              </div>
            </div>

            {/* missing */}
            {(result.missingEdges.length > 0 || result.missingNodes.length > 0) && (
              <div className="p-5 border-t border-line">
                <div className="mono-label text-danger mb-3">REMAINING</div>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {result.missingNodes.slice(0, 4).map((n) => (
                    <li key={n} className="text-[11.5px] text-muted">· Add component: <span className="text-text">{n}</span></li>
                  ))}
                  {result.missingEdges.slice(0, 6).map((e, i) => (
                    <li key={i} className="text-[11.5px] text-muted">· Wire: <span className="text-text">{e.from} → {e.to}</span> <span className="text-faint italic">— {e.why}</span></li>
                  ))}
                </ul>
              </div>
            )}

            {/* portfolio callout */}
            {result.passed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-5 border-t border-accent/30 bg-accent/5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md border border-accent/40 bg-accent/10 flex items-center justify-center shrink-0">
                    <Briefcase size={14} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mono-label text-accent mb-1">REAL EXPERIENCE</div>
                    <div className="text-text text-sm font-medium">{level.portfolio.title}</div>
                    <p className="text-muted text-[12.5px] leading-relaxed mt-1">{level.portfolio.body}</p>
                    {level.portfolio.metrics && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {level.portfolio.metrics.map((m) => (
                          <span key={m.label} className="chip text-text border-accent/30 bg-accent/5">
                            <span className="text-faint">{m.label}:</span> {m.value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {result.passed && (
              <div className="p-5 border-t border-line flex items-center gap-2">
                <Trophy size={14} className="text-accent" />
                <div>
                  <div className="text-text text-sm">{level.reward}</div>
                  <div className="text-faint text-[11px]">{level.rewardSubtitle}</div>
                </div>
              </div>
            )}

            {/* actions */}
            <div className="p-5 border-t border-line flex flex-wrap gap-2 justify-end">
              <button onClick={onRetry} className="btn py-2 px-4">
                <Repeat size={12} /> Retry
              </button>
              {result.passed && hasNext && (
                <button onClick={onNext} className="btn btn-primary py-2 px-4">
                  Next Mission <ArrowRight size={12} />
                </button>
              )}
              {result.passed && !hasNext && (
                <button onClick={onClose} className="btn btn-primary py-2 px-4">
                  <Sparkles size={12} /> Finish
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-elevated p-5 text-center">
      <div className="mono text-[9.5px] tracking-[0.16em] uppercase text-faint">{label}</div>
      <div className={`mt-1 text-3xl font-light tracking-tight ${accent ? 'text-accent' : 'text-text'}`}>{value}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-[11.5px]">
      <span className="text-muted">{label}</span>
      <span className={value < 0 ? 'text-danger mono' : 'text-text mono'}>
        {value > 0 ? `+${value}` : value}
      </span>
    </div>
  )
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60).toString().padStart(2, '0')
  const s = (total % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.4 + Math.random() * 1.2,
      size: 3 + Math.random() * 5,
      hue: ['rgb(255 107 0)', 'rgb(86 246 162)', 'rgb(255 215 90)', 'rgb(110 178 255)'][i % 4],
    })))
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 0.8, 0], rotate: 360 }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            width: p.size, height: p.size,
            background: p.hue,
            borderRadius: 2,
            boxShadow: `0 0 8px ${p.hue}`,
          }}
        />
      ))}
    </div>
  )
}
