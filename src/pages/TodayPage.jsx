import { useState } from 'react'
import { format, isMonday, isWednesday, isFriday, addDays, subDays, isToday, isFuture } from 'date-fns'
import { Sun, Wind, Footprints, Moon, ChevronRight, Check, ChevronLeft } from 'lucide-react'
import { useDay } from '../lib/useData'
import { useNavigate } from 'react-router-dom'

const W = (opacity) => `rgba(255,255,255,${opacity})`

function DateNav({ date, onPrev, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button onClick={onPrev} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
      </button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '9px', color: W(0.4), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
          {isToday(date) ? 'Today' : isFuture(date) ? 'Upcoming' : 'Past'}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: W(0.88) }}>{format(date, 'EEEE, MMMM d')}</div>
      </div>
      <button onClick={onNext} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronRight size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function HabitPill({ icon: Icon, label, sublabel, checked, onToggle, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 0', background: 'transparent', border: 'none',
        borderBottom: `1px solid ${W(0.07)}`, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1, textAlign: 'left'
      }}
    >
      <div style={{ width: '2px', height: '32px', borderRadius: '1px', background: checked ? W(0.85) : W(0.15), flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.9) }}>{label}</div>
        <div style={{ fontSize: '10px', color: W(0.35), marginTop: '1px' }}>{sublabel}</div>
      </div>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
        border: `1.5px solid ${checked ? 'transparent' : W(0.2)}`,
        background: checked ? W(0.88) : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {checked && <Check size={10} style={{ stroke: '#5a4030' }} strokeWidth={3} />}
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

  const habits = [
    { key: 'yoga', icon: Wind, label: '15–20 min yoga & breathing', sublabel: 'Open App · before work, before phone' },
    { key: 'sunlight', icon: Sun, label: 'Morning sunlight', sublabel: '5–10 min outside · no sunglasses' },
    { key: 'midday_walk', icon: Footprints, label: 'Midday walk', sublabel: '15–20 min · around lunch' },
    { key: 'dinner_walk', icon: Moon, label: 'After-dinner walk', sublabel: 'Your cortisol + blood sugar ritual' },
  ]

  const checked = habits.filter(h => log?.[h.key]).length
  const workoutDone = log?.workout_done
  const total = isWorkoutDay ? habits.length + 1 : habits.length
  const score = checked + (isWorkoutDay && workoutDone ? 1 : 0)

  const bgClass = isWorkoutDay ? 'bg-workout' : 'bg-rest'

  if (loading) return (
    <div className={bgClass} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid ${W(0.2)}`, borderTopColor: W(0.7), borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div className={`${bgClass} page-enter`}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&fit=crop&crop=center"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', opacity: 0.15, mixBlendMode: 'overlay', filter: 'saturate(0.2)' }}
          onError={e => e.target.style.display = 'none'}
        />
        <div style={{ position: 'absolute', top: '12px', right: '14px', background: W(0.12), border: `1px solid ${W(0.2)}`, borderRadius: '20px', padding: '4px 10px', fontSize: '8px', color: W(0.75), letterSpacing: '.06em' }}>
          {isWorkoutDay ? workoutType : 'Rest day'}
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 20px' }}>
          <div style={{ fontSize: '8px', color: W(0.4), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            {format(date, 'EEEE · MMMM d')}
          </div>
          <div className="font-serif-italic" style={{ fontSize: '30px', color: W(0.92), lineHeight: 1.1, marginBottom: '4px' }}>
            Good morning.
          </div>
          <div style={{ fontSize: '10px', color: W(0.4) }}>
            {isWorkoutDay ? `${workoutType} day` : 'Habits are your focus today'}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <DateNav date={date} onPrev={() => setDate(d => subDays(d, 1))} onNext={() => setDate(d => addDays(d, 1))} />

        {/* Score */}
        {!isFutureDay && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', margin: '18px 0 16px', paddingBottom: '16px', borderBottom: `1px solid ${W(0.1)}` }}>
            <div style={{ fontSize: '42px', fontWeight: 300, color: W(0.92), lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '16px', color: W(0.25) }}>/ {total}</div>
            <div style={{ fontSize: '10px', color: W(0.38), alignSelf: 'center', marginLeft: '3px' }}>done today</div>
          </div>
        )}

        {isFutureDay && (
          <div style={{ margin: '16px 0', padding: '12px 14px', background: W(0.07), borderRadius: '12px', fontSize: '12px', color: W(0.5), textAlign: 'center' }}>
            {isWorkoutDay ? `${workoutType} day — preview only` : 'Rest day — walks + morning routine'}
          </div>
        )}

        {/* Habits */}
        <div style={{ fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.3), marginBottom: '4px' }}>Daily habits</div>
        {habits.map(h => (
          <HabitPill
            key={h.key}
            icon={h.icon}
            label={h.label}
            sublabel={h.sublabel}
            checked={!!log?.[h.key]}
            onToggle={() => toggle(h.key)}
            disabled={isFutureDay}
          />
        ))}

        {/* Workout link */}
        {isWorkoutDay && (
          <button
            onClick={() => navigate('/workout', { state: { date: format(date, 'yyyy-MM-dd') } })}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 13px', marginTop: '12px', border: `1px solid ${workoutDone ? W(0.3) : W(0.12)}`,
              borderRadius: '14px', background: workoutDone ? W(0.12) : W(0.06),
              cursor: 'pointer', textAlign: 'left'
            }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: workoutDone ? W(0.85) : W(0.12), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {workoutDone
                ? <Check size={13} style={{ stroke: '#5a4030' }} strokeWidth={3} />
                : <span style={{ fontSize: '13px' }}>+</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.9) }}>{workoutType}</div>
              <div style={{ fontSize: '10px', color: W(0.35), marginTop: '1px' }}>
                {isFutureDay ? 'Tap to preview' : workoutDone ? 'Session logged ✓' : 'Tap to log workout'}
              </div>
            </div>
            <ChevronRight size={14} style={{ stroke: W(0.25) }} strokeWidth={1.5} />
          </button>
        )}

        {/* Magnesium */}
        {isToday(date) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', marginTop: '10px', marginBottom: '8px', background: W(0.06), border: `1px solid ${W(0.08)}`, borderRadius: '10px' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: W(0.4), flexShrink: 0 }} />
            <div style={{ fontSize: '10px', color: W(0.42) }}>9:15pm · Magnesium · 3 tabs</div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
