import { useState } from 'react'
import { format, isMonday, isWednesday, isFriday } from 'date-fns'
import { Sun, Wind, Footprints, Moon, ChevronRight, Check } from 'lucide-react'
import { useDay } from '../lib/useData'
import { useNavigate } from 'react-router-dom'

const today = new Date()

function CheckPill({ icon: Icon, label, sublabel, checked, onToggle, color = 'sage' }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left
        ${checked
          ? 'bg-sage-50 border-sage-400 shadow-sm'
          : 'bg-white border-stone-100 hover:border-stone-200'
        }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
        ${checked ? 'bg-sage-400 text-white' : 'bg-stone-100 text-stone-400'}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${checked ? 'text-sage-800' : 'text-stone-700'}`}>{label}</div>
        {sublabel && <div className="text-xs text-stone-400 mt-0.5">{sublabel}</div>}
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${checked ? 'bg-sage-400 border-sage-400' : 'border-stone-200'}`}>
        {checked && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  )
}

function ScoreRing({ score, total }) {
  const pct = total === 0 ? 0 : Math.round((score / total) * 100)
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e7e5e4" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={pct >= 75 ? '#5fa45f' : pct >= 50 ? '#e07040' : '#a8a29e'}
          strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="text-center">
        <div className="text-xl font-display font-bold text-stone-800">{pct}%</div>
      </div>
    </div>
  )
}

export default function TodayPage() {
  const { log, loading, toggle } = useDay(today)
  const navigate = useNavigate()
  const isWorkoutDay = isMonday(today) || isWednesday(today) || isFriday(today)

  const dayName = format(today, 'EEEE')
  const dateStr = format(today, 'MMMM d')

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

  const workoutType = isMonday(today) ? 'Lower body' : isWednesday(today) ? 'Upper body' : 'Full body + power'

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="pt-2">
        <p className="text-sm text-stone-400 font-body">{dateStr}</p>
        <h1 className="text-3xl font-display text-stone-800 mt-0.5">{dayName}</h1>
      </div>

      {/* Daily score */}
      <div className="card p-5 flex items-center gap-5">
        <ScoreRing score={score} total={total} />
        <div>
          <div className="text-sm text-stone-400 mb-0.5">Today's score</div>
          <div className="text-2xl font-display text-stone-800">{score} <span className="text-stone-300 text-lg">/ {total}</span></div>
          <div className="text-xs text-stone-400 mt-1">
            {score === total ? '✦ Perfect day' : score >= total * 0.75 ? 'Almost there' : score >= total * 0.5 ? 'Good progress' : 'Keep going'}
          </div>
        </div>
      </div>

      {/* Habits */}
      <div>
        <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Daily habits</h2>
        <div className="space-y-2.5">
          {habits.map(h => (
            <CheckPill
              key={h.key}
              icon={h.icon}
              label={h.label}
              sublabel={h.sublabel}
              checked={!!log?.[h.key]}
              onToggle={() => toggle(h.key)}
            />
          ))}
        </div>
      </div>

      {/* Workout */}
      {isWorkoutDay && (
        <div>
          <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">Workout</h2>
          <button
            onClick={() => navigate('/workout')}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-3 transition-all
              ${workoutDone ? 'bg-sage-50 border-sage-400' : 'bg-white border-stone-100 hover:border-stone-200'}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
              ${workoutDone ? 'bg-sage-400 text-white' : 'bg-stone-100 text-stone-400'}`}>
              {workoutDone ? <Check size={18} /> : <span className="text-lg">🏋️</span>}
            </div>
            <div className="flex-1 text-left">
              <div className={`text-sm font-medium ${workoutDone ? 'text-sage-800' : 'text-stone-700'}`}>
                {workoutType}
              </div>
              <div className="text-xs text-stone-400 mt-0.5">
                {workoutDone ? 'Session logged ✓' : 'Tap to log workout'}
              </div>
            </div>
            <ChevronRight size={16} className="text-stone-300" />
          </button>
        </div>
      )}

      {!isWorkoutDay && (
        <div className="card p-4 text-center">
          <div className="text-stone-400 text-sm">Rest day — walks + morning routine are your job today</div>
        </div>
      )}

      {/* Magnesium reminder */}
      <div className="bg-terracotta-50 border border-terracotta-100 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-lg">💊</span>
        <div>
          <div className="text-sm font-medium text-terracotta-700">9:15pm · Magnesium reminder</div>
          <div className="text-xs text-terracotta-500 mt-0.5">3 tabs of Metagenics Mag Glycinate · 45–60 min before sleep</div>
        </div>
      </div>
    </div>
  )
}
