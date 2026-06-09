import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { workExperience } from '../data/resume'
import { MapPin } from 'lucide-react'

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative section border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            index="03"
            kicker="EXPERIENCE"
            title={<>A timeline of <span className="serif italic text-accent">systems</span> shipped.</>}
            subtitle="Three years across DevOps, ML platform, and a film-grade Python pipeline background that taught me to automate stubborn things."
          />
        </Reveal>

        <div className="mt-16 relative">
          <div className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-line" aria-hidden />

          <ul className="space-y-12">
            {workExperience.map((job, idx) => (
              <Reveal key={job.company} delay={idx * 0.06}>
                <li className="relative pl-10 md:pl-16">
                  <div className="absolute left-[3px] md:left-[13px] top-3 w-[14px] h-[14px] rounded-full bg-bg border-2 border-accent" />
                  <div className="absolute left-[7px] md:left-[17px] top-[10px] w-[6px] h-[6px] rounded-full bg-accent anim-pulse" />

                  <article className="card p-7 lg:p-9 card-hover">
                    <header className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-5">
                      <div>
                        <h3 className="text-xl md:text-2xl text-text font-light tracking-tight">{job.role}</h3>
                        <div className="mono text-[12px] text-accent mt-1 tracking-[0.05em]">
                          {job.company} {job.type && <span className="text-faint">· {job.type}</span>}
                        </div>
                      </div>
                      <div className="mono text-[11px] text-faint tracking-[0.06em] flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin size={11}/> {job.location}</span>
                        <span>·</span>
                        <span>{job.period}</span>
                      </div>
                    </header>
                    <ul className="space-y-3">
                      {job.bullets.map((b, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted leading-relaxed">
                          <span className="mt-2 w-1 h-1 rounded-full bg-accent/80 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
