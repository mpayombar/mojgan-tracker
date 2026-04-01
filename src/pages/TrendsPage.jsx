import { useMemo } from 'react'
import { subWeeks, endOfWeek, format, eachWeekOfInterval } from 'date-fns'
import { useRange } from '../lib/useData'

const today = new Date()
const start = subWeeks(today, 8)
const W = (o) => `rgba(255,255,255,${o})`

function StatBox({ value, label }) {
  return (
    <div style={{ background: W(0.07), border: `1px solid ${W(0.09)}`, borderRadius: '12px', padding: '12px 14px' }}>
      <div style={{ fontSize: '24px', fontWeight: 300, color: W(0.9) }}>{value}</div>
      <div style={{ fontSize: '8px', color: W(0.32), textTransform: 'uppercase', letterSpacing: '.06em', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

export default function TrendsPage() {
  const { logs, loading } = useRange(start, today)

  const weeklyData = useMemo(() => {
    const weeks = eachWeekOfInterval({ start, end: today }, { weekStartsOn: 1 })
    return weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
      const weekLogs = logs.filter(l => { const d = new Date(l.date); return d >= weekStart && d <= weekEnd })
      if (!weekLogs.length) return null
      const yoga = weekLogs.filter(l => l.yoga).length
      const sun = weekLogs.filter(l => l.sunlight).length
      const midday = weekLogs.filter(l => l.midday_walk).length
      const dinner = weekLogs.filter(l => l.dinner_walk).length
      const workouts = weekLogs.filter(l => l.workout_done).length
      const totalPossible = weekLogs.length * 4 + 3
      const totalDone = yoga + sun + midday + dinner + workouts
      return { week: format(weekStart, 'MMM d'), yoga, sun, midday, dinner, workouts, score: Math.round((totalDone / totalPossible) * 100) }
    }).filter(Boolean)
  }, [logs])

  const last30 = logs.slice(-30)
  const n = last30.length || 1
  const yogaDays = last30.filter(l => l.yoga).length
  const sunDays = last30.filter(l => l.sunlight).length
  const middayDays = last30.filter(l => l.midday_walk).length
  const dinnerDays = last30.filter(l => l.dinner_walk).length
  const workoutSessions = last30.filter(l => l.workout_done).length

  if (loading) return (
    <div className="bg-trends" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid ${W(0.2)}`, borderTopColor: W(0.7), borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className="bg-trends page-enter" style={{ minHeight: '100vh', padding: '28px 20px 20px' }}>
      <div style={{ fontSize: '9px', color: W(0.38), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '3px' }}>Last 8 weeks</div>
      <div className="font-serif-italic" style={{ fontSize: '28px', color: W(0.92), lineHeight: 1.1, marginBottom: '3px' }}>Trends.</div>
      <div style={{ fontSize: '10px', color: W(0.35), marginBottom: '22px' }}>Your progress over time</div>

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: W(0.4), fontSize: '13px' }}>
          Start logging daily habits — your trends will appear here.
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            <StatBox value={`${Math.round(yogaDays/n*100)}%`} label="Yoga consistency" />
            <StatBox value={workoutSessions} label="Workouts logged" />
            <StatBox value={`${Math.round(middayDays/n*100)}%`} label="Midday walks" />
            <StatBox value={`${Math.round(dinnerDays/n*100)}%`} label="Dinner walks" />
          </div>

          {weeklyData.length > 0 && (
            <>
              <div style={{ fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.3), marginBottom: '10px' }}>Weekly habit score</div>
              <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px 16px', marginBottom: '14px' }}>
                {weeklyData.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < weeklyData.length - 1 ? '8px' : 0 }}>
                    <div style={{ fontSize: '9px', color: W(0.3), width: '30px', flexShrink: 0 }}>{w.week}</div>
                    <div style={{ flex: 1, height: '5px', background: W(0.1), borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${w.score}%`, background: W(0.75), borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '9px', color: W(0.3), width: '28px', textAlign: 'right', flexShrink: 0 }}>{w.score}%</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.3), marginBottom: '10px' }}>Workouts per week</div>
              <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px 16px' }}>
                {weeklyData.map((w, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < weeklyData.length - 1 ? '8px' : 0 }}>
                    <div style={{ fontSize: '9px', color: W(0.3), width: '30px', flexShrink: 0 }}>{w.week}</div>
                    <div style={{ flex: 1, height: '5px', background: W(0.1), borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(w.workouts / 3) * 100}%`, background: W(0.75), borderRadius: '3px' }} />
                    </div>
                    <div style={{ fontSize: '9px', color: W(0.3), width: '28px', textAlign: 'right', flexShrink: 0 }}>{w.workouts}/3</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
