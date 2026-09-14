import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Radio, Trophy, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase, DEMO_MODE } from '../supabase'
import { BoardLayout } from '../components/layout/BoardLayout'
import { BoardPanel } from '../components/board/BoardPanel'
import { Skeleton } from '../components/primitives/Skeleton'
import { ErrorState, EmptyState } from '../components/feedback/EmptyState'
import { mockTeams } from '../lib/mockData'
import { CentralNav } from '../components/dashboard/CentralNav'
import { ReadinessPanel } from '../components/dashboard/ReadinessPanel'

type TeamTotal = { team_id: string; team_name: string; total_points: number | null }
const number = new Intl.NumberFormat('en-US')
const slugFor = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

export function Central() {
  const navigate = useNavigate()
  const totalsQuery = useQuery({
    queryKey: ['central-totals'],
    queryFn: async (): Promise<TeamTotal[]> => {
      if (DEMO_MODE) {
        return mockTeams.map(t => ({ team_id: t.id, team_name: t.name, total_points: t.totalPoints }))
          .sort((a, b) => (b.total_points ?? 0) - (a.total_points ?? 0))
      }
      const { data, error } = await supabase.rpc('get_central_totals')
      if (error) throw error
      return (data || []).map(row => ({
        team_id: row.team_id,
        team_name: row.team_name,
        total_points: row.total_points,
      }))
    },
  })

  const teams = totalsQuery.data || []
  const totalPoints = teams.reduce((sum, team) => sum + (team.total_points || 0), 0)
  const leader = teams[0]

  return (
    <BoardLayout topbar={
      <div className="flex w-full items-center justify-between gap-4">
        <div>
          <p className="label text-lamp">AARVAK / SOCIETY CONTROL</p>
          <p className="font-display text-lg font-bold tracking-sign text-chalk">AARVAK TSJ 2026 DASHBOARD</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted" aria-label={DEMO_MODE ? 'Preview mode' : 'Live results'}>
          <span className={`status-dot ${DEMO_MODE ? 'status-dot--preview' : ''}`} />
          <span className="hidden sm:inline">{DEMO_MODE ? 'PREVIEW' : 'LIVE RESULTS'}</span>
        </div>
      </div>
    }>
      <section className="central-hero">
        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-2 text-lamp">
            <Radio size={15} aria-hidden="true" />
            <span className="label">Season 01 / standings</span>
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Competition, in one view<span className="text-lamp">.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
            One shared view of progress across every AARVAK team. Follow the standings, then open a team to see its public activity trail.
          </p>
          {DEMO_MODE && <p className="mt-5 inline-flex rounded-pill border border-lamp/30 bg-lamp/10 px-3 py-1.5 text-xs text-lamp">Preview data · live scores appear when connected</p>}
        </div>
        <div className="central-hero__orb" aria-hidden="true" />
      </section>
      <div className="flex flex-col gap-3">
        <CentralNav />
        <ReadinessPanel demo={DEMO_MODE} unavailable={totalsQuery.isError} />
      </div>

      {totalsQuery.isLoading ? (
        <BoardPanel><div className="space-y-3"><Skeleton variant="total" /><Skeleton variant="row" /><Skeleton variant="row" /></div></BoardPanel>
      ) : totalsQuery.isError ? (
        <BoardPanel><ErrorState headline="The board is offline" body="We couldn't retrieve the latest standings. Try again in a moment." retry={() => totalsQuery.refetch()} /></BoardPanel>
      ) : teams.length === 0 ? (
        <BoardPanel><EmptyState headline="No teams on the board yet" body="Standings will appear here once the first team checks in." /></BoardPanel>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="stat-card"><Users size={17} className="text-cyan" aria-hidden="true" /><span className="label text-muted">Teams</span><strong>{teams.length}</strong></div>
            <div className="stat-card"><Trophy size={17} className="text-amber" aria-hidden="true" /><span className="label text-muted">Leader</span><strong className="truncate text-lg">{leader?.team_name}</strong></div>
            <div className="stat-card col-span-2 sm:col-span-1"><span className="label text-muted">Points in play</span><strong>{number.format(totalPoints)}</strong></div>
          </div>
          <BoardPanel padded={false}>
            <div className="flex items-end justify-between border-b border-seam px-panel py-5">
              <div><p className="label text-lamp">Live standings</p><h2 className="mt-2 font-display text-xl font-bold text-chalk">Who is moving up?</h2></div>
              <span className="hidden text-xs text-muted sm:block">Select a team for detail</span>
            </div>
            <div className="p-3 sm:p-5">
              {teams.map((team, index) => (
                <button
                  key={team.team_id}
                  onClick={() => navigate(`/central/${slugFor(team.team_name)}`)}
                  className={`leaderboard-row group ${index === 0 ? 'leaderboard-row--first' : ''}`}
                  aria-label={`Open ${team.team_name} team board`}
                >
                  <span className="leaderboard-rank">{String(index + 1).padStart(2, '0')}</span>
                  <span className={`leaderboard-team team-accent team-accent--${index % 4}`}>
                    <span className="team-mark">{team.team_name.slice(0, 1)}</span>
                    <span><strong>{team.team_name}</strong><small>{index === 0 ? 'Current leader' : 'Team standing'}</small></span>
                  </span>
                  <span className="leaderboard-points">{team.total_points === null ? '—' : number.format(team.total_points)}<small>PTS</small></span>
                  <ArrowRight size={18} className="leaderboard-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>
          </BoardPanel>
        </>
      )}
    </BoardLayout>
  )
}
