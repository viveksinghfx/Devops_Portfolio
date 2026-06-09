import { AnimatePresence, motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { setAchievementListener } from '../achievementBus'

interface Toast {
  id: number
  title: string
  subtitle?: string
}

export function AchievementToaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    setAchievementListener((title, subtitle) => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, title, subtitle }])
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, 4500)
    })
    return () => { setAchievementListener(null) }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[600] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="pointer-events-auto bg-elevated border border-accent/50 rounded-sm px-4 py-3 min-w-[260px] max-w-[340px] shadow-2xl"
            style={{ boxShadow: '0 20px 60px -20px rgba(255,107,0,0.5)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 anim-pulse">
                <Trophy size={16} className="text-accent" />
              </div>
              <div className="min-w-0">
                <div className="mono text-[9.5px] tracking-[0.18em] text-accent uppercase">Achievement Unlocked</div>
                <div className="text-text text-sm mt-0.5 font-medium truncate">{t.title}</div>
                {t.subtitle && <div className="text-muted text-[11.5px] leading-tight mt-0.5">{t.subtitle}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
