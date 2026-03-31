import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export function useDay(date) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('date', dateStr)
      .single()
    setLog(data || null)
    setLoading(false)
  }, [dateStr])

  useEffect(() => { fetch() }, [fetch])

  const save = async (updates) => {
    const payload = { date: dateStr, ...updates, updated_at: new Date().toISOString() }
    if (log?.id) {
      const { data } = await supabase.from('daily_logs').update(payload).eq('id', log.id).select().single()
      setLog(data)
    } else {
      const { data } = await supabase.from('daily_logs').insert(payload).select().single()
      setLog(data)
    }
  }

  const toggle = async (field) => {
    const newVal = !(log?.[field] ?? false)
    await save({ ...(log || {}), [field]: newVal })
  }

  return { log, loading, save, toggle, refetch: fetch }
}

export function useRange(startDate, endDate) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data } = await supabase
        .from('daily_logs')
        .select('*')
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'))
        .order('date', { ascending: true })
      setLogs(data || [])
      setLoading(false)
    }
    fetch()
  }, [startDate?.toISOString(), endDate?.toISOString()])

  return { logs, loading }
}
