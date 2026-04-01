import { useState, useEffect } from 'react'
import { format, isMonday, isWednesday, isFriday, parseISO, isFuture, isToday, addDays, subDays } from 'date-fns'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDay } from '../lib/useData'
import { WORKOUT_DAYS } from '../lib/workouts'
import { useLocation } from 'react-router-dom'

function ExerciseRow({ exercise, value, onChange, disabled }) {
  return (
    <div className="py-3.5 border-b border-stone-50 last:border-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="text-sm font-medium text-stone-800">{exercise.name}</div>
          <div className="text-xs text-stone-400 mt-0.5">{exercise.note}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs font-medium text-stone-600">{exercise.sets}</div>
          <div className="text-xs text-stone-400">{exercise.startLoad}</div>
        </div>
      </div>
      {!disabled && (
        <input
          className="input-field text-xs"
          placeholder="What you did — e.g. 45, 50, 50 lbs"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

function DateNav({ date, onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onPrev} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
        <ChevronLeft size={18} className="text-stone-400" />
      </button>
      <div className="text-center">
        <div className="text-xs text-stone-400 font-medium uppercase tracking-wide">
          {isToday(date) ? 'Today' : isFuture(date) ? 'Upcoming' : 'Past'}
        </div>
        <div className="text-sm font-medium text-stone-700">{format(date, 'EEEE, MMMM d')}</div>
      </div>
      <button onClick={onNext} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
        <ChevronRight size={18} className="text-stone-400" />
      </button>
    </div>
  )
}

export default function WorkoutPage() {
  const location = useLocation()
  const initialDate = location.state?.date ? parseISO(location.state.date) : new Date()
  const [date, setDate] = useState(initialDate)
  const isFutureDay = isFuture(date) && !isToday(date)

  const { log, loading, save } = useDay(date)
  const [logs, setLogs] = useState({})
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const dayKey = isMonday(date) ? 'Mon' : isWednesday(date) ? 'Wed' : isFriday(date) ? 'Fri' : null
  const workout = dayKey ? WORKOUT_DAYS[dayKey] : null

  useEffect(() => {
    setLogs(log?.exercise_logs || {})
    setNotes(log?.notes || '')
    setSaved(false)
  }, [log, date])

  const handleSave = async () => {
    await save({
      ...(log || {}),
      exercise_logs: logs,
      notes,
      workout_type: workout?.type || null,
      workout_done: log?.workout_done || false,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleComplete = async () => {
    await save({
      ...(log || {}),
      exercise_logs: logs,
      notes,
      workout_type: workout?.type || null,
      workout_done: true,
    })
    setSaved(true)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="page-enter space-y-5">
      <div className="pt-2 space-y-3">
        <DateNav
          date={date}
          onPrev={() => setDate(d => subDays(d, 1))}
          onNext={() => setDate(d => addDays(d, 1))}
        />
      </div>

      {/* Rest day */}
      {!workout && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-3">🌿</div>
          <div className="text-stone-600 font-medium mb-1">Rest day</div>
          <div className="text-sm text-stone-400">Walks + morning routine are your focus. Use the arrows to find a workout day.</div>
        </div>
      )}

      {/* Workout day */}
      {workout && (
        <>
          <div>
            <h1 className="text-3xl font-display text-stone-800">{workout.type}</h1>
            <p className="text-xs text-stone-400 mt-1">{workout.warmup}</p>
          </div>

          {isFutureDay && (
            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-3.5 text-center">
              <div className="text-sm text-stone-500">
                Preview mode — come back on {format(date, 'EEEE')} to log this workout
              </div>
            </div>
          )}

          {!isFutureDay && log?.workout_done && (
            <div className="bg-sage-50 border border-sage-200 rounded-2xl p-3.5 flex items-center gap-2">
              <div className="w-6 h-6 bg-sage-400 rounded-full flex items-center justify-center">
                <Check size={13} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-sage-700">Session complete</span>
            </div>
          )}

          <div className="card p-5">
            <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">Exercises</h2>
            <p className="text-xs text-stone-400 mb-4">
              {isFutureDay ? 'Your exercises for this session' : 'Log what you actually did — weight × reps, or just notes'}
            </p>
            {workout.exercises.map((ex, i) => (
              <ExerciseRow
                key={i}
                exercise={ex}
                value={logs[i]}
                onChange={val => setLogs(prev => ({ ...prev, [i]: val }))}
                disabled={isFutureDay}
              />
            ))}
          </div>

          {!isFutureDay && (
            <>
              <div className="card p-5">
                <label className="text-xs font-medium text-stone-400 uppercase tracking-widest block mb-3">
                  Session notes
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="How did it feel? Any pain? Energy level? Anything to flag..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-secondary flex-1">
                  {saved ? 'Saved ✓' : 'Save draft'}
                </button>
                <button onClick={handleComplete} className="btn-success flex-1">
                  {log?.workout_done ? 'Update ✓' : 'Mark complete'}
                </button>
              </div>
            </>
          )}

          <div className="bg-stone-50 rounded-xl p-4 text-center">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-1">Progression rule</p>
            <p className="text-sm text-stone-600">Add 5 lbs to main lifts every 2 weeks. That's it.</p>
          </div>
        </>
      )}
    </div>
  )
}
