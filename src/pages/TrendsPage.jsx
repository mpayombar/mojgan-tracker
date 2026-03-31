import { useMemo } from 'react'
import { subDays, subWeeks, startOfWeek, endOfWeek, format, eachWeekOfInterval } from 'date-fns'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useRange } from '../lib/useData'

const today = new Date()
const start = subWeeks(today, 8)

function SectionTitle({ children }) {
  return <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">{children}</h2>
}

function StatRow({ label, value, sub, color = 'stone' }) {
  const colors = {
    sage: 'text-sage-600',
    terracotta: 'text-terracotta-600',
    stone: 'text-stone-800',
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
      <div>
        <div className="text-sm text-stone-700">{label}</div>
        {sub && <div className="text-xs text-stone-400 mt-0.5">{sub}</div>}
      </div>
      <div className={`text-lg font-display font-medium ${colors[color]}`}>{value}</div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-100 rounded-xl px-3 py-2 shadow-md text-xs">
        <div className="text-stone-400 mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="font-medium" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(0) : p.value}
            {p.name === 'Habit score' ? '%' : ''}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function TrendsPage() {
  const { logs, loading } = useRange(start, today)

  const weeklyData = useMemo(() => {
    const weeks = eachWeekOfInterval({ start, end: today }, { weekStartsOn: 1 })
    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      const weekLogs = logs.filter(l => {
        const d = new Date(l.date)
        return d >= weekStart && d <= weekEnd
      })
      const days = weekLogs.length
      if (days === 0) return null

      const yoga = weekLogs.filter(l => l.yoga).length
      const sun = weekLogs.filter(l => l.sunlight).length
      const midday = weekLogs.filter(l => l.midday_walk).length
      const dinner = weekLogs.filter(l => l.dinner_walk).length
      const workouts = weekLogs.filter(l => l.workout_done).length

      const totalPossible = days * 4 + 3
      const totalDone = yoga + sun + midday + dinner + workouts
      const habitScore = Math.round((totalDone / totalPossible) * 100)

      return {
        week: format(weekStart, 'MMM d'),
        yoga,
        sunlight: sun,
        middayWalk: midday,
        dinnerWalk: dinner,
        workouts,
        habitScore,
        days,
      }
    }).filter(Boolean)
  }, [logs])

  const last30 = logs.slice(-30)
  const yogaDays = last30.filter(l => l.yoga).length
  const sunDays = last30.filter(l => l.sunlight).length
  const middayDays = last30.filter(l => l.midday_walk).length
  const dinnerDays = last30.filter(l => l.dinner_walk).length
  const workoutSessions = last30.filter(l => l.workout_done).length
  const totalDays = last30.length || 1

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  )

  if (logs.length === 0) return (
    <div className="page-enter">
      <div className="pt-2 mb-6">
        <h1 className="text-3xl font-display text-stone-800">Trends</h1>
      </div>
      <div className="card p-8 text-center">
        <div className="text-4xl mb-3">📈</div>
        <div className="text-stone-600 font-medium mb-1">No data yet</div>
        <div className="text-sm text-stone-400">Start logging daily habits and workouts — your trends will appear here.</div>
      </div>
    </div>
  )

  return (
    <div className="page-enter space-y-6">
      <div className="pt-2">
        <h1 className="text-3xl font-display text-stone-800">Trends</h1>
        <p className="text-sm text-stone-400 mt-1">Last 8 weeks</p>
      </div>

      {/* Summary stats */}
      <div className="card p-5">
        <SectionTitle>Last 30 days</SectionTitle>
        <StatRow label="Morning yoga" sub={`${yogaDays} of ${totalDays} days`} value={`${Math.round(yogaDays/totalDays*100)}%`} color="sage" />
        <StatRow label="Morning sunlight" sub={`${sunDays} of ${totalDays} days`} value={`${Math.round(sunDays/totalDays*100)}%`} color="sage" />
        <StatRow label="Midday walk" sub={`${middayDays} of ${totalDays} days`} value={`${Math.round(middayDays/totalDays*100)}%`} color="terracotta" />
        <StatRow label="After-dinner walk" sub={`${dinnerDays} of ${totalDays} days`} value={`${Math.round(dinnerDays/totalDays*100)}%`} color="terracotta" />
        <StatRow label="Workout sessions" sub="Mon / Wed / Fri" value={workoutSessions} />
      </div>

      {/* Weekly habit score */}
      {weeklyData.length > 1 && (
        <div className="card p-5">
          <SectionTitle>Weekly habit score</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="habitScore" name="Habit score" fill="#5fa45f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Morning routine streak */}
      {weeklyData.length > 1 && (
        <div className="card p-5">
          <SectionTitle>Morning routine consistency</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 7]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="yoga" name="Yoga days" stroke="#5fa45f" strokeWidth={2} dot={{ r: 3, fill: '#5fa45f' }} />
              <Line dataKey="sunlight" name="Sunlight days" stroke="#e07040" strokeWidth={2} dot={{ r: 3, fill: '#e07040' }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <div className="w-4 h-0.5 bg-sage-500 rounded" /> Yoga
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <div className="w-4 h-0.5 bg-terracotta-400 rounded border-dashed" style={{borderTop: '2px dashed #e07040', background: 'none'}} /> Sunlight
            </div>
          </div>
        </div>
      )}

      {/* Walk consistency */}
      {weeklyData.length > 1 && (
        <div className="card p-5">
          <SectionTitle>Walk consistency</SectionTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 7]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} />
              <Line dataKey="middayWalk" name="Midday walks" stroke="#78716c" strokeWidth={2} dot={{ r: 3, fill: '#78716c' }} />
              <Line dataKey="dinnerWalk" name="Dinner walks" stroke="#a8a29e" strokeWidth={2} dot={{ r: 3, fill: '#a8a29e' }} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <div className="w-4 h-0.5 bg-stone-600 rounded" /> Midday
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <div className="w-4 h-0.5 bg-stone-400 rounded" /> Dinner
            </div>
          </div>
        </div>
      )}

      {/* Workouts */}
      {weeklyData.length > 1 && (
        <div className="card p-5">
          <SectionTitle>Workouts per week</SectionTitle>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weeklyData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 3]} ticks={[0,1,2,3]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="workouts" name="Workouts" fill="#292524" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
