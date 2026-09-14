/**
 * Application routes. Public central views stay available without an account;
 * member-facing pages require a profile, and booth/admin pages are role-gated.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Central } from './pages/Central'
import { CentralTeam } from './pages/CentralTeam'
import { Board } from './pages/Board'
import { Login } from './pages/Login'
import { Onboarding } from './pages/Onboarding'
import { Profile } from './pages/Profile'
import { Review } from './pages/Review'
import { RollCall } from './pages/RollCall'
import { Export } from './pages/Export'
import { Submit } from './pages/Submit'
import { Admin } from './pages/Admin'
import { Notifications } from './pages/Notifications'
import { Analytics } from './pages/Analytics'
import { Chat } from './pages/Chat'
import { NotFound } from './pages/Placeholders'
import { TEAMS } from './config/teams'
import { PublicOnly, RequireAuth, RequireProfile, RequireRole } from './guards/RouteGuards'
import { DEMO_MODE } from './supabase'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public central and team scoreboards. */}
          <Route path="/central" element={<Central />} />
          {TEAMS.map((team) => {
            return <Route key={team.id} path={`/central/${team.slug}`} element={<CentralTeam hardcodedTeamId={team.id} />} />
          })}

          {/* Authentication and first-time profile setup. */}
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />

          {/* Authenticated member routes. */}
          <Route path="/" element={<RequireProfile><Board /></RequireProfile>} />
          <Route path="/submit" element={<RequireProfile><Submit /></RequireProfile>} />
          <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
          <Route path="/notifications" element={DEMO_MODE ? <Notifications /> : <RequireProfile><Notifications /></RequireProfile>} />
          <Route path="/analytics" element={DEMO_MODE ? <Analytics /> : <RequireProfile><Analytics /></RequireProfile>} />
          <Route path="/chat" element={DEMO_MODE ? <Chat /> : <RequireProfile><Chat /></RequireProfile>} />

          {/* Core-member booth routes. */}
          <Route path="/review" element={<RequireRole minRole="core"><Review /></RequireRole>} />
          <Route path="/booth" element={<RequireRole minRole="core"><Review /></RequireRole>} />
          <Route path="/booth/meetups" element={<RequireRole minRole="core"><RollCall /></RequireRole>} />

          {/* Lead-only administration and export. */}
          <Route path="/admin" element={<RequireRole minRole="lead"><Admin /></RequireRole>} />
          <Route path="/booth/export" element={<RequireRole minRole="lead"><Export /></RequireRole>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
