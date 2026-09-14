import { ChevronDown, FileCheck2, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

type RuleGroup = { title: string; items: string[] }

const groups: RuleGroup[] = [
  {
    title: 'Team activities',
    items: [
      'Meetup attendance — 5 per member',
      'Weekly challenge — winner 15 · runner-up 5 · participation 5',
      'Society project — basic 10 · intermediate 20 · advanced 30',
      'Hackathon — 1st 50 · 2nd 30 · 3rd 20',
      'Open source — participation 10 · PR raised 10 · external merged 20 · society merged 25',
      'Final project — winner 250 · runner-up 100 · other 50',
    ],
  },
  {
    title: 'Individual contribution',
    items: [
      'DSA streak — 20 for a regular streak · 100 for a full streak',
      'Research paper 50 · blog/article 15 · external event 10',
      'Tech talk — delivery 10 · publication 10 · attendance 10',
    ],
  },
  {
    title: 'Sprint tracks',
    items: ['Code · Open Source · Build · Pitch', 'Winner 30 · runner-up 25 · participation 15 · full streak 8'],
  },
]

export function ScoringExplainer() {
  const [open, setOpen] = useState(false)
  return (
    <section className="score-explainer" aria-labelledby="scoring-title">
      <button
        type="button"
        className="score-explainer__toggle"
        aria-expanded={open}
        onClick={() => setOpen(value => !value)}
      >
        <span className="flex items-start gap-3">
          <FileCheck2 size={18} className="mt-0.5 text-lamp" aria-hidden="true" />
          <span>
            <span className="label text-lamp">Official scoring · 75 days</span>
            <strong id="scoring-title" className="mt-1 block font-display text-lg text-chalk">How points move the board</strong>
            <span className="mt-1 block text-xs leading-5 text-muted">Five teams: ASCEND, CIPHER, NEXUS, BYTE BRIGADE and ECHO.</span>
          </span>
        </span>
        <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="score-explainer__body">
          <p className="text-sm leading-6 text-muted">
            Team score = team-level activity + individual contribution points + eligible bonuses. Individual points also count toward the member's team.
          </p>
          <div className="grid gap-4 pt-4 sm:grid-cols-3">
            {groups.map(group => (
              <div key={group.title}>
                <h3 className="label text-cyan">{group.title}</h3>
                <ul className="mt-2 space-y-2 text-xs leading-5 text-chalk/80">
                  {group.items.map(item => <li key={item}>· {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-seam pt-3 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2"><ShieldAlert size={14} className="text-amber" aria-hidden="true" /> Proof is required for every claim.</span>
            <span>False claims or plagiarism remove 90% of the affected points.</span>
          </div>
        </div>
      )}
    </section>
  )
}
