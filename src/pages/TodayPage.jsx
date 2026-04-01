import { useState } from 'react'
import { format, isMonday, isWednesday, isFriday, addDays, subDays, isToday, isFuture } from 'date-fns'
import { Sun, Wind, Footprints, Moon, ChevronRight, Check, ChevronLeft } from 'lucide-react'
import { useDay } from '../lib/useData'
import { useNavigate } from 'react-router-dom'

const W = (o) => `rgba(255,255,255,${o})`

function DateNav({ date, onPrev, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
      <button onClick={onPrev} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={18} color={W(0.45)} strokeWidth={1.5} />
      </button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '9px', color: W(0.4), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
          {isToday(date) ? 'Today' : isFuture(date) ? 'Upcoming' : 'Past'}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: W(0.88) }}>{format(date, 'EEEE, MMMM d')}</div>
      </div>
      <button onClick={onNext} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronRight size={18} color={W(0.45)} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function HabitPill({ label, sublabel, checked, onToggle, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 0', background: 'transparent', border: 'none',
        borderBottom: `1px solid ${W(0.08)}`, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, textAlign: 'left'
      }}
    >
      <div style={{ width: '2px', height: '32px', borderRadius: '1px', flexShrink: 0, background: checked ? W(0.88) : W(0.16), transition: 'background 0.2s' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.92) }}>{label}</div>
        <div style={{ fontSize: '10px', color: W(0.38), marginTop: '1px' }}>{sublabel}</div>
      </div>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, transition: 'all 0.2s',
        border: `1.5px solid ${checked ? 'transparent' : W(0.22)}`,
        background: checked ? W(0.9) : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <Check size={10} color="#2a1a10" strokeWidth={3} />}
      </div>
    </button>
  )
}

export default function TodayPage() {
  const [date, setDate] = useState(new Date())
  const { log, loading, toggle } = useDay(date)
  const navigate = useNavigate()

  const isWorkoutDay = isMonday(date) || isWednesday(date) || isFriday(date)
  const isFutureDay = isFuture(date) && !isToday(date)
  const workoutType = isMonday(date) ? 'Lower body' : isWednesday(date) ? 'Upper body' : isFriday(date) ? 'Full body + power' : null
  const bgClass = isWorkoutDay ? 'bg-workout' : 'bg-rest'

  const habits = [
    { key: 'yoga', label: '15–20 min yoga & breathing', sublabel: 'Open App · before work, before phone' },
    { key: 'sunlight', label: 'Morning sunlight', sublabel: '5–10 min outside · no sunglasses' },
    { key: 'midday_walk', label: 'Midday walk', sublabel: '15–20 min · around lunch' },
    { key: 'dinner_walk', label: 'After-dinner walk', sublabel: 'Your cortisol + blood sugar ritual' },
  ]

  const checked = habits.filter(h => log?.[h.key]).length
  const workoutDone = log?.workout_done
  const total = isWorkoutDay ? habits.length + 1 : habits.length
  const score = checked + (isWorkoutDay && workoutDone ? 1 : 0)

  if (loading) return (
    <div className={bgClass} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid ${W(0.18)}`, borderTopColor: W(0.7), borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div className={`${bgClass} page-enter`}>
      {/* Hero header */}
      <div style={{ padding: '52px 22px 24px' }}>
        <div style={{ fontSize: '9px', color: W(0.42), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {format(date, 'EEEE · MMMM d')}
        </div>
        <div className="font-serif-italic" style={{ fontSize: '38px', color: W(0.95), lineHeight: 1.05, marginBottom: '6px' }}>
          Good morning.
        </div>
        <div style={{ fontSize: '11px', color: W(0.42) }}>
          {isWorkoutDay ? `${workoutType} day` : 'Habits are your focus today'}
        </div>

        {/* Day type pill */}
        <div style={{ display: 'inline-block', marginTop: '12px', background: W(0.1), border: `1px solid ${W(0.18)}`, borderRadius: '20px', padding: '5px 12px', fontSize: '9px', color: W(0.72), letterSpacing: '.06em' }}>
          {isWorkoutDay ? workoutType : 'Rest day'}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <DateNav date={date} onPrev={() => setDate(d => subDays(d, 1))} onNext={() => setDate(d => addDays(d, 1))} />

        {/* Score */}
        {!isFutureDay && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px solid ${W(0.1)}` }}>
            <div style={{ fontSize: '48px', fontWeight: 300, color: W(0.95), lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '18px', color: W(0.22) }}>/ {total}</div>
            <div style={{ fontSize: '11px', color: W(0.42), alignSelf: 'center', marginLeft: '3px' }}>habits done</div>
          </div>
        )}

        {isFutureDay && (
          <div style={{ marginBottom: '18px', padding: '12px 14px', background: W(0.07), borderRadius: '12px', fontSize: '12px', color: W(0.48), textAlign: 'center' }}>
            {isWorkoutDay ? `${workoutType} day — preview only` : 'Rest day — walks + morning routine'}
          </div>
        )}

        {/* Habits */}
        <div style={{ fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.32), marginBottom: '6px' }}>Daily habits</div>
        {habits.map(h => (
          <HabitPill key={h.key} label={h.label} sublabel={h.sublabel} checked={!!log?.[h.key]} onToggle={() => toggle(h.key)} disabled={isFutureDay} />
        ))}

        {/* Workout link */}
        {isWorkoutDay && (
          <button
            onClick={() => navigate('/workout', { state: { date: format(date, 'yyyy-MM-dd') } })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', marginTop: '14px',
              border: `1px solid ${workoutDone ? W(0.28) : W(0.12)}`,
              borderRadius: '14px', background: workoutDone ? W(0.1) : W(0.06),
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
            }}
          >
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: workoutDone ? W(0.88) : W(0.1), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {workoutDone
                ? <Check size={14} color="#2a1a10" strokeWidth={3} />
                : <span style={{ fontSize: '16px', color: W(0.5) }}>+</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500, color: W(0.92) }}>{workoutType}</div>
              <div style={{ fontSize: '10px', color: W(0.38), marginTop: '1px' }}>
                {isFutureDay ? 'Tap to preview' : workoutDone ? 'Session logged ✓' : 'Tap to log workout'}
              </div>
            </div>
            <ChevronRight size={15} color={W(0.28)} strokeWidth={1.5} />
          </button>
        )}

        {/* Magnesium reminder */}
        {isToday(date) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px', marginTop: '12px', background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '11px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: W(0.45), flexShrink: 0 }} />
            <div style={{ fontSize: '11px', color: W(0.45) }}>9:15pm · Magnesium · 3 tabs</div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
