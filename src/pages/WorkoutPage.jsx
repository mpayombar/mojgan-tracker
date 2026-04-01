import { useState, useEffect, useCallback } from 'react'
import { format, isMonday, isWednesday, isFriday, parseISO, isFuture, isToday, addDays, subDays } from 'date-fns'
import { Check, ChevronLeft, ChevronRight, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useDay } from '../lib/useData'
import { WORKOUT_DAYS } from '../lib/workouts'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ExerciseRow({ exercise, value, onChange, disabled, onRemove, isCustom }) {
  return (
    <div className="py-3.5 border-b border-stone-50 last:border-0">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-stone-800">{exercise.name}</div>
            {isCustom && (
              <span className="text-xs px-1.5 py-0.5 bg-terracotta-50 text-terracotta-500 rounded-md font-medium">custom</span>
            )}
          </div>
          {exercise.note && <div className="text-xs text-stone-400 mt-0.5">{exercise.note}</div>}
        </div>
        <div className="flex items-start gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="text-xs font-medium text-stone-600">{exercise.sets}</div>
            <div className="text-xs text-stone-400">{exercise.startLoad}</div>
          </div>
          {isCustom && onRemove && (
            <button onClick={onRemove} className="p-1 hover:bg-stone-100 rounded-lg transition-colors mt-0.5">
              <X size={13} className="text-stone-300 hover:text-stone-500" />
            </button>
          )}
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

function AddExercisePanel({ onAdd, onClose, savedExercises }) {
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [load, setLoad] = useState('')
  const [note, setNote] = useState('')
  const [showSaved, setShowSaved] = useState(savedExercises.length > 0)

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), sets: sets.trim() || '3 × 10', startLoad: load.trim() || '—', note: note.trim() })
    onClose()
  }

  const handleQuickAdd = (ex) => {
    onAdd({ name: ex.name, sets: ex.default_sets || '3 × 10', startLoad: ex.default_load || '—', note: '' })
    onClose()
  }

  return (
    <div className="card p-5 border-2 border-terracotta-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-700">Add exercise</h3>
        <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-lg transition-colors">
          <X size={16} className="text-stone-400" />
        </button>
      </div>

      {savedExercises.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowSaved(s => !s)}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-500 mb-2 hover:text-stone-700"
          >
            {showSaved ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            Your saved exercises ({savedExercises.length})
          </button>
          {showSaved && (
            <div className="space-y-1.5 mb-3">
              {savedExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleQuickAdd(ex)}
                  className="w-full flex items-center justify-between p-3 bg-stone-50 hover:bg-terracotta-50 rounded-xl transition-colors text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-stone-700">{ex.name}</div>
                    <div className="text-xs text-stone-400">{ex.default_sets} · {ex.default_load}</div>
                  </div>
                  <Plus size={14} className="text-stone-300" />
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-stone-100 pt-3 mb-1">
            <div className="text-xs text-stone-400 mb-3">Or create a new one:</div>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <div>
          <label className="text-xs text-stone-400 font-medium block mb-1">Exercise name *</label>
          <input
            className="input-field"
            placeholder="e.g. Single-leg RDL"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-stone-400 font-medium block mb-1">Sets × reps</label>
            <input
              className="input-field"
              placeholder="e.g. 3 × 10"
              value={sets}
              onChange={e => setSets(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-stone-400 font-medium block mb-1">Load / weight</label>
            <input
              className="input-field"
              placeholder="e.g. 20 lb DB"
              value={load}
              onChange={e => setLoad(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-stone-400 font-medium block mb-1">Note (optional)</label>
          <input
            className="input-field"
            placeholder="e.g. substituted due to knee"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="btn-success flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add exercise
        </button>
      </div>
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
          {isToday(date) ? 'Today' : isFuture(date) && !isToday(date) ? 'Upcoming' : 'Past'}
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
  const [customExercises, setCustomExercises] = useState([])
  const [savedExercises, setSavedExercises] = useState([])
  const [showAddPanel, setShowAddPanel] = useState(false)

  const dayKey = isMonday(date) ? 'Mon' : isWednesday(date) ? 'Wed' : isFriday(date) ? 'Fri' : null
  const workout = dayKey ? WORKOUT_DAYS[dayKey] : null

  // Load saved custom exercises from Supabase
  const loadSavedExercises = useCallback(async () => {
    const { data } = await supabase
      .from('custom_exercises')
      .select('*')
      .order('use_count', { ascending: false })
    if (data) setSavedExercises(data)
  }, [])

  useEffect(() => { loadSavedExercises() }, [loadSavedExercises])

  useEffect(() => {
    setLogs(log?.exercise_logs || {})
    setNotes(log?.notes || '')
    setCustomExercises(log?.custom_exercises || [])
    setSaved(false)
  }, [log, date])

  const handleAddExercise = async (ex) => {
    const newCustom = [...customExercises, { ...ex, id: `custom_${Date.now()}` }]
    setCustomExercises(newCustom)

    // Save or update in custom_exercises table
    const existing = savedExercises.find(s => s.name.toLowerCase() === ex.name.toLowerCase())
    if (existing) {
      await supabase.from('custom_exercises').update({
        default_sets: ex.sets,
        default_load: ex.startLoad,
        use_count: (existing.use_count || 1) + 1,
        updated_at: new Date().toISOString()
      }).eq('id', existing.id)
    } else {
      await supabase.from('custom_exercises').insert({
        name: ex.name,
        default_sets: ex.sets,
        default_load: ex.startLoad,
      })
    }
    await loadSavedExercises()
  }

  const handleRemoveCustom = (id) => {
    setCustomExercises(prev => prev.filter(e => e.id !== id))
  }

  const handleSave = async () => {
    await save({
      ...(log || {}),
      exercise_logs: logs,
      notes,
      custom_exercises: customExercises,
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
      custom_exercises: customExercises,
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
        <>
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 text-center">
            <div className="text-stone-600 font-medium mb-1">Rest day</div>
            <div className="text-sm text-stone-400">
              {isFutureDay ? 'Walks + morning routine planned.' : 'Walked? Did something extra? Log it below.'}
            </div>
          </div>

          {!isFutureDay && (
            <div className="card p-5">
              <h2 className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-1">Bonus activity</h2>
              <p className="text-xs text-stone-400 mb-4">Log anything extra you did today</p>
              {customExercises.map((ex, i) => (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  value={logs[`custom_${i}`]}
                  onChange={val => setLogs(prev => ({ ...prev, [`custom_${i}`]: val }))}
                  isCustom={true}
                  onRemove={() => handleRemoveCustom(ex.id)}
                />
              ))}
              {!showAddPanel && (
                <button
                  onClick={() => setShowAddPanel(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-400 hover:border-terracotta-200 hover:text-terracotta-400 transition-colors"
                >
                  <Plus size={15} />
                  Log an exercise
                </button>
              )}
            </div>
          )}

          {!isFutureDay && showAddPanel && (
            <AddExercisePanel
              onAdd={handleAddExercise}
              onClose={() => setShowAddPanel(false)}
              savedExercises={savedExercises}
            />
          )}

          {!isFutureDay && customExercises.length > 0 && (
            <>
              <div className="card p-5">
                <label className="text-xs font-medium text-stone-400 uppercase tracking-widest block mb-3">Notes</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  placeholder="How did it feel? Anything to note..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} className="btn-secondary flex-1">
                  {saved ? 'Saved ✓' : 'Save'}
                </button>
                <button onClick={handleComplete} className="btn-success flex-1">
                  {log?.workout_done ? 'Update ✓' : 'Mark complete'}
                </button>
              </div>
            </>
          )}
        </>
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

            {/* Plan exercises */}
            {workout.exercises.map((ex, i) => (
              <ExerciseRow
                key={i}
                exercise={ex}
                value={logs[i]}
                onChange={val => setLogs(prev => ({ ...prev, [i]: val }))}
                disabled={isFutureDay}
              />
            ))}

            {/* Custom exercises */}
            {customExercises.map((ex, i) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                value={logs[`custom_${i}`]}
                onChange={val => setLogs(prev => ({ ...prev, [`custom_${i}`]: val }))}
                disabled={isFutureDay}
                isCustom={true}
                onRemove={() => handleRemoveCustom(ex.id)}
              />
            ))}

            {/* Add exercise button */}
            {!isFutureDay && !showAddPanel && (
              <button
                onClick={() => setShowAddPanel(true)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm text-stone-400 hover:border-terracotta-200 hover:text-terracotta-400 transition-colors"
              >
                <Plus size={15} />
                Add exercise
              </button>
            )}
          </div>

          {/* Add exercise panel */}
          {!isFutureDay && showAddPanel && (
            <AddExercisePanel
              onAdd={handleAddExercise}
              onClose={() => setShowAddPanel(false)}
              savedExercises={savedExercises}
            />
          )}

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
