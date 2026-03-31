import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { Home, BarChart2, Dumbbell, Calendar } from 'lucide-react'
import TodayPage from './pages/TodayPage'
import WorkoutPage from './pages/WorkoutPage'
import TrendsPage from './pages/TrendsPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <main className="max-w-lg mx-auto px-4 pt-8">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-3 z-50">
        <div className="max-w-lg mx-auto flex justify-around">
          <NavLink to="/" end className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400'}`
          }>
            <Home size={20} />
            <span>Today</span>
          </NavLink>
          <NavLink to="/workout" className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400'}`
          }>
            <Dumbbell size={20} />
            <span>Workout</span>
          </NavLink>
          <NavLink to="/trends" className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400'}`
          }>
            <BarChart2 size={20} />
            <span>Trends</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-colors ${isActive ? 'text-stone-800' : 'text-stone-400'}`
          }>
            <Calendar size={20} />
            <span>History</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
