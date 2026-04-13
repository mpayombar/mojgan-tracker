import { useMemo } from 'react'
import { subWeeks, endOfWeek, format, eachWeekOfInterval } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart
} from 'recharts'
import { useRange } from '../lib/useData'

const today = new Date()
const start = subWeeks(today, 10)

const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-100 rounded-xl px-3 py-2.5 shadow-lg text-xs">
        <div className="text-stone-400 mb-1.5 font-medium">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-stone-500">{p.name}:</span>
            <span className="font-medium text-stone-800">
              {typeof p.value === 'number' ? Math.round(p.value) : p.value}{unit}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function TrendCard({ title, sub, children, legend }) {
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest">{title}</h2>
        {sub && <p className="text-xs text-stone-300 mt-0.5">{sub}</p>}
      </div>
      {children}
      {legend && (
        <div className="flex flex-wrap gap-4 mt-3">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-stone-400">
              <div className="w-5 h-0.5 rounded" style={{
                background: item.dashed ? 'none' : item.color,
                borderTop: item.dashed ? `2px dashed ${item.color}` : undefined
              }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SummaryPill({ label, value, trend, color }) {
  const colors = {
    sage: 'bg-sage-50 text-sage-700 border-sage-200',
    terracotta: 'bg-terracotta-50 text-terracotta-700 border-terracotta-200',
    stone: 'bg-stone-50 text-stone-700 border-stone-200',
  }
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${colors[color]}`}>
      <div className="text-lg font-display font-medium">{value}</div>
      <div className="text-xs mt-0.5 opacity-75">{label}</div>
      {trend && <div className="text-xs mt-1 opacity-60">{trend}</div>}
    </div>
  )
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
        yoga, sunlight: sun, middayWalk: midday,
        dinnerWalk: dinner, workouts, habitScore, days,
      }
    }).filter(Boolean)
  }, [logs])

  const last30 = logs.slice(-30)
  const totalDays = last30.length || 1
  const yogaPct = Math.round(last30.filter(l => l.yoga).length / totalDays * 100)
  const sunPct = Math.round(last30.filter(l => l.sunlight).length / totalDays * 100)
  const walkPct = Math.round(last30.filter(l => l.midday_walk || l.dinner_walk).length / totalDays * 100)
  const workoutCount = last30.filter(l => l.workout_done).length

  const latestScore = weeklyData.length > 0 ? weeklyData[weeklyData.length - 1]?.habitScore : null
  const prevScore = weeklyData.length > 1 ? weeklyData[weeklyData.length - 2]?.habitScore : null
  const scoreTrend = latestScore && prevScore
    ? latestScore > prevScore
      ? `↑ up from ${prevScore}% last week`
      : latestScore < prevScore
        ? `↓ down from ${prevScore}% last week`
        : 'same as last week'
    : null

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
        <div className="text-sm text-stone-400">Start logging — your trends will appear here after a few days.</div>
      </div>
    </div>
  )

  return (
    <div className="page-enter space-y-5">
      <div className="pt-2">
        <h1 className="text-3xl font-display text-stone-800">Trends</h1>
        <p className="text-sm text-stone-400 mt-1">Last 10 weeks</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <SummaryPill label="Yoga consistency" value={`${yogaPct}%`} trend="last 30 days" color="sage" />
        <SummaryPill label="Sunlight consistency" value={`${sunPct}%`} trend="last 30 days" color="sage" />
        <SummaryPill label="Walk days" value={`${walkPct}%`} trend="last 30 days" color="terracotta" />
        <SummaryPill label="Workout sessions" value={workoutCount} trend="last 30 days" color="stone" />
      </div>

      {weeklyData.length < 2 ? (
        <div className="card p-6 text-center">
          <div className="text-stone-400 text-sm">Log a few more days to see your trend lines</div>
        </div>
      ) : (
        <>
          <TrendCard title="Overall habit score" sub={scoreTrend}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5fa45f" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#5fa45f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <ReferenceLine y={75} stroke="#e7e5e4" strokeDasharray="4 2" label={{ value: 'target', position: 'right', fontSize: 10, fill: '#d6d3d1' }} />
                <Area type="monotone" dataKey="habitScore" name="Habit score" stroke="#5fa45f" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 3.5, fill: '#5fa45f', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </TrendCard>

          <TrendCard
            title="Morning routine"
            sub="Days per week"
            legend={[
              { label: 'Yoga & breathing', color: '#5fa45f' },
              { label: 'Sunlight', color: '#e07040', dashed: true },
            ]}
          >
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 7]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" days" />} />
                <Line type="monotone" dataKey="yoga" name="Yoga" stroke="#5fa45f" strokeWidth={2.5} dot={{ r: 3, fill: '#5fa45f', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="sunlight" name="Sunlight" stroke="#e07040" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#e07040', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </TrendCard>

          <TrendCard
            title="Walks"
            sub="Days per week"
            legend={[
              { label: 'Midday', color: '#78716c' },
              { label: 'After dinner', color: '#a8a29e', dashed: true },
            ]}
          >
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 7]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" days" />} />
                <Line type="monotone" dataKey="middayWalk" name="Midday" stroke="#78716c" strokeWidth={2.5} dot={{ r: 3, fill: '#78716c', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="dinnerWalk" name="After dinner" stroke="#a8a29e" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#a8a29e', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </TrendCard>

          <TrendCard title="Workouts completed" sub="Sessions per week · target: 3">
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#292524" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#292524" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={{ fontSize: 11, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" sessions" />} />
                <ReferenceLine y={3} stroke="#e7e5e4" strokeDasharray="4 2" label={{ value: 'goal', position: 'right', fontSize: 10, fill: '#d6d3d1' }} />
                <Area type="monotone" dataKey="workouts" name="Workouts" stroke="#292524" strokeWidth={2.5} fill="url(#workoutGrad)" dot={{ r: 3.5, fill: '#292524', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </TrendCard>
        </>
      )}
    </div>
  )
}
