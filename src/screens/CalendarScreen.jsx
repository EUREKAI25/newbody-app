import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'

function parseZones(ex) {
  if (!ex.zones_json) return []
  try {
    const z = JSON.parse(ex.zones_json)
    return Array.isArray(z) ? z : []
  } catch { return [] }
}

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAYS_FR = ['L','M','M','J','V','S','D']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay()
  return (d + 6) % 7 // Monday = 0
}

function dayColor(count, hasBonusLog) {
  if (count === 0 && !hasBonusLog) return 'bg-white/5 text-white/20'
  if (count === 0 && hasBonusLog) return 'bg-yellow-500/20 text-yellow-300'
  if (count === 1) return 'bg-green-600/60 text-white'
  if (count === 2) return 'bg-yellow-500/60 text-white'
  return 'bg-blue-500/60 text-white'
}

export default function CalendarScreen() {
  const { sessions, bonusLogs, exercises } = useStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthSessions = sessions.filter(s => {
    const d = new Date(s.date)
    return d.getFullYear() === year && d.getMonth() === month && s.status === 'completed'
  })
  const monthBonus = bonusLogs.filter(b => {
    const d = new Date(b.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  function sessionsOnDay(day) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return monthSessions.filter(s => s.date === dateStr).length
  }
  function bonusOnDay(day) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return monthBonus.filter(b => b.date === dateStr).length > 0
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y-1) }
    else setMonth(m => m-1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y+1) }
    else setMonth(m => m+1)
  }

  // ── Récap 7 derniers jours ──────────────────────────────────────────────────
  const todayStr = now.toISOString().slice(0, 10)
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10)

  const week7Sessions = sessions.filter(s =>
    s.status === 'completed' && s.date >= sevenDaysAgoStr && s.date <= todayStr
  )
  const week7ExIds = week7Sessions.flatMap(s => Array.isArray(s.exercises) ? s.exercises : [])
  const week7ExList = week7ExIds.map(id => exercises.find(e => e.id === id)).filter(Boolean)

  const weekZoneCounts = {}
  week7ExList.forEach(ex => {
    parseZones(ex).forEach(zone => { weekZoneCounts[zone] = (weekZoneCounts[zone] || 0) + 1 })
  })
  const weekZones = Object.entries(weekZoneCounts).sort((a, b) => b[1] - a[1])

  const weekScores = week7ExList.map(e => Number(e.difficulty_score)).filter(Boolean)
  const weekAvgIntensity = weekScores.length
    ? (weekScores.reduce((s, v) => s + v, 0) / weekScores.length).toFixed(1)
    : null

  const allActiveZones = [...new Set(exercises.filter(e => e.is_active).flatMap(e => parseZones(e)))]
  const workedZones = new Set(Object.keys(weekZoneCounts))
  const neglectedZones = allActiveZones.filter(z => !workedZones.has(z))

  const totalSessions = monthSessions.length
  const totalBonus = monthBonus.length
  const activeDays = new Set(monthSessions.map(s => s.date)).size

  return (
    <div className="min-h-[100dvh] pb-28 px-4">
      <div className="pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Suivi</h1>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center text-white/60">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-white font-semibold">{MONTHS_FR[month]} {year}</h2>
        <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center text-white/60">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_FR.map((d, i) => (
          <div key={i} className="text-center text-white/30 text-xs py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const count = sessionsOnDay(day)
          const hasBonus = bonusOnDay(day)
          const isToday = year === now.getFullYear() && month === now.getMonth() && day === now.getDate()
          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium relative transition-all ${dayColor(count, hasBonus)}`}
            >
              {isToday && (
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-orange-400" />
              )}
              <span>{day}</span>
              {count > 0 && <span className="text-[9px] opacity-70">{count}x</span>}
              {hasBonus && count === 0 && <span className="text-[9px]">⭐</span>}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-3 flex-wrap text-xs text-white/40">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-600/60 inline-block" /> 1 séance</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/60 inline-block" /> 2 séances</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500/60 inline-block" /> 3+</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500/20 inline-block" /> bonus</span>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Séances', value: totalSessions },
          { label: 'Jours actifs', value: activeDays },
          { label: 'Bonus', value: totalBonus },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-400">{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Récap 7 derniers jours */}
      <div className="mt-6 bg-[#1a1a1a] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/40 text-xs uppercase tracking-wider">Ces 7 derniers jours</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-white/30">{week7Sessions.length} séance{week7Sessions.length !== 1 ? 's' : ''}</span>
            {weekAvgIntensity && (
              <span className="text-orange-400 font-medium">intensité moy. {weekAvgIntensity}/5</span>
            )}
          </div>
        </div>

        {week7Sessions.length === 0 ? (
          <p className="text-white/25 text-sm">Aucune séance cette semaine — c'est le moment de s'y mettre ✨</p>
        ) : (
          <>
            {weekZones.length > 0 && (
              <div className="mb-3">
                <p className="text-white/30 text-xs mb-2">Zones travaillées</p>
                <div className="flex flex-wrap gap-1.5">
                  {weekZones.map(([zone, count]) => (
                    <span key={zone} className="px-2.5 py-1 bg-orange-500/15 text-orange-300 text-xs rounded-full capitalize">
                      {zone}{count > 1 ? ` ×${count}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {neglectedZones.length > 0 && (
              <div>
                <p className="text-white/30 text-xs mb-2">Zones pas encore touchées</p>
                <div className="flex flex-wrap gap-1.5">
                  {neglectedZones.map(zone => (
                    <span key={zone} className="px-2.5 py-1 bg-white/5 text-white/35 text-xs rounded-full capitalize">
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
