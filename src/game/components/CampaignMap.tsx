import { motion } from 'framer-motion'
import { Lock, Star, Sparkles, Skull, Wand2 as SandboxIcon } from 'lucide-react'
import type { LevelDef, SaveData, Rank } from '../types'
import { rankColor } from '../scoring'

interface Props {
  levels: LevelDef[]
  save: SaveData
  onPick: (idx: number) => void
  onSandbox: () => void
  currentIdx: number
}

const DIFF_ICON: Record<LevelDef['difficulty'], React.ReactNode> = {
  easy:   <Sparkles size={11} />,
  medium: <Sparkles size={11} />,
  hard:   <Sparkles size={11} />,
  boss:   <Skull size={11} />,
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

export function CampaignMap({ levels, save, onPick, onSandbox, currentIdx }: Props) {
  return (
    <div className="relative">
      {/* connector spine */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-line hidden md:block" />

      <div className="space-y-4">
        {levels.map((L, i) => {
          const unlocked = L.index <= save.unlockedLevel
          const completed = (save.bestScores[L.id] ?? 0) > 0
          const rank = save.bestRanks[L.id] as Rank | undefined
          const isCurrent = i === currentIdx
          const tint = BADGE_TINT[L.badgeColor]
          const side = i % 2 === 0 ? 'left' : 'right'
          return (
            <div key={L.id} className={`md:grid md:grid-cols-2 md:gap-8 items-center ${side === 'left' ? '' : 'md:[direction:rtl]'}`}>
              <div className={`md:[direction:ltr] ${side === 'right' ? 'md:col-start-2' : ''}`}>
                <motion.button
                  whileHover={unlocked ? { y: -3 } : undefined}
                  whileTap={unlocked ? { scale: 0.99 } : undefined}
                  disabled={!unlocked}
                  onClick={() => unlocked && onPick(i)}
                  className={`relative w-full text-left p-4 border rounded-sm overflow-hidden transition group ${
                    isCurrent
                      ? 'border-accent bg-elevated'
                      : unlocked
                        ? 'border-line bg-elevated hover:border-line-strong'
                        : 'border-line bg-bg/40 opacity-55 cursor-not-allowed'
                  }`}
                  style={isCurrent ? { boxShadow: `0 0 0 1px ${tint}, 0 12px 32px -16px ${tint}` } : undefined}
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-50 transition group-hover:opacity-90"
                    style={{ background: `radial-gradient(circle at ${side === 'left' ? '90% 50%' : '10% 50%'}, ${tint}22, transparent 60%)` }}
                  />
                  <div className="relative flex items-start gap-4">
                    {/* level orb */}
                    <div className="shrink-0">
                      <div
                        className="w-14 h-14 rounded-full border flex items-center justify-center"
                        style={{
                          borderColor: unlocked ? tint : 'rgb(64 64 74)',
                          background: unlocked ? `radial-gradient(circle at 30% 30%, ${tint}33, ${tint}08)` : 'transparent',
                          boxShadow: unlocked ? `0 0 22px -10px ${tint}` : undefined,
                        }}
                      >
                        {!unlocked ? (
                          <Lock size={16} className="text-faint" />
                        ) : rank ? (
                          <span className={`serif italic text-2xl ${rankColor(rank)}`}>{rank}</span>
                        ) : (
                          <span className="mono text-[11px] tracking-[0.18em]" style={{ color: tint }}>L{L.index}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="mono text-[9.5px] tracking-[0.18em] uppercase" style={{ color: unlocked ? tint : 'rgb(100 100 110)' }}>
                          {L.codename}
                        </span>
                        {L.difficulty === 'boss' && (
                          <span className="mono text-[8.5px] tracking-[0.16em] px-1 py-0.5 rounded-sm border border-danger/40 text-danger bg-danger/10 flex items-center gap-1">
                            {DIFF_ICON.boss} BOSS
                          </span>
                        )}
                      </div>
                      <div className="text-text text-base font-light truncate">{L.title}</div>
                      <div className="text-muted text-[12px] mt-0.5 leading-snug">{L.brief}</div>

                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        <span className="mono text-[10px] text-faint">¢{L.budget}</span>
                        <span className="mono text-[10px] text-faint">PAR {L.parTime}s</span>
                        {completed && (
                          <span className="mono text-[10px] text-signal flex items-center gap-1">
                            <Star size={10} /> {save.bestScores[L.id]}
                          </span>
                        )}
                        {!unlocked && <span className="mono text-[10px] text-faint">LOCKED</span>}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          )
        })}

        {/* Sandbox card */}
        <motion.button
          whileHover={{ y: -3 }}
          onClick={onSandbox}
          className="relative w-full text-left p-5 border border-dashed border-accent/40 rounded-sm bg-accent/5 hover:bg-accent/10 transition group overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-50 group-hover:opacity-90 transition"
            style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255,107,0,0.18), transparent 60%)' }}
          />
          <div className="relative flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 rounded-full border border-accent/60 flex items-center justify-center bg-accent/10">
              <SandboxIcon size={18} className="text-accent" />
            </div>
            <div>
              <div className="mono text-[9.5px] tracking-[0.18em] uppercase text-accent">FREE PLAY</div>
              <div className="text-text text-base font-light">Sandbox Mode</div>
              <div className="text-muted text-[12px] mt-0.5">Unlimited budget. Every component. Build anything you want.</div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
