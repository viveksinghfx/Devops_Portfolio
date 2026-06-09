import { useState, useEffect, useRef } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { personalInfo, professionalSummary, projects, skills } from '../data/resume'

type Line = { kind: 'in' | 'out' | 'sys' | 'err' | 'banner'; text: string }

const HELP = `Available commands:
  help          show this list
  whoami        identity
  about         short bio
  stack         tech stack overview
  projects      list featured projects
  open <id>     open a project (gitops-platform | llm-gateway | mlops-pipeline)
  contact       contact channels
  resume        download / view dossier
  clear         clear the screen
  uptime        ops vitals
  sudo hire     priority message`

const PROJECT_IDS = projects.map((p) => p.id)

export default function TerminalSection() {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // initial boot banner
  useEffect(() => {
    const banner: Line[] = [
      { kind: 'banner', text: 'vs@platform-shell · v1.0.0 · linux-x86_64' },
      { kind: 'banner', text: `connected to viveksingh.tech as guest@${typeof navigator !== 'undefined' ? (navigator.language || 'unknown') : 'unknown'}` },
      { kind: 'sys',    text: `type ${"'help'"} to begin. ${"'sudo hire'"} for priority routing.` },
    ]
    setLines(banner)
  }, [])

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines.length])

  function focusOnce() {
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function run(raw: string) {
    const cmd = raw.trim()
    if (!cmd) return
    setHistory((prev) => [cmd, ...prev].slice(0, 50))
    setHIdx(-1)
    const out: Line[] = [{ kind: 'in', text: cmd }]
    const [head, ...rest] = cmd.split(/\s+/)
    switch (head) {
      case 'help':
        out.push({ kind: 'out', text: HELP })
        break
      case 'whoami':
        out.push({ kind: 'out', text: `${personalInfo.name} · ${personalInfo.title} · ${personalInfo.location}` })
        break
      case 'about':
        out.push({ kind: 'out', text: professionalSummary })
        break
      case 'stack':
        out.push({ kind: 'out', text:
`devops:        ${skills.devops.join(', ')}
mlops:         ${skills.mlops.join(', ')}
cloud:         ${skills.cloud.join(', ')}
observability: ${skills.observability.join(', ')}
apis:          ${skills.apis.join(', ')}
languages:     ${skills.programming.join(', ')}`
        })
        break
      case 'projects':
        out.push({ kind: 'out', text: projects.map((p) => `· ${p.id.padEnd(18)}  ${p.title}`).join('\n') })
        out.push({ kind: 'sys', text: `use 'open <id>' for details. ids: ${PROJECT_IDS.join(', ')}` })
        break
      case 'open': {
        const id = rest[0]
        const p = projects.find((x) => x.id === id)
        if (!p) {
          out.push({ kind: 'err', text: `unknown project '${id ?? ''}'. try one of: ${PROJECT_IDS.join(', ')}` })
        } else {
          out.push({ kind: 'out', text:
`[ ${p.title} ] (${p.category})
${p.description}

stack: ${p.techStack.join(', ')}

challenge: ${p.challenge}
solution:  ${p.solution}
outcomes:
${p.outcomes?.map((o) => '  · ' + o).join('\n') ?? ''}
${p.githubUrl ? `repo: ${p.githubUrl}` : ''}`
          })
        }
        break
      }
      case 'contact':
        out.push({ kind: 'out', text:
`email     ${personalInfo.email}
phone     ${personalInfo.phone}
github    ${personalInfo.github}
linkedin  ${personalInfo.linkedin}
location  ${personalInfo.location}` })
        break
      case 'resume':
        out.push({ kind: 'out', text: 'opening dossier in a new view…' })
        out.push({ kind: 'sys', text: '→ /#/dossier' })
        setTimeout(() => { window.location.hash = '/dossier' }, 250)
        break
      case 'uptime':
        out.push({ kind: 'out', text:
`platform   :  all systems nominal
shipping   :  3+ years
cycle time :  8m end-to-end (gitops)
latency    :  p95 −40% on llm gateway` })
        break
      case 'sudo': {
        if (rest[0] === 'hire') {
          out.push({ kind: 'out', text: 'priority routing enabled. mailto sequence dispatched…' })
          setTimeout(() => { window.location.href = `mailto:${personalInfo.email}?subject=Platform%20Engineer%20Role` }, 250)
        } else {
          out.push({ kind: 'err', text: `sudo: ${rest.join(' ') || ''}: command not found` })
        }
        break
      }
      case 'clear':
        setLines([])
        return
      default:
        out.push({ kind: 'err', text: `vs-shell: ${head}: command not found. try 'help'.` })
    }
    setLines((prev) => [...prev, ...out])
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      run(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const nIdx = Math.min(history.length - 1, hIdx + 1)
      setHIdx(nIdx); setInput(history[nIdx] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nIdx = Math.max(-1, hIdx - 1)
      setHIdx(nIdx); setInput(nIdx === -1 ? '' : history[nIdx])
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <section id="terminal" className="relative section border-t border-line">
      <div className="container-x">
        <Reveal>
          <SectionHeader
            index="06"
            kicker="VS-SHELL · INTERACTIVE"
            title={<>Skip the brochure.<br/><span className="serif italic text-accent">Query me directly.</span></>}
            subtitle="A miniature terminal connected to my dossier. Type `help` to begin, or try `projects`, `stack`, `sudo hire`."
          />
        </Reveal>

        <Reveal>
          <div
            ref={containerRef}
            onClick={focusOnce}
            className="mt-14 card overflow-hidden cursor-text"
          >
            {/* title bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-bg/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-danger/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-signal/70" />
                <span className="ml-3 mono text-[10.5px] tracking-[0.1em] text-faint">vs@platform-shell — zsh</span>
              </div>
              <TerminalIcon size={12} className="text-faint" />
            </div>

            <div
              ref={scrollerRef}
              className="font-mono text-[12.5px] leading-[1.55] text-text bg-[#08080a] p-5 h-[480px] overflow-y-auto"
            >
              {lines.map((l, i) => {
                if (l.kind === 'in') {
                  return (
                    <div key={i} className="flex gap-2">
                      <span className="text-accent">vs@platform</span>
                      <span className="text-faint">$</span>
                      <span className="text-text whitespace-pre-wrap">{l.text}</span>
                    </div>
                  )
                }
                const color =
                  l.kind === 'err' ? 'text-danger' :
                  l.kind === 'sys' ? 'text-info' :
                  l.kind === 'banner' ? 'text-accent' :
                  'text-muted'
                return (
                  <pre key={i} className={`whitespace-pre-wrap break-words ${color}`}>{l.text}</pre>
                )
              })}

              <div className="flex gap-2 mt-1 items-center">
                <span className="text-accent">vs@platform</span>
                <span className="text-faint">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKey}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  className="flex-1 bg-transparent outline-none text-text caret-accent"
                  aria-label="Terminal input"
                  placeholder="type a command…"
                />
                <span className="w-1.5 h-4 bg-accent anim-blink" />
              </div>
            </div>

            <div className="px-4 py-2 border-t border-line bg-bg/40 flex items-center justify-between mono text-[10px] tracking-[0.08em] text-faint">
              <span>↑/↓ history · Ctrl+L clear · 'help' for commands</span>
              <span>EXIT 0</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
