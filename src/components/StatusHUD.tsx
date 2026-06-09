import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })
}

export default function StatusHUD() {
  const [time, setTime] = useState(formatTime(new Date()))
  const [load, setLoad] = useState(0.34)

  useEffect(() => {
    const t = setInterval(() => {
      setTime(formatTime(new Date()))
      setLoad((prev) => {
        const next = prev + (Math.random() - 0.5) * 0.12
        return Math.max(0.18, Math.min(0.92, next))
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="hidden md:flex items-center gap-4 mono text-[10.5px] tracking-[0.08em] text-muted">
      <Pulse />
      <span>VS-OPS · IST {time}</span>
      <span className="hidden lg:inline">CPU <Bar value={load} /></span>
      <span className="hidden lg:inline">UPTIME 99.99%</span>
    </div>
  )
}

function Pulse() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <motion.span
        className="absolute inset-0 rounded-full bg-signal/60"
        animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <span className="relative w-2 h-2 rounded-full bg-signal" />
    </span>
  )
}

function Bar({ value }: { value: number }) {
  return (
    <span className="inline-block align-middle w-16 h-1 bg-line/80 rounded overflow-hidden ml-1.5">
      <span className="block h-full bg-gradient-to-r from-signal to-accent transition-[width] duration-700" style={{ width: `${value * 100}%` }} />
    </span>
  )
}
