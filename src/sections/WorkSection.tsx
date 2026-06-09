import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Github, ChevronRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { projects } from '../data/resume'

export default function WorkSection() {
  const [active, setActive] = useState(0)
  const project = projects[active]

  return (
    <section id="work" className="relative section border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            index="04"
            kicker="FEATURED WORK"
            title={<>Selected platforms,<br/><span className="serif italic text-accent">end-to-end</span>.</>}
            subtitle="Pick a case study. Each one is a real production system I designed, built, and operated."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-12 gap-6 lg:gap-8">
          {/* List */}
          <div className="col-span-12 lg:col-span-5">
            <ul>
              {projects.map((p, i) => {
                const selected = i === active
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => setActive(i)}
                      className={`group w-full text-left px-5 py-6 border-t border-line transition relative ${
                        selected ? 'bg-elevated' : 'hover:bg-elevated/50'
                      } ${i === projects.length - 1 ? 'border-b' : ''}`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="work-marker"
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <div className="flex items-baseline justify-between gap-4 mb-2">
                        <span className="mono text-[10.5px] text-faint tracking-[0.14em]">
                          {(i + 1).toString().padStart(2, '0')} · {p.category}
                        </span>
                        <ChevronRight size={14} className={`${selected ? 'text-accent' : 'text-faint'} transition`} />
                      </div>
                      <h3 className={`text-lg md:text-xl font-light tracking-tight transition ${
                        selected ? 'text-text' : 'text-muted group-hover:text-text'
                      }`}>{p.title}</h3>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Detail */}
          <div className="col-span-12 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="card p-7 lg:p-10 sticky top-24"
              >
                <header className="mb-6 pb-6 border-b border-line">
                  <div className="mono-label text-accent mb-3">CASE STUDY · {project.category.toUpperCase()}</div>
                  <h3 className="text-2xl md:text-3xl text-text font-light tracking-tight mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted leading-relaxed">{project.description}</p>
                </header>

                {project.challenge && (
                  <Block label="CHALLENGE">{project.challenge}</Block>
                )}
                {project.solution && (
                  <Block label="SOLUTION">{project.solution}</Block>
                )}

                {project.outcomes && (
                  <div className="mt-6">
                    <div className="mono-label text-faint mb-3">OUTCOMES</div>
                    <ul className="space-y-2">
                      {project.outcomes.map((o, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text">
                          <span className="mono text-accent">→</span>
                          <span className="text-muted">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">
                  <div className="mono-label text-faint mb-3">STACK</div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </div>

                {project.githubUrl && (
                  <div className="mt-8 pt-6 border-t border-line flex flex-wrap gap-3">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn">
                      <Github size={14}/> View Source
                    </a>
                    <a href="mailto:viveksinghfx@gmail.com" className="btn btn-primary">
                      Discuss this work <ArrowUpRight size={14}/>
                    </a>
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mono-label text-faint mb-2">{label}</div>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  )
}
