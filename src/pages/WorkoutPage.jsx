import { useState, useEffect, useCallback } from 'react'
import { format, isMonday, isWednesday, isFriday, parseISO, isFuture, isToday, addDays, subDays } from 'date-fns'
import { Check, ChevronLeft, ChevronRight, Plus, X, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react'
import { useDay } from '../lib/useData'
import { WORKOUT_DAYS } from '../lib/workouts'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const W = (o) => `rgba(255,255,255,${o})`

function ExerciseRow({ exercise, value, onChange, disabled, onRemove, isCustom }) {
  return (
    <div style={{ padding: '9px 0', borderBottom: `1px solid ${W(0.07)}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.9) }}>{exercise.name}</div>
            {isCustom && <span style={{ fontSize: '9px', padding: '2px 6px', background: W(0.1), color: W(0.55), borderRadius: '4px' }}>custom</span>}
          </div>
          {exercise.note && <div style={{ fontSize: '9px', color: W(0.32), marginTop: '1px' }}>{exercise.note}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: W(0.5) }}>{exercise.sets}</div>
            <div style={{ fontSize: '9px', color: W(0.28) }}>{exercise.startLoad}</div>
          </div>
          {isCustom && onRemove && (
            <button onClick={onRemove} style={{ padding: '2px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={12} style={{ stroke: W(0.3) }} />
            </button>
          )}
        </div>
      </div>
      {!disabled && (
        <input className="input-field" style={{ fontSize: '11px' }} placeholder="What you did — e.g. 45, 50, 50 lbs" value={value || ''} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  )
}

function AddExercisePanel({ onAdd, onClose, savedExercises, onDeleteSaved, onEditSaved }) {
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [load, setLoad] = useState('')
  const [note, setNote] = useState('')
  const [showSaved, setShowSaved] = useState(savedExercises.length > 0)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editSets, setEditSets] = useState('')
  const [editLoad, setEditLoad] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), sets: sets.trim() || '3 × 10', startLoad: load.trim() || '—', note: note.trim() })
    onClose()
  }

  const handleQuickAdd = (ex) => {
    if (editingId || confirmDeleteId) return
    onAdd({ name: ex.name, sets: ex.default_sets || '3 × 10', startLoad: ex.default_load || '—', note: '' })
    onClose()
  }

  return (
    <div style={{ background: W(0.07), border: `1px solid ${W(0.15)}`, borderRadius: '16px', padding: '16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: W(0.9) }}>Add exercise</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={16} style={{ stroke: W(0.4) }} />
        </button>
      </div>

      {savedExercises.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <button onClick={() => setShowSaved(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: W(0.45), background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>
            {showSaved ? <ChevronUp size={12} style={{ stroke: W(0.45) }} /> : <ChevronDown size={12} style={{ stroke: W(0.45) }} />}
            Your saved exercises ({savedExercises.length})
          </button>
          {showSaved && (
            <div style={{ marginBottom: '10px' }}>
              {savedExercises.map(ex => (
                <div key={ex.id} style={{ marginBottom: '6px' }}>
                  {editingId === ex.id ? (
                    <div style={{ background: W(0.08), borderRadius: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <input className="input-field" style={{ fontSize: '11px' }} value={editName} onChange={e => setEditName(e.target.value)} placeholder="Exercise name" />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <input className="input-field" style={{ fontSize: '11px' }} value={editSets} onChange={e => setEditSets(e.target.value)} placeholder="Sets × reps" />
                        <input className="input-field" style={{ fontSize: '11px' }} value={editLoad} onChange={e => setEditLoad(e.target.value)} placeholder="Load" />
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEditingId(null)} style={{ flex: 1, padding: '6px', borderRadius: '8px', background: W(0.08), color: W(0.5), border: 'none', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                        <button onClick={async () => { await onEditSaved(ex.id, { name: editName, default_sets: editSets, default_load: editLoad }); setEditingId(null) }} style={{ flex: 1, padding: '6px', borderRadius: '8px', background: W(0.85), color: '#4a3020', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>Save</button>
                      </div>
                    </div>
                  ) : confirmDeleteId === ex.id ? (
                    <div style={{ background: 'rgba(180,60,40,0.2)', border: '1px solid rgba(180,60,40,0.3)', borderRadius: '10px', padding: '10px' }}>
                      <div style={{ fontSize: '11px', color: W(0.7), marginBottom: '8px' }}>Delete "{ex.name}"?</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setConfirmDeleteId(null)} style={{ flex: 1, padding: '6px', borderRadius: '8px', background: W(0.08), color: W(0.5), border: 'none', cursor: 'pointer', fontSize: '11px' }}>Cancel</button>
                        <button onClick={async () => { await onDeleteSaved(ex.id); setConfirmDeleteId(null) }} style={{ flex: 1, padding: '6px', borderRadius: '8px', background: 'rgba(180,60,40,0.6)', color: W(0.9), border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500 }}>Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: W(0.06), borderRadius: '10px' }}>
                      <button onClick={() => handleQuickAdd(ex)} style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: W(0.88) }}>{ex.name}</div>
                        <div style={{ fontSize: '10px', color: W(0.35) }}>{ex.default_sets} · {ex.default_load}</div>
                      </button>
                      <button onClick={() => { setEditingId(ex.id); setEditName(ex.name); setEditSets(ex.default_sets||''); setEditLoad(ex.default_load||'') }} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Pencil size={12} style={{ stroke: W(0.35) }} />
                      </button>
                      <button onClick={() => setConfirmDeleteId(ex.id)} style={{ padding: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={12} style={{ stroke: W(0.35) }} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div style={{ borderTop: `1px solid ${W(0.08)}`, paddingTop: '10px', fontSize: '10px', color: W(0.32), marginBottom: '10px' }}>Or create a new one:</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '9px', color: W(0.35), letterSpacing: '.06em', marginBottom: '4px' }}>Exercise name *</div>
          <input className="input-field" placeholder="e.g. Single-leg RDL" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '9px', color: W(0.35), letterSpacing: '.06em', marginBottom: '4px' }}>Sets × reps</div>
            <input className="input-field" placeholder="e.g. 3 × 10" value={sets} onChange={e => setSets(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: '9px', color: W(0.35), letterSpacing: '.06em', marginBottom: '4px' }}>Load</div>
            <input className="input-field" placeholder="e.g. 20 lb DB" value={load} onChange={e => setLoad(e.target.value)} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9px', color: W(0.35), letterSpacing: '.06em', marginBottom: '4px' }}>Note (optional)</div>
          <input className="input-field" placeholder="e.g. substituted due to knee" value={note} onChange={e => setNote(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
        <button onClick={handleAdd} disabled={!name.trim()} className="btn-success" style={{ flex: 1, opacity: name.trim() ? 1 : 0.4 }}>Add exercise</button>
      </div>
    </div>
  )
}

function DateNav({ date, onPrev, onNext }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
      <button onClick={onPrev} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronLeft size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
      </button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '9px', color: W(0.4), letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '2px' }}>
          {isToday(date) ? 'Today' : isFuture(date) && !isToday(date) ? 'Upcoming' : 'Past'}
        </div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: W(0.88) }}>{format(date, 'EEEE, MMMM d')}</div>
      </div>
      <button onClick={onNext} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
        <ChevronRight size={18} style={{ stroke: W(0.45) }} strokeWidth={1.5} />
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

  const loadSavedExercises = useCallback(async () => {
    const { data } = await supabase.from('custom_exercises').select('*').order('use_count', { ascending: false })
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
    const existing = savedExercises.find(s => s.name.toLowerCase() === ex.name.toLowerCase())
    if (existing) {
      await supabase.from('custom_exercises').update({ default_sets: ex.sets, default_load: ex.startLoad, use_count: (existing.use_count || 1) + 1, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('custom_exercises').insert({ name: ex.name, default_sets: ex.sets, default_load: ex.startLoad })
    }
    await loadSavedExercises()
  }

  const handleDeleteSaved = async (id) => {
    await supabase.from('custom_exercises').delete().eq('id', id)
    await loadSavedExercises()
  }

  const handleEditSaved = async (id, updates) => {
    await supabase.from('custom_exercises').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
    await loadSavedExercises()
  }

  const handleSave = async () => {
    await save({ ...(log || {}), exercise_logs: logs, notes, custom_exercises: customExercises, workout_type: workout?.type || null, workout_done: log?.workout_done || false })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleComplete = async () => {
    await save({ ...(log || {}), exercise_logs: logs, notes, custom_exercises: customExercises, workout_type: workout?.type || null, workout_done: true })
    setSaved(true)
  }

  const bgClass = workout ? 'bg-workout' : 'bg-rest'

  if (loading) return (
    <div className={bgClass} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid ${W(0.2)}`, borderTopColor: W(0.7), borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <div className={`${bgClass} page-enter`} style={{ minHeight: '100vh' }}>
      <div style={{ padding: '24px 20px 20px' }}>
        <DateNav date={date} onPrev={() => setDate(d => subDays(d, 1))} onNext={() => setDate(d => addDays(d, 1))} />

        <div className="font-serif-italic" style={{ fontSize: '28px', color: W(0.92), lineHeight: 1.1, marginBottom: '3px' }}>
          {workout ? workout.type + '.' : 'Rest day.'}
        </div>
        {workout && <div style={{ fontSize: '10px', color: W(0.38), marginBottom: '20px' }}>{workout.warmup}</div>}
        {!workout && <div style={{ fontSize: '10px', color: W(0.38), marginBottom: '20px' }}>Walks + morning routine are your focus</div>}

        {isFutureDay && (
          <div style={{ padding: '11px 14px', background: W(0.07), borderRadius: '12px', fontSize: '12px', color: W(0.45), textAlign: 'center', marginBottom: '14px' }}>
            Preview mode — come back on {format(date, 'EEEE')} to log
          </div>
        )}

        {!isFutureDay && log?.workout_done && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 13px', background: W(0.1), borderRadius: '12px', marginBottom: '14px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: W(0.85), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={11} style={{ stroke: '#5a4030' }} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 500, color: W(0.88) }}>Session complete</span>
          </div>
        )}

        {/* Exercise list */}
        <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px 16px', marginBottom: '10px' }}>
          <div style={{ fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.3), marginBottom: '4px' }}>Exercises</div>
          <div style={{ fontSize: '10px', color: W(0.3), marginBottom: '12px' }}>
            {isFutureDay ? 'Your exercises for this session' : 'Log what you actually did'}
          </div>

          {workout && workout.exercises.map((ex, i) => (
            <ExerciseRow key={i} exercise={ex} value={logs[i]} onChange={val => setLogs(prev => ({ ...prev, [i]: val }))} disabled={isFutureDay} />
          ))}

          {customExercises.map((ex, i) => (
            <ExerciseRow key={ex.id} exercise={ex} value={logs[`custom_${i}`]} onChange={val => setLogs(prev => ({ ...prev, [`custom_${i}`]: val }))} disabled={isFutureDay} isCustom onRemove={() => setCustomExercises(prev => prev.filter(e => e.id !== ex.id))} />
          ))}

          {!isFutureDay && !showAddPanel && (
            <button onClick={() => setShowAddPanel(true)} style={{ width: '100%', marginTop: '10px', padding: '9px', border: `1.5px dashed ${W(0.15)}`, borderRadius: '10px', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', color: W(0.3) }}>
              <Plus size={14} style={{ stroke: W(0.3) }} /> Add exercise
            </button>
          )}
        </div>

        {!isFutureDay && showAddPanel && (
          <AddExercisePanel onAdd={handleAddExercise} onClose={() => setShowAddPanel(false)} savedExercises={savedExercises} onDeleteSaved={handleDeleteSaved} onEditSaved={handleEditSaved} />
        )}

        {!isFutureDay && (
          <>
            <div style={{ background: W(0.06), border: `1px solid ${W(0.09)}`, borderRadius: '16px', padding: '14px 16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '8px', letterSpacing: '.1em', textTransform: 'uppercase', color: W(0.3), marginBottom: '8px' }}>Session notes</div>
              <textarea className="input-field" rows={3} placeholder="How did it feel? Any pain? Energy level?" value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'none', fontSize: '12px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button onClick={handleSave} className="btn-secondary" style={{ flex: 1 }}>{saved ? 'Saved ✓' : 'Save draft'}</button>
              <button onClick={handleComplete} className="btn-success" style={{ flex: 1 }}>{log?.workout_done ? 'Update ✓' : 'Mark complete'}</button>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', padding: '10px', fontSize: '10px', color: W(0.28) }}>
          Add 5 lbs to main lifts every 2 weeks
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
