import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, AlertOctagon, Target, Trophy, Sparkles, ArrowRight, Lightbulb } from 'lucide-react'
import { NODE_ICONS, NODE_LIBRARY } from '../nodes'
import type { LevelDef } from '../types'

interface Props {
  level: LevelDef | null
  open: boolean
  onStart: () => void
  onClose: () => void
}

const BADGE_TINT: Record<NonNullable<LevelDef['badgeColor']>, string> = {
  amber:   'rgb(255 180 60)',
  cyan:    'rgb(110 200 255)',
  violet:  'rgb(180 110 255)',
  rose:    'rgb(255 110 200)',
  emerald: 'rgb(86 246 162)',
  sky:     'rgb(110 178 255)',
  gold:    'rgb(255 215 90)',
}

export function MissionBriefing({ level, open, onStart, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && level && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-elevated border border-line rounded-sm overflow-hidden"
            style={{ boxShadow: `0 40px 100px -20px ${BADGE_TINT[level.badgeColor]}55` }}
          >
            {/* glow header */}
            <div
              className="relative px-7 py-6 border-b border-line overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 0%, ${BADGE_TINT[level.badgeColor]}33, transparent 60%)`,
              }}
            >
              <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded hover:bg-bg text-faint hover:text-text transition">
                <X size={14} />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: BADGE_TINT[level.badgeColor] }}>
                  {level.codename}
                </span>
                {level.difficulty === 'boss' && (
                  <span className="mono text-[9.5px] tracking-[0.16em] px-1.5 py-0.5 rounded-sm border border-danger/40 text-danger bg-danger/10">
                    BOSS
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-text">
                Level {level.index.toString().padStart(2, '0')} · {level.title}
              </h2>
              <p className="mt-2 text-muted text-sm leading-relaxed max-w-2xl">{level.longBrief}</p>
            </div>

            {/* spec grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line">
              <Cell icon={<Target size={11} />} label="OBJECTIVE" value={level.topic} />
              <Cell icon={<Sparkles size={11} />} label="BUDGET" value={`¢${level.budget}`} />
              <Cell icon={<Trophy size={11} />} label="REWARD" value={level.reward} />
              <Cell icon={<AlertOctagon size={11} />} label="PAR" value={`${level.parTime}s`} />
            </div>

            {/* lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
              <div className="bg-elevated p-6">
                <div className="mono-label text-faint mb-3">REQUIRED COMPONENTS</div>
                <ul className="grid grid-cols-2 gap-1.5">
                  {level.required.map((k) => {
                    const Icon = NODE_ICONS[k]
                    return (
                      <li key={k} className="flex items-center gap-1.5 text-[11.5px] text-text">
                        <Icon size={11} />
                        <span className="truncate">{NODE_LIBRARY[k].shortLabel}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="bg-elevated p-6">
                <div className="mono-label text-faint mb-3">FIRST HINT</div>
                <div className="flex items-start gap-2">
                  <Lightbulb size={12} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-[12.5px] text-muted leading-relaxed">{level.hints[0]}</p>
                </div>
                {level.bonus && level.bonus.length > 0 && (
                  <>
                    <div className="mono-label text-faint mt-4 mb-2">BONUS</div>
                    <div className="flex flex-wrap gap-1">
                      {level.bonus.map((k) => (
                        <span key={k} className="chip text-info border-info/30 bg-info/5">{NODE_LIBRARY[k].shortLabel}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-5 flex items-center justify-between gap-3">
              <button onClick={onClose} className="btn py-2 px-4">
                <X size={12} /> Back
              </button>
              <button onClick={onStart} className="btn btn-primary py-2 px-5">
                <Play size={12} /> Begin Mission <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Cell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-elevated p-4">
      <div className="flex items-center gap-1.5 text-faint">
        {icon}
        <span className="mono text-[9.5px] tracking-[0.16em] uppercase">{label}</span>
      </div>
      <div className="text-text text-sm font-light mt-1 truncate">{value}</div>
    </div>
  )
}
