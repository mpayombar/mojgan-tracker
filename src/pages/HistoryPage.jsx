import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, subMonths, addMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Wind, Sun, Footprints, Dumbbell } from 'lucide-react'
import { useRange } from '../lib/useData'

const W = (o) => `rgba(255,255,255,${o})`

export default function HistoryPage() {
  const [month, setMonth] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const { logs } = useRange(start, end)

  const days = eachDayOfInterval({ start, end })
  const logMap = {}
  logs.forEach(l => { logMap[l.date] = l })

  const firstDayOffset = (start.getDay() + 6) % 7
  const selectedLog = selected ? logMap[format(selected, 'yyyy-MM-dd')] : null

  const getDayType = (log) => {
    if (!log) return 'empty'
    const habits = [log.yoga, log.sunlight, log.midday_walk, log.dinner_walk].filter(Boolean).length
    const hasWorkout = log.workout_done
    if (habits === 4 || (habits >= 3 && hasWorkout)) return 'full'
    if (habits >= 2 || hasWorkout) return 'partial'
    if (habits >= 1) return 'some'
    return 'empty'
  }

  return (
    <div className="bg-history page-enter" style={{ minHeight: '100vh', padding: '28px 20px 20px' }}>
      <div style={{ fontSize: '9px', color: W(0.38), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '3px' }}>
        {format(month, 'MMMM yyyy')}
      </div>
      <div className="font-serif-italic" style={{ fontSize: '28px', color: W(0.92), lineHeight: 1.1, marginBottom: '3px' }}>History.</div>
      <div style={{ fontSize: '10px', color: W(0.35), marginBottom: '20px' }}>Tap any day for details</div>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button onClick={() => setMonth(subMonths(month, 1))} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ChevronLeft size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
        </button>
        <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.75) }}>{format(month, 'MMMM yyyy')}</div>
        <button onClick={() => setMonth(addMonths(month, 1))} style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ChevronRight size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
        </button>
      </div>

      {/* Calendar */}
      <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px', marginBottom: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: '9px', color: W(0.25), padding: '2px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e${i}`} />)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const log = logMap[dateStr]
            const type = getDayType(log)
            const isSelected = selected && format(selected, 'yyyy-MM-dd') === dateStr
            const isTdy = isToday(day)
            const num = format(day, 'd')

            let bg = 'transparent'
            let color = W(0.28)
            let border = 'none'

            if (isSelected) { bg = W(0.9); color = '#4a3020'; }
            else if (type === 'full') { bg = W(0.82); color = '#4a3020'; }
            else if (type === 'partial') { bg = W(0.18); color = W(0.75); }
            else if (type === 'some') { bg = W(0.08); color = W(0.45); }
            if (isTdy && !isSelected) { border = `1.5px solid ${W(0.5)}`; color = W(0.85); bg = 'transparent'; }

            return (
              <button
                key={dateStr}
                onClick={() => setSelected(isSelected ? null : day)}
                style={{ aspectRatio: '1', borderRadius: '7px', background: bg, border, color, fontSize: '9px', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {num}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
        {[
          { bg: W(0.82), label: 'Full day' },
          { bg: W(0.18), label: 'Partial' },
          { bg: W(0.08), label: 'Some' },
        ].map(({ bg, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: bg }} />
            <div style={{ fontSize: '9px', color: W(0.32) }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selected && (
        <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px 16px' }}>
          <div style={{ fontSize: '9px', color: W(0.35), letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            {format(selected, 'EEEE, MMMM d')}
          </div>
          {!selectedLog ? (
            <div style={{ fontSize: '12px', color: W(0.35), textAlign: 'center', padding: '12px 0' }}>Nothing logged this day</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                {[
                  { key: 'yoga', icon: Wind, label: 'Yoga & breathing' },
                  { key: 'sunlight', icon: Sun, label: 'Morning sunlight' },
                  { key: 'midday_walk', icon: Footprints, label: 'Midday walk' },
                  { key: 'dinner_walk', icon: Footprints, label: 'Dinner walk' },
                ].map(h => (
                  <div key={h.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: selectedLog[h.key] ? W(0.15) : W(0.05), borderRadius: '10px', opacity: selectedLog[h.key] ? 1 : 0.5 }}>
                    <h.icon size={13} style={{ stroke: W(0.7), flexShrink: 0 }} strokeWidth={1.5} />
                    <div style={{ fontSize: '10px', color: W(0.75) }}>{h.label}</div>
                  </div>
                ))}
              </div>
              {selectedLog.workout_done && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', background: W(0.1), borderRadius: '10px', marginBottom: '8px' }}>
                  <Dumbbell size={13} style={{ stroke: W(0.7) }} strokeWidth={1.5} />
                  <div style={{ fontSize: '11px', fontWeight: 500, color: W(0.85) }}>{selectedLog.workout_type || 'Workout'} — complete</div>
                </div>
              )}
              {selectedLog.notes && (
                <div style={{ padding: '9px 10px', background: W(0.05), borderRadius: '10px' }}>
                  <div style={{ fontSize: '9px', color: W(0.32), marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Notes</div>
                  <div style={{ fontSize: '12px', color: W(0.7) }}>{selectedLog.notes}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
