import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Github, Linkedin, Mail, Phone, MapPin, Download,
  Award, Briefcase, Cpu, Cloud, Terminal as TerminalIcon, Eye, BookOpen, Workflow,
} from 'lucide-react'
import {
  personalInfo, professionalSummary, workExperience, skills,
  education, certifications,
} from '../data/resume'
import Reveal from '../components/Reveal'

export default function Dossier() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="container-x">
        <Link to="/" className="inline-flex items-center gap-2 mono text-[11px] tracking-[0.12em] text-muted hover:text-text mb-10 transition">
          <ArrowLeft size={12}/> BACK TO MAIN
        </Link>

        <Reveal>
          <section className="card p-7 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div>
                <div className="mono-label text-accent mb-3">DOSSIER · vivek.singh</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-text tracking-tightest leading-[0.95]">
                  {personalInfo.name}
                </h1>
                <p className="text-muted text-base md:text-lg mt-3">{personalInfo.title}</p>
              </div>
              <div className="flex items-center gap-2 mono text-[11px] text-signal tracking-[0.08em]">
                <span className="inline-block w-2 h-2 rounded-full bg-signal anim-pulse" />
                AVAILABLE FOR HIRE
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Field icon={<MapPin size={12}/>} label={personalInfo.location} />
              <Field icon={<Phone size={12}/>}  label={personalInfo.phone} />
              <Field icon={<Mail size={12}/>}   label={personalInfo.email}    href={`mailto:${personalInfo.email}`} />
              <Field icon={<Globe size={12}/>}  label={personalInfo.website.replace(/^https?:\/\//,'')} href={personalInfo.website} />
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="btn"><Github size={12}/> GitHub</a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="btn"><Linkedin size={12}/> LinkedIn</a>
              <a href={`mailto:${personalInfo.email}`} className="btn"><Mail size={12}/> Email</a>
              <button onClick={() => window.print()} className="btn btn-primary"><Download size={12}/> Print / Save PDF</button>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <Block icon={<Briefcase size={14}/>} title="PROFESSIONAL SUMMARY">
            <p className="text-muted text-sm md:text-base leading-relaxed">{professionalSummary}</p>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={<Workflow size={14}/>} title="WORK EXPERIENCE">
            <div className="relative">
              <div className="absolute left-3 md:left-5 top-2 bottom-2 w-px bg-line" aria-hidden />
              <ul className="space-y-10">
                {workExperience.map((j) => (
                  <li key={j.company} className="relative pl-10 md:pl-14">
                    <div className="absolute left-[3px] md:left-[13px] top-2 w-3 h-3 rounded-full bg-bg border-2 border-accent" />
                    <div>
                      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                        <h3 className="text-lg text-text font-light">{j.role}</h3>
                        <span className="mono text-[11px] tracking-[0.06em] text-faint flex items-center gap-2">
                          <MapPin size={10}/> {j.location} · {j.period}
                        </span>
                      </div>
                      <div className="mono text-[12px] text-accent">{j.company}{j.type && ` · ${j.type}`}</div>
                      <ul className="mt-3 space-y-2">
                        {j.bullets.map((b, i) => (
                          <li key={i} className="text-sm text-muted flex gap-3 leading-relaxed">
                            <span className="mt-2 w-1 h-1 rounded-full bg-accent/80 shrink-0" /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Block>
        </Reveal>

        <Reveal>
          <Block icon={<Cpu size={14}/>} title="TECHNICAL SKILLS">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SkillCard icon={<TerminalIcon size={12}/>} title="DevOps & CI/CD" items={skills.devops}/>
              <SkillCard icon={<Cpu size={12}/>}          title="MLOps & LLMOps" items={skills.mlops}/>
              <SkillCard icon={<Cloud size={12}/>}        title="Cloud & Infra"  items={skills.cloud}/>
              <SkillCard icon={<Eye size={12}/>}          title="Observability"  items={skills.observability}/>
              <SkillCard icon={<BookOpen size={12}/>}     title="APIs & Backend" items={skills.apis}/>
              <SkillCard icon={<TerminalIcon size={12}/>} title="Programming"    items={skills.programming}/>
            </div>
          </Block>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          <Reveal>
            <Block icon={<BookOpen size={14}/>} title="EDUCATION" inline>
              <div className="space-y-3">
                {education.map((e) => (
                  <div key={e.degree} className="border border-line bg-bg p-4">
                    <div className="text-text">{e.degree}</div>
                    <div className="text-muted text-sm">{e.institution}</div>
                    <div className="mono text-[11px] text-faint mt-0.5">{e.year}</div>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>
          <Reveal>
            <Block icon={<Award size={14}/>} title="CERTIFICATIONS" inline>
              <div className="space-y-3">
                {certifications.map((c) => (
                  <div key={c} className="border border-line bg-bg p-4 flex items-center gap-3">
                    <Award size={12} className="text-accent shrink-0"/>
                    <span className="text-muted text-sm">{c}</span>
                  </div>
                ))}
              </div>
            </Block>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-line pt-8 text-center mono text-[11px] tracking-[0.06em] text-faint">
          © {new Date().getFullYear()} Vivek Singh · Built with React + Vite + Tailwind
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) {
  const inner = (
    <span className="flex items-center gap-2 text-muted text-sm">
      <span className="text-faint">{icon}</span>
      <span>{label}</span>
    </span>
  )
  return href ? <a className="hover:text-text transition" href={href}>{inner}</a> : inner
}

function Block({ icon, title, children, inline = false }: { icon: React.ReactNode; title: string; children: React.ReactNode; inline?: boolean }) {
  return (
    <section className={inline ? '' : 'mt-8'}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-accent">{icon}</span>
        <h2 className="mono-label text-muted">{title}</h2>
      </div>
      <div className="card p-6 md:p-8">{children}</div>
    </section>
  )
}

function SkillCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="border border-line bg-bg p-5">
      <div className="flex items-center gap-2 mb-3 text-accent">
        {icon}<span className="mono-label text-muted">{title}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
    </div>
  )
}

function Globe({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>
    </svg>
  )
}
