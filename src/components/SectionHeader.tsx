interface SectionHeaderProps {
  index: string
  kicker: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: 'left' | 'center'
}

export default function SectionHeader({ index, kicker, title, subtitle, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-4xl'}>
      <div className={`flex items-center gap-3 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="mono text-[11px] tracking-[0.18em] text-accent">{index}</span>
        <span className="h-px w-8 bg-line" />
        <span className="mono-label text-muted">{kicker}</span>
      </div>
      <h2 className="text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[0.98] tracking-tightest font-light text-grad">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-5 text-muted text-base md:text-lg leading-relaxed ${align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
