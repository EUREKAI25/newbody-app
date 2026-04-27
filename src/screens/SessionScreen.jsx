import { useState } from 'react'
import { useStore } from '../store/useStore.jsx'
import { Check, X, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { nanoid } from '../hooks/nanoid'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function SessionScreen() {
  const { exercises, muscleGroups, addSession } = useStore()
  const [step, setStep] = useState('pick') // 'pick' | 'doing' | 'done'
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [sessionExercises, setSessionExercises] = useState([])
  const [expanded, setExpanded] = useState(null)

  const activeExercises = exercises.filter(e => e.is_active)
  const exercisesByGroup = selectedGroup
    ? activeExercises.filter(e => e.muscle_group_id === selectedGroup)
    : activeExercises

  function startSession(exList) {
    setSessionExercises(exList.map(e => ({ ...e, done: false })))
    setStep('doing')
  }

  function startRandom() {
    const pool = selectedGroup
      ? activeExercises.filter(e => e.muscle_group_id === selectedGroup)
      : activeExercises
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    startSession(shuffled.slice(0, Math.min(4, shuffled.length)))
  }

  function toggleDone(id) {
    setSessionExercises(exs => exs.map(e => e.id === id ? { ...e, done: !e.done } : e))
  }

  function finishSession(status) {
    addSession({
      id: nanoid(),
      date: today(),
      status,
      source: 'manual',
      completed_at: new Date().toISOString(),
      exercises: sessionExercises.map(e => e.id),
      done_count: sessionExercises.filter(e => e.done).length,
    })
    setStep('done')
    setSessionExercises([])
    setSelectedGroup(null)
  }

  if (step === 'done') {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Séance enregistrée</h2>
        <p className="text-white/50 mb-8">Bien joué !</p>
        <button
          onClick={() => setStep('pick')}
          className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-semibold"
        >
          Nouvelle séance
        </button>
      </div>
    )
  }

  if (step === 'doing') {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-28">
        <div className="px-4 pt-12 pb-4">
          <h1 className="text-2xl font-bold text-white">Séance en cours</h1>
          <p className="text-white/40 text-sm mt-1">{sessionExercises.filter(e => e.done).length}/{sessionExercises.length} exercices cochés</p>
        </div>

        <div className="flex-1 px-4 space-y-3 overflow-y-auto">
          {sessionExercises.map(ex => {
            const group = muscleGroups.find(g => g.id === ex.muscle_group_id)
            const isExpanded = expanded === ex.id
            return (
              <div
                key={ex.id}
                className={`rounded-2xl overflow-hidden transition-all ${ex.done ? 'opacity-60' : ''}`}
              >
                {ex.media_url ? (
                  <img src={ex.media_url} alt={ex.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-24 bg-gradient-to-r from-orange-900/40 to-orange-800/20 flex items-center justify-center">
                    <span className="text-3xl">{group?.icon || '💪'}</span>
                  </div>
                )}
                <div className="bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{ex.name}</p>
                      <p className="text-orange-400/80 text-xs mt-0.5">{group?.name} · {ex.duration_min} min</p>
                    </div>
                    <button
                      onClick={() => toggleDone(ex.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        ex.done ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'
                      }`}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : ex.id)}
                    className="flex items-center gap-1 text-white/30 text-xs mt-2"
                  >
                    Instructions
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {isExpanded && (
                    <p className="text-white/60 text-sm mt-2 leading-relaxed">{ex.instructions}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-4 pt-4 flex gap-3">
          <button
            onClick={() => finishSession('completed')}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl"
          >
            Terminer ✓
          </button>
          <button
            onClick={() => finishSession('skipped')}
            className="w-14 bg-white/10 hover:bg-white/15 text-white/60 rounded-2xl flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Séance</h1>
        <p className="text-white/40 text-sm mt-1">Choisir ou lancer au hasard</p>
      </div>

      {/* Filter by group */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGroup === null ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            Tous
          </button>
          {muscleGroups.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id === selectedGroup ? null : g.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedGroup === g.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              {g.icon} {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Random launch */}
      <div className="px-4 mb-5">
        <button
          onClick={startRandom}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl text-base transition-colors"
        >
          ⚡ Séance aléatoire{selectedGroup ? ` — ${muscleGroups.find(g=>g.id===selectedGroup)?.name}` : ''}
        </button>
      </div>

      {/* Exercise list */}
      <div className="px-4 space-y-2">
        <p className="text-white/30 text-xs uppercase tracking-wider mb-3">Ou choisir un exercice</p>
        {exercisesByGroup.map(ex => {
          const group = muscleGroups.find(g => g.id === ex.muscle_group_id)
          return (
            <button
              key={ex.id}
              onClick={() => startSession([ex])}
              className="w-full flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222] rounded-xl p-3 text-left transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-900/30 flex items-center justify-center text-lg flex-shrink-0">
                {ex.media_url
                  ? <img src={ex.media_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  : group?.icon
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{ex.name}</p>
                <p className="text-white/30 text-xs">{group?.name} · {ex.duration_min} min</p>
              </div>
              <Plus size={16} className="text-orange-400 flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
