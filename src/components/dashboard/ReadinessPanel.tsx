import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export function ReadinessPanel({ demo, unavailable = false }: { demo: boolean; unavailable?: boolean }) {
  const ready = !demo && !unavailable
  return (
    <div className={`flex items-start gap-3 rounded-panel border p-4 ${
      ready ? 'border-posted/30 bg-posted/[.06]' : 'border-amber/35 bg-amber/[.07]'
    }`}>
      {ready ? <CheckCircle2 className="mt-0.5 shrink-0 text-posted" size={18} aria-hidden="true" /> : <AlertTriangle className="mt-0.5 shrink-0 text-amber" size={18} aria-hidden="true" />}
      <div>
        <p className="label text-chalk">{ready ? 'Live data connected' : demo ? 'Preview data active' : 'Live data not ready'}</p>
        <p className="mt-1 text-sm text-muted">
          {ready
            ? 'Standings and approved activity are being read from Supabase.'
            : demo
              ? 'This view is safe demo data. Connect Supabase and deploy the dashboard RPCs for live results.'
              : 'Supabase responded, but the required dashboard RPC is not deployed in this project yet.'}
        </p>
      </div>
    </div>
  )
}
