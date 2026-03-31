import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, subMonths, addMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Sun, Wind, Footprints, Dumbbell } from 'lucide-react'
import { useRange } from '../lib/useData'

function DayDot({ filled, color = 'sage' }) {
  const colors = { sage: 'bg-sage-400', terracotta: 'bg-terracotta-400', stone: 'bg-stone-400' }
  return <div className={`w-1.5 h-1.5 rounded-full ${filled ? colors[color] : 'bg-stone-100'}`} />
}

export default function HistoryPage() {
  const [month, setMonth] = useState(new Date())
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const { logs, loading } = useRange(start, end)
  const [selected, setSelected] = useState(null)

  const days = eachDayOfInterval({ start, end })
  const logMap = {}
  logs.forEach(l => { logMap[l.date] = l })

  const selectedLog = selected ? logMap[format(selected, 'yyyy-MM-dd')] : null

  const firstDayOffset = (start.getDay() + 6) % 7

  return (
    <div className="page-enter space-y-5">
      <div className="pt-2">
        <h1 className="text-3xl font-display text-stone-800">History</h1>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setMonth(subMonths(month, 1))} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
          <ChevronLeft size={18} className="text-stone-400" />
        </button>
        <span className="text-sm font-medium text-stone-700">{format(month, 'MMMM yyyy')}</span>
        <button onClick={() => setMonth(addMonths(month, 1))} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
          <ChevronRight size={18} className="text-stone-400" />
        </button>
      </div>

      {/* Calendar */}
      <div className="card p-4">
        <div className="grid grid-cols-7 mb-2">
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-stone-300 font-medium py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const log = logMap[dateStr]
            const isSelected = selected && format(selected, 'yyyy-MM-dd') === dateStr
            const hasActivity = log && (log.yoga || log.sunlight || log.midday_walk || log.dinner_walk || log.workout_done)
            const isWorkout = log?.workout_done

            return (
              <button
                key={dateStr}
                onClick={() => setSelected(isSelected ? null : day)}
                className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all
                  ${isSelected ? 'bg-stone-800 text-white' : isToday(day) ? 'bg-sage-50 text-sage-700 ring-1 ring-sage-300' : 'hover:bg-stone-50 text-stone-700'}
                `}
              >
                <span className="text-xs font-medium">{format(day, 'd')}</span>
                {hasActivity && (
                  <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isWorkout ? 'bg-stone-400' : 'bg-sage-400'} ${isSelected ? 'bg-white opacity-60' : ''}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-stone-400">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sage-400" /> Habits
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-stone-400" /> Workout
        </div>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="card p-5 space-y-4">
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-widest font-medium">
              {format(selected, 'EEEE, MMMM d')}
            </div>
          </div>

          {!selectedLog ? (
            <div className="text-sm text-stone-400 text-center py-4">Nothing logged this day</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'yoga', icon: Wind, label: 'Yoga & breathing' },
                  { key: 'sunlight', icon: Sun, label: 'Morning sunlight' },
                  { key: 'midday_walk', icon: Footprints, label: 'Midday walk' },
                  { key: 'dinner_walk', icon: Footprints, label: 'Dinner walk' },
                ].map(h => (
                  <div key={h.key} className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium
                    ${selectedLog[h.key] ? 'bg-sage-50 text-sage-700' : 'bg-stone-50 text-stone-400'}`}>
                    <h.icon size={14} />
                    {h.label}
                  </div>
                ))}
              </div>

              {selectedLog.workout_done && (
                <div className="bg-stone-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                    <Dumbbell size={15} />
                    {selectedLog.workout_type || 'Workout'} — complete
                  </div>
                  {selectedLog.exercise_logs && Object.keys(selectedLog.exercise_logs).length > 0 && (
                    <div className="space-y-1">
                      {Object.entries(selectedLog.exercise_logs).map(([i, val]) => (
                        val ? <div key={i} className="text-xs text-stone-500">{val}</div> : null
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedLog.notes && (
                <div className="bg-stone-50 rounded-xl p-3">
                  <div className="text-xs text-stone-400 font-medium mb-1">Notes</div>
                  <div className="text-sm text-stone-600">{selectedLog.notes}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
