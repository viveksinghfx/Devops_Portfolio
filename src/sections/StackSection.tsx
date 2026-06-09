import { useState } from 'react'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { skills } from '../data/resume'
import { Terminal, Cpu, Cloud, Eye, Code2, Workflow } from 'lucide-react'

const GROUPS = [
  { key: 'devops',        label: 'DevOps & CI/CD',          icon: <Workflow size={14}/>, items: skills.devops },
  { key: 'mlops',         label: 'MLOps · LLMOps',          icon: <Cpu size={14}/>,     items: skills.mlops },
  { key: 'cloud',         label: 'Cloud & Infrastructure',  icon: <Cloud size={14}/>,   items: skills.cloud },
  { key: 'observability', label: 'Observability',           icon: <Eye size={14}/>,     items: skills.observability },
  { key: 'apis',          label: 'APIs & Backend',          icon: <Terminal size={14}/>, items: skills.apis },
  { key: 'programming',   label: 'Languages',               icon: <Code2 size={14}/>,   items: skills.programming },
] as const

export default function StackSection() {
  const [active, setActive] = useState<typeof GROUPS[number]['key']>('devops')
  const activeGroup = GROUPS.find(g => g.key === active)!

  return (
    <section id="stack" className="relative section border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            index="02"
            kicker="THE STACK"
            title={<>Tools chosen for <span className="serif italic text-accent">production days</span>, not demo days.</>}
            subtitle="Battle-tested layers I reach for to design cloud-native systems and ML/LLM platforms."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-12 gap-6 lg:gap-10">
          {/* sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <Reveal>
              <ul className="space-y-1">
                {GROUPS.map((g, i) => {
                  const selected = g.key === active
                  return (
                    <li key={g.key}>
                      <button
                        onClick={() => setActive(g.key)}
                        className={`group w-full flex items-center justify-between px-4 py-4 border-l-2 transition text-left ${
                          selected
                            ? 'border-accent bg-elevated text-text'
                            : 'border-line text-muted hover:text-text hover:bg-elevated/50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`${selected ? 'text-accent' : 'text-faint'}`}>{g.icon}</span>
                          <span className="text-sm">{g.label}</span>
                        </span>
                        <span className="mono text-[10px] tracking-[0.1em] text-faint">/{(i+1).toString().padStart(2, '0')}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>

          {/* content */}
          <div className="col-span-12 lg:col-span-8">
            <Reveal key={active} y={12}>
              <div className="card p-7 lg:p-10 min-h-[420px]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center border border-line rounded-sm text-accent">
                      {activeGroup.icon}
                    </span>
                    <h3 className="text-xl text-text font-light">{activeGroup.label}</h3>
                  </div>
                  <span className="mono text-[10.5px] text-faint">{activeGroup.items.length} TOOLS</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeGroup.items.map((t, i) => (
                    <span
                      key={t + i}
                      className="chip text-text hover:border-accent/70 hover:text-accent transition cursor-default"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-10 border-t border-line pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <Stat n="3+"  label="Years shipping" />
                  <Stat n="8m"  label="GitOps deploy cycle" />
                  <Stat n="40%" label="LLM p95 latency cut" />
                  <Stat n="0"   label="Manual prod steps" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-light text-text tracking-tightest">{n}</div>
      <div className="mono text-[10.5px] tracking-[0.1em] text-faint mt-1 uppercase">{label}</div>
    </div>
  )
}
