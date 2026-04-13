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
      <div style={{
        background: 'rgba(30,24,18,0.92)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '12px',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '6px' }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: p.color }} />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{p.name}:</span>
            <span style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 500 }}>
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
    <div className="card" style={{ padding: '18px 20px', marginBottom: '12px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {title}
        </div>
        {sub && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
      {legend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px' }}>
          {legend.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{
                width: '20px', height: '1.5px',
                background: item.dashed ? 'none' : item.color,
                borderTop: item.dashed ? `2px dashed ${item.color}` : undefined,
                borderRadius: '2px'
              }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SummaryPill({ label, value, trend, accent }) {
  return (
    <div className="card" style={{ padding: '14px 16px' }}>
      <div style={{ fontSize: '22px', fontWeight: 500, color: accent || 'rgba(255,255,255,0.88)' }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{label}</div>
      {trend && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '4px' }}>{trend}</div>}
    </div>
  )
}

const axisStyle = { fontSize: 11, fill: 'rgba(255,255,255,0.28)' }
const gridColor = 'rgba(255,255,255,0.06)'

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
    <div className="bg-trends" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid rgba(255,255,255,0.6)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div className="bg-trends page-enter" style={{ padding: '52px 20px 32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '4px' }}>Last 10 weeks</div>
        <h1 className="font-serif-italic" style={{ fontSize: '38px', color: 'rgba(255,255,255,0.92)', margin: 0, lineHeight: 1.1 }}>
          Trends
        </h1>
      </div>

      {/* Summary pills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <SummaryPill label="Yoga consistency" value={`${yogaPct}%`} trend="last 30 days" accent="rgba(130,190,130,0.9)" />
        <SummaryPill label="Sunlight consistency" value={`${sunPct}%`} trend="last 30 days" accent="rgba(210,150,80,0.9)" />
        <SummaryPill label="Walk days" value={`${walkPct}%`} trend="last 30 days" accent="rgba(180,160,130,0.9)" />
        <SummaryPill label="Workout sessions" value={workoutCount} trend="last 30 days" accent="rgba(255,255,255,0.88)" />
      </div>

      {logs.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📈</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, marginBottom: '6px' }}>No data yet</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Start logging — trends appear after a few days.</div>
        </div>
      ) : weeklyData.length < 2 ? (
        <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>Log a few more days to see trend lines</div>
        </div>
      ) : (
        <>
          {/* Habit score */}
          <TrendCard title="Overall habit score" sub={scoreTrend}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(130,190,130,0.35)" />
                    <stop offset="95%" stopColor="rgba(130,190,130,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip unit="%" />} />
                <ReferenceLine y={75} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 2" label={{ value: 'target', position: 'right', fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <Area type="monotone" dataKey="habitScore" name="Habit score" stroke="rgba(130,190,130,0.85)" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 3.5, fill: 'rgba(130,190,130,0.85)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </TrendCard>

          {/* Morning routine */}
          <TrendCard
            title="Morning routine"
            sub="Days per week"
            legend={[
              { label: 'Yoga & breathing', color: 'rgba(130,190,130,0.85)' },
              { label: 'Sunlight', color: 'rgba(210,150,80,0.85)', dashed: true },
            ]}
          >
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 7]} tick={axisStyle} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" days" />} />
                <Line type="monotone" dataKey="yoga" name="Yoga" stroke="rgba(130,190,130,0.85)" strokeWidth={2.5} dot={{ r: 3, fill: 'rgba(130,190,130,0.85)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="sunlight" name="Sunlight" stroke="rgba(210,150,80,0.85)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: 'rgba(210,150,80,0.85)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </TrendCard>

          {/* Walks */}
          <TrendCard
            title="Walks"
            sub="Days per week"
            legend={[
              { label: 'Midday', color: 'rgba(180,160,130,0.85)' },
              { label: 'After dinner', color: 'rgba(180,160,130,0.45)', dashed: true },
            ]}
          >
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 7]} ticks={[0, 2, 4, 7]} tick={axisStyle} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" days" />} />
                <Line type="monotone" dataKey="middayWalk" name="Midday" stroke="rgba(180,160,130,0.85)" strokeWidth={2.5} dot={{ r: 3, fill: 'rgba(180,160,130,0.85)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="dinnerWalk" name="After dinner" stroke="rgba(180,160,130,0.45)" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: 'rgba(180,160,130,0.45)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </TrendCard>

          {/* Workouts */}
          <TrendCard title="Workouts completed" sub="Sessions per week · target: 3">
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="95%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 3]} ticks={[0, 1, 2, 3]} tick={axisStyle} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip unit=" sessions" />} />
                <ReferenceLine y={3} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 2" label={{ value: 'goal', position: 'right', fontSize: 10, fill: 'rgba(255,255,255,0.2)' }} />
                <Area type="monotone" dataKey="workouts" name="Workouts" stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} fill="url(#workoutGrad)" dot={{ r: 3.5, fill: 'rgba(255,255,255,0.7)', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </TrendCard>
        </>
      )}
    </div>
  )
}
