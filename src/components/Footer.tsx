import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-line bg-bg">
      <div className="container-x py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="mono-label text-muted mb-5">// CONTACT — END OF TRANSMISSION</div>
            <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-tightest font-light text-grad">
              Let&rsquo;s ship<br/>
              <span className="serif italic text-accent">production-grade</span> infra.
            </h2>
            <p className="mt-6 max-w-prose text-muted text-base md:text-lg leading-relaxed">
              I help teams move from fragile scripts to platforms that scale, self-heal,
              and stay observable in the dark hours. Open to senior platform, DevOps,
              MLOps, and AI-infra roles — remote or hybrid.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="mailto:viveksinghfx@gmail.com" className="btn btn-primary">
                <Mail size={14}/> Email Me
              </a>
              <Link to="/dossier" className="btn">
                Read Dossier <ArrowUpRight size={14}/>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-8 content-start">
            <FooterCol title="Channels">
              <FooterLink href="mailto:viveksinghfx@gmail.com" icon={<Mail size={12}/>}>Email</FooterLink>
              <FooterLink href="https://github.com/viveksinghfx" icon={<Github size={12}/>}>GitHub</FooterLink>
              <FooterLink href="https://linkedin.com/in/vsdevop" icon={<Linkedin size={12}/>}>LinkedIn</FooterLink>
              <FooterLink href="tel:+919818506148">+91 98185 06148</FooterLink>
            </FooterCol>
            <FooterCol title="Navigate">
              <FooterLink href="#manifesto">Manifesto</FooterLink>
              <FooterLink href="#stack">Stack</FooterLink>
              <FooterLink href="#work">Work</FooterLink>
              <FooterLink href="#architect">Game</FooterLink>
              <FooterLink href="#terminal">Terminal</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-20 pt-6 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="mono text-[11px] text-faint tracking-[0.06em]">
            © {new Date().getFullYear()} Vivek Singh · New Delhi, India · Built with React + Vite + Tailwind
          </div>
          <div className="mono text-[11px] text-faint tracking-[0.08em] flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal anim-pulse" />
            ALL SYSTEMS NOMINAL
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mono-label text-faint mb-4">{title}</div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
  const external = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="group inline-flex items-center gap-2 text-sm text-muted hover:text-text transition"
      >
        {icon && <span className="text-faint group-hover:text-accent transition">{icon}</span>}
        <span className="border-b border-transparent group-hover:border-accent/70">{children}</span>
      </a>
    </li>
  )
}
