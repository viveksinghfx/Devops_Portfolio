import HeroSection from '../sections/HeroSection'
import ManifestoSection from '../sections/ManifestoSection'
import StackSection from '../sections/StackSection'
import ExperienceSection from '../sections/ExperienceSection'
import WorkSection from '../sections/WorkSection'
import ArchitectGameSection from '../sections/ArchitectGameSection'
import TerminalSection from '../sections/TerminalSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ManifestoSection />
      <StackSection />
      <ExperienceSection />
      <WorkSection />
      <ArchitectGameSection />
      <TerminalSection />
    </main>
  )
}
