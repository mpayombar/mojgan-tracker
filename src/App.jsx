import { Routes, Route, NavLink } from 'react-router-dom'
import { Home, Plus, BarChart2, Calendar } from 'lucide-react'
import TodayPage from './pages/TodayPage'
import WorkoutPage from './pages/WorkoutPage'
import TrendsPage from './pages/TrendsPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: '72px' }}>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 0 20px',
        zIndex: 50
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
          <NavLink to="/" end style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            {({ isActive }) => (<>
              <Home size={20} style={{ stroke: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }} strokeWidth={1.5} fill="none" />
              {isActive && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />}
            </>)}
          </NavLink>
          <NavLink to="/workout" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            {({ isActive }) => (<>
              <Plus size={20} style={{ stroke: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }} strokeWidth={1.5} fill="none" />
              {isActive && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />}
            </>)}
          </NavLink>
          <NavLink to="/trends" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            {({ isActive }) => (<>
              <BarChart2 size={20} style={{ stroke: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }} strokeWidth={1.5} fill="none" />
              {isActive && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />}
            </>)}
          </NavLink>
          <NavLink to="/history" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
            {({ isActive }) => (<>
              <Calendar size={20} style={{ stroke: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.28)' }} strokeWidth={1.5} fill="none" />
              {isActive && <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />}
            </>)}
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
