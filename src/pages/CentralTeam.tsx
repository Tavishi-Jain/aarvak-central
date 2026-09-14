import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, CheckCircle2, Users } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase, DEMO_MODE } from '../supabase'
import { BoardLayout } from '../components/layout/BoardLayout'
import { BoardPanel } from '../components/board/BoardPanel'
import { Skeleton } from '../components/primitives/Skeleton'
import { ErrorState, EmptyState } from '../components/feedback/EmptyState'
import { StatusPill } from '../components/status/StatusPill'
import { TEAMS } from '../config/teams'
import { Avatar } from '../components/media/Avatar'
import { mockTeams } from '../lib/mockData'
import { CentralNav } from '../components/dashboard/CentralNav'
import { ReadinessPanel } from '../components/dashboard/ReadinessPanel'
import { ScoringExplainer } from '../components/dashboard/ScoringExplainer'
import { Breadcrumbs } from '../components/dashboard/Breadcrumbs'
import { Share2 } from 'lucide-react'

type Detail = {
  team: { id: string; name: string; slug: string; total_points: number | null }
  members: { id: string; full_name: string; sprint_track: string | null; net_points: number | null }[]
  feed: { id: string; member_name: string; activity_name: string; activity_level: string | null; points: number | null; status: string; date: string }[]
}
const number = new Intl.NumberFormat('en-US')
const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export function CentralTeam({ hardcodedTeamId }: { hardcodedTeamId?: string }) {
  const navigate = useNavigate()
  const params = useParams()
  const teamId = hardcodedTeamId || params.teamId
  const detailQuery = useQuery({
    queryKey: ['central-team-detail', teamId],
    enabled: !!teamId,
    queryFn: async (): Promise<Detail> => {
      const team = TEAMS.find(t => t.id === teamId)
      if (!team) throw new Error('Team not found')
      if (DEMO_MODE) return mockDetail(team.id)
      const { data, error } = await supabase.rpc('get_central_team_detail', { p_team_id: team.id })
      if (error || !data || typeof data !== 'object' || Array.isArray(data)) throw error || new Error('Invalid team details response')
      const detail = data as Partial<Detail>
      return {
        team: detail.team as Detail['team'],
        members: (detail.members || []).map(member => ({ id: member.id, full_name: member.full_name, sprint_track: member.sprint_track, net_points: null })),
        feed: (detail.feed || []).map(row => ({ id: row.id, member_name: row.member_name, activity_name: row.activity_name, activity_level: row.activity_level, points: typeof row.points === 'number' ? row.points : null, status: row.status, date: row.date })),
      }
    },
  })

  const goBack = () => navigate('/central')
  const shareTeam = async () => {
    const url = window.location.href
    if (navigator.share) await navigator.share({ title: `${teamId} team board`, url }).catch(() => undefined)
    else await navigator.clipboard?.writeText(url)
  }
  if (detailQuery.isLoading) return <BoardLayout><BoardPanel><div className="space-y-4"><Skeleton variant="total" /><Skeleton variant="row" /><Skeleton variant="row" /></div></BoardPanel></BoardLayout>
  if (detailQuery.isError || !detailQuery.data) return <BoardLayout topbar={<button className="back-button" onClick={goBack}><ArrowLeft size={16} /> Back to board</button>}><BoardPanel><ErrorState headline="Team board unavailable" body="This team's public board couldn't be loaded." retry={() => detailQuery.refetch()} /></BoardPanel></BoardLayout>

  const { team, members, feed } = detailQuery.data
  return (
    <BoardLayout topbar={<div className="flex w-full items-center justify-between gap-3"><button className="back-button" onClick={goBack}><ArrowLeft size={16} /> <span className="hidden sm:inline">AARVAK TSJ 2026 DASHBOARD</span><span className="sm:hidden">Back</span></button><span className="label text-lamp">{DEMO_MODE ? 'PREVIEW' : 'PUBLIC BOARD'}</span></div>}>
      <section className={`team-hero team-hero--${team.slug}`}>
        <div><p className="label text-lamp">Team board / {team.slug}</p><h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">{team.name}<span className="text-lamp">.</span></h1><p className="mt-3 text-sm text-muted">Public progress, shared momentum. Individual totals stay private.</p></div>
        <div className="team-total"><span className="label text-muted">Total points</span><strong>{team.total_points === null ? '—' : number.format(team.total_points)}</strong><span className="text-xs text-muted">verified team score</span><button type="button" onClick={() => void shareTeam()} className="mt-3 inline-flex items-center gap-2 text-xs text-lamp hover:text-white"><Share2 size={14} aria-hidden="true" /> Share public link</button></div>
      </section>
      <Breadcrumbs current={team.name} locked />
      <div className="flex flex-col gap-3">
        <CentralNav />
        <ReadinessPanel demo={DEMO_MODE} />
      </div>
      <ScoringExplainer />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="stat-card"><Users size={17} className="text-cyan" /><span className="label text-muted">Crew</span><strong>{members.length}</strong></div><div className="stat-card"><CheckCircle2 size={17} className="text-posted" /><span className="label text-muted">Activities</span><strong>{feed.length}</strong></div><div className="stat-card col-span-2 sm:col-span-1"><CalendarDays size={17} className="text-amber" /><span className="label text-muted">Latest signal</span><strong className="text-lg">{feed[0] ? date(feed[0].date) : '—'}</strong></div></div>
      <BoardPanel padded={false}><div className="border-b border-seam px-panel py-5"><p className="label text-lamp">The crew</p><h2 className="mt-2 font-display text-xl font-bold text-chalk">People behind the points</h2></div>{members.length ? <div className="grid gap-2 p-3 sm:grid-cols-2 sm:p-5">{members.map(member => <div key={member.id} className="member-card"><Avatar name={member.full_name} size="sm" /><div className="min-w-0"><strong className="block truncate text-sm text-chalk">{member.full_name}</strong><span className="text-xs text-muted">{member.sprint_track || 'Track not listed'}</span></div><span className="ml-auto label text-dim" title="Individual totals are private">PRIVATE</span></div>)}</div> : <EmptyState headline="No members listed" body="This team has not published its crew yet." />}</BoardPanel>
      <BoardPanel padded={false}><div className="border-b border-seam px-panel py-5"><p className="label text-lamp">Public activity</p><h2 className="mt-2 font-display text-xl font-bold text-chalk">Signals from the team</h2></div>{feed.length ? <div className="divide-y divide-seam">{feed.map(row => <div key={row.id} className="activity-row"><Avatar name={row.member_name} size="sm" /><div className="min-w-0 flex-1"><strong className="block truncate text-sm text-chalk">{row.activity_name}</strong><span className="text-xs text-muted">{row.member_name}{row.activity_level ? ` · ${row.activity_level}` : ''} · {date(row.date)}</span></div><StatusPill status={row.status as any} size="sm" /><span className="w-14 text-right font-display text-sm font-bold text-chalk">{row.points === null ? '—' : `+${row.points}`}</span></div>)}</div> : <EmptyState headline="No activity yet" body="The first verified signal will appear here." />}</BoardPanel>
    </BoardLayout>
  )
}

function mockDetail(id: string): Detail {
  const source = mockTeams.find(team => team.id === id) || mockTeams[0]
  return {
    team: { id: source.id, name: source.name, slug: source.name.toLowerCase().replace(/\s+/g, '-'), total_points: source.totalPoints },
    // Deliberately omit member totals in public/demo data.
    members: [{ id: `${source.id}-member`, full_name: `${source.name} crew`, sprint_track: source.track, net_points: null }],
    feed: source.breakdown.map((item, index) => ({ id: `${source.id}-${index}`, member_name: source.name, activity_name: item.activity, activity_level: null, points: item.points, status: 'verified', date: new Date(Date.now() - index * 86400000).toISOString() })),
  }
}
