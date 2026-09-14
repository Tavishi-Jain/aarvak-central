import { ReactNode } from 'react'

export function BoardLayout({ children, topbar }: { children: ReactNode, topbar?: ReactNode }) {
  return (
    <div className="tech-shell min-h-screen bg-recess flex flex-col items-center">
      <div className="tech-backdrop" aria-hidden="true">
        <span className="tech-orb tech-orb--one" />
        <span className="tech-orb tech-orb--two" />
        <span className="tech-orb tech-orb--three" />
        <span className="tech-trace tech-trace--one" />
        <span className="tech-trace tech-trace--two" />
        <span className="tech-particles tech-particles--one" />
        <span className="tech-particles tech-particles--two" />
      </div>
      <header className="relative z-10 w-full bg-enamel/90 border-b border-seam min-h-[56px] sticky top-0 z-header flex flex-wrap items-center justify-between px-gutter gap-2 py-1 backdrop-blur-md">
        <div className="flex-1 min-w-0 flex items-center w-full">
          {topbar}
        </div>
      </header>
      <main className="relative z-10 w-full max-w-board px-gutter py-stack flex flex-col gap-stack">
        {children}
      </main>
    </div>
  )
}
