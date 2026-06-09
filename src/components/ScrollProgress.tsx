import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrolled = window.scrollY
      const height = doc.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(1, scrolled / height) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 h-[2px] z-[200] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent via-[#ff8b3a] to-accent transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
