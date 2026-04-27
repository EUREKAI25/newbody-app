import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Settings } from 'lucide-react'
import { useStore } from '../store/useStore.jsx'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatTargetDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function HomeScreen() {
  const { goal, setGoal } = useStore()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(null) // 'title' | 'date' | null

  const days = daysUntil(goal.target_date)

  return (
    <div className="relative min-h-[100dvh] flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {goal.background_url ? (
          <img
            src={goal.background_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-orange-950/60 to-black" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 pb-32">
        {/* Objectif */}
        {editing === 'title' ? (
          <input
            autoFocus
            defaultValue={goal.title}
            onBlur={(e) => { setGoal({ title: e.target.value }); setEditing(null) }}
            onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
            className="text-4xl font-bold text-white bg-transparent border-b border-white/40 outline-none w-full mb-1"
          />
        ) : (
          <button
            onClick={() => setEditing('title')}
            className="flex items-start gap-2 group text-left"
          >
            <h1 className="text-4xl font-bold text-white leading-tight">
              {goal.title || 'Mon objectif'}
            </h1>
            <Edit2 size={16} className="mt-2 text-white/30 group-hover:text-white/60 flex-shrink-0" />
          </button>
        )}

        {/* Date cible */}
        <div className="mt-3">
          {editing === 'date' ? (
            <input
              autoFocus
              type="date"
              defaultValue={goal.target_date}
              onBlur={(e) => { setGoal({ target_date: e.target.value }); setEditing(null) }}
              className="text-sm text-white/70 bg-white/10 border border-white/20 rounded px-2 py-1 outline-none"
            />
          ) : (
            <button
              onClick={() => setEditing('date')}
              className="flex items-center gap-1.5 group"
            >
              {goal.target_date ? (
                <>
                  <span className="text-orange-400 text-sm font-medium">
                    {days !== null && days > 0 ? `J-${days}` : days === 0 ? "C'est aujourd'hui !" : 'Objectif passé'}
                  </span>
                  <span className="text-white/40 text-sm">— {formatTargetDate(goal.target_date)}</span>
                </>
              ) : (
                <span className="text-white/40 text-sm">Définir une date cible →</span>
              )}
              <Edit2 size={12} className="text-white/20 group-hover:text-white/50" />
            </button>
          )}
        </div>

        {/* Background change hint */}
        <button
          onClick={() => {
            const url = prompt('URL de l\'image de fond :')
            if (url !== null) setGoal({ background_url: url })
          }}
          className="mt-8 text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          Changer le fond ↑
        </button>
      </div>

      {/* Quick actions */}
      <div className="relative z-10 px-4 pb-28 flex gap-3">
        <button
          onClick={() => navigate('/session')}
          className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl text-base transition-colors"
        >
          ⚡ Faire une séance
        </button>
        <button
          onClick={() => navigate('/bonus')}
          className="w-14 bg-white/10 hover:bg-white/15 text-white rounded-2xl flex items-center justify-center text-xl transition-colors"
        >
          ⭐
        </button>
      </div>
    </div>
  )
}
