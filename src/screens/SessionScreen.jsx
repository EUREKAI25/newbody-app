import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore.jsx'
import { useAudio, useSessionMusic, getAudioConfig } from '../hooks/useAudio.js'
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine.js'
import { nanoid } from '../hooks/nanoid'
import { Pause, Play, X, Check, ChevronDown, ChevronUp, Plus, Volume2, VolumeX } from 'lucide-react'

const VPS = 'https://newbody.nathaliebrigitte.com'

function today() {
  return new Date().toISOString().slice(0, 10)
}

// ── Sliders helper ─────────────────────────────────────────────────────────
function SliderRow({ label, value, onChange, min = 1, max = 5, low, high }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-white/50 mb-1">
        <span>{label}</span>
        <span className="text-orange-400 font-semibold">{value}/5</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
        <span>{low}</span><span>{high}</span>
      </div>
    </div>
  )
}

// ── Check-in quotidien ──────────────────────────────────────────────────────
function CheckInForm({ onDone, existing }) {
  const { saveCheckin } = useStore()
  const [form, setForm] = useState({
    energy: existing?.energy ?? 3,
    cardio_readiness: existing?.cardio_readiness ?? 3,
    muscle_soreness: existing?.muscle_soreness ?? 1,
    notes: existing?.notes ?? '',
  })

  async function submit() {
    const checkin = { id: nanoid(), date: today(), ...form }
    await saveCheckin(checkin)
    onDone(checkin)
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-6 pb-24 pt-12">
      <h1 className="text-2xl font-bold text-white mb-1">Comment tu vas aujourd'hui ?</h1>
      <p className="text-white/40 text-sm mb-8">Rapide check-in pour adapter ta séance</p>

      <div className="space-y-6 flex-1">
        <SliderRow
          label="Énergie"
          value={form.energy}
          onChange={v => setForm(s => ({ ...s, energy: v }))}
          low="épuisée" high="au top"
        />
        <SliderRow
          label="Souffle / cardio dispo"
          value={form.cardio_readiness}
          onChange={v => setForm(s => ({ ...s, cardio_readiness: v }))}
          low="essoufflée facilement" high="top forme"
        />
        <SliderRow
          label="Courbatures"
          value={form.muscle_soreness}
          onChange={v => setForm(s => ({ ...s, muscle_soreness: v }))}
          low="aucune" high="très courbatue"
        />
        <div>
          <label className="text-white/50 text-xs">Note (optionnel)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(s => ({ ...s, notes: e.target.value }))}
            placeholder="Quelque chose à noter…"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm mt-1 resize-none focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl transition-colors mt-6"
      >
        C'est parti →
      </button>
    </div>
  )
}

// ── Feedback fin de séance ──────────────────────────────────────────────────
function FeedbackForm({ sessionId, onDone }) {
  const { saveSessionFeedback } = useStore()
  const [form, setForm] = useState({ muscular_difficulty: 3, cardio_difficulty: 2, energy_after: 3, notes: '' })

  async function submit() {
    const feedback = { id: nanoid(), session_id: sessionId, ...form }
    await saveSessionFeedback(feedback)
    onDone()
  }

  return (
    <div className="min-h-[100dvh] flex flex-col px-6 pb-24 pt-12">
      <div className="text-5xl mb-4 text-center">🎉</div>
      <h1 className="text-2xl font-bold text-white mb-1 text-center">Séance terminée !</h1>
      <p className="text-white/40 text-sm mb-8 text-center">Comment tu t'es sentie ?</p>

      <div className="space-y-6 flex-1">
        <SliderRow
          label="Effort musculaire"
          value={form.muscular_difficulty}
          onChange={v => setForm(s => ({ ...s, muscular_difficulty: v }))}
          low="trop facile" high="trop dur"
        />
        <SliderRow
          label="Cardio / souffle"
          value={form.cardio_difficulty}
          onChange={v => setForm(s => ({ ...s, cardio_difficulty: v }))}
          low="rien du tout" high="à bout de souffle"
        />
        <SliderRow
          label="Énergie après"
          value={form.energy_after}
          onChange={v => setForm(s => ({ ...s, energy_after: v }))}
          low="vidée" high="boostée"
        />
        <div>
          <label className="text-white/50 text-xs">Note (optionnel)</label>
          <textarea
            value={form.notes}
            onChange={e => setForm(s => ({ ...s, notes: e.target.value }))}
            placeholder="Ressenti, douleur, commentaire…"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm mt-1 resize-none focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      <button
        onClick={submit}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl transition-colors mt-6"
      >
        Enregistrer
      </button>
    </div>
  )
}

// ── Timer display ────────────────────────────────────────────────────────────
function TimerCircle({ timeLeft, total, phase }) {
  const pct = total > 0 ? timeLeft / total : 0
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)
  const color = phase === 'exercise' ? '#f97316' : '#6b7280'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" className="absolute -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="text-4xl font-bold text-white tabular-nums">{timeLeft}</span>
    </div>
  )
}

// ── Video / thumbnail ────────────────────────────────────────────────────────
function ExerciseMedia({ exercise, loop = true, className = '' }) {
  const url = exercise?.video_url
    ? (exercise.video_url.startsWith('http') ? exercise.video_url : VPS + exercise.video_url)
    : null
  const thumb = exercise?.thumbnail_url
    ? (exercise.thumbnail_url.startsWith('http') ? exercise.thumbnail_url : VPS + exercise.thumbnail_url)
    : exercise?.media_url || null

  if (url) {
    return (
      <video
        key={url}
        src={url}
        autoPlay
        muted
        loop={loop}
        playsInline
        className={className}
      />
    )
  }
  if (thumb) {
    return <img src={thumb} alt={exercise?.name} className={className} />
  }
  return null
}

// ── Player séance guidée ─────────────────────────────────────────────────────
function GuidedPlayer({ sequence, onAbandon, onFinish }) {
  const { addSession } = useStore()
  const { playShortBeep, playStartBeep, playEndSession } = useAudio()
  const music = useSessionMusic()

  const [seqIdx, setSeqIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(sequence[0]?.duration_sec || 30)
  const [paused, setPaused] = useState(false)
  const [musicMuted, setMusicMuted] = useState(() => !getAudioConfig().music_enabled)
  const [sessionId] = useState(nanoid())

  const timerRef = useRef(null)
  const seqIdxRef = useRef(0)
  const sequenceRef = useRef(sequence)
  const pausedRef = useRef(false)
  const initialDurations = useRef(sequence.map(s => s.duration_sec))

  function advanceToNext(fromIdx) {
    const nextIdx = fromIdx + 1
    if (nextIdx >= sequenceRef.current.length) {
      clearInterval(timerRef.current)
      playEndSession()
      music.stopMusic(true)
      const exercises = sequenceRef.current
        .filter(s => s.type === 'exercise')
        .map(s => s.exercise?.id)
        .filter(Boolean)
      addSession({
        id: sessionId,
        date: today(),
        status: 'completed',
        source: 'guided',
        completed_at: new Date().toISOString(),
        exercises,
        done_count: exercises.length,
      })
      onFinish(sessionId)
      return
    }
    seqIdxRef.current = nextIdx
    setSeqIdx(nextIdx)
    const next = sequenceRef.current[nextIdx]
    setTimeLeft(next.duration_sec)
    if (next.type === 'exercise') playStartBeep()
  }

  useEffect(() => {
    music.init()
    music.startMusic()
    playStartBeep()
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return
      setTimeLeft(t => {
        const next = t - 1
        if (next <= 5 && next > 0) playShortBeep()
        if (next <= 0) {
          advanceToNext(seqIdxRef.current)
          return 0
        }
        return next
      })
    }, 1000)
    return () => {
      clearInterval(timerRef.current)
      music.destroy()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function togglePause() {
    const nowPaused = !pausedRef.current
    pausedRef.current = nowPaused
    setPaused(nowPaused)
    if (nowPaused) {
      music.pauseMusic()
    } else {
      music.resumeMusic()
    }
  }

  function toggleMusicMute() {
    const muted = !musicMuted
    setMusicMuted(muted)
    music.setMuted(muted)
  }

  function handleAbandon() {
    clearInterval(timerRef.current)
    music.stopMusic(false)
    const exercises = sequenceRef.current
      .filter((s, i) => s.type === 'exercise' && i < seqIdxRef.current)
      .map(s => s.exercise?.id)
      .filter(Boolean)
    addSession({
      id: sessionId,
      date: today(),
      status: 'skipped',
      source: 'guided',
      completed_at: new Date().toISOString(),
      exercises,
      done_count: exercises.length,
    })
    onAbandon()
  }

  const current = sequence[seqIdx]
  const isExercise = current?.type === 'exercise'
  const ex = isExercise ? current.exercise : null
  const nextEx = !isExercise ? current?.nextExercise : (sequence[seqIdx + 2]?.exercise || null)
  const total = initialDurations.current[seqIdx] || current?.duration_sec || 30
  const progress = Math.round(((seqIdx) / sequence.length) * 100)
  const hasMusic = Boolean(getAudioConfig().default_session_audio_url)

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#0f0f0f]">
      {/* Progress bar */}
      <div className="h-1 bg-white/10 flex-shrink-0">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Phase indicator + mute button */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between flex-shrink-0">
        <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
          isExercise ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isExercise ? 'Exercice' : 'Repos'}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs">
            {Math.floor(seqIdx / 2) + 1} / {Math.ceil(sequence.length / 2)}
          </span>
          {hasMusic && (
            <button
              onClick={toggleMusicMute}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                musicMuted ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white/50 hover:text-white'
              }`}
              title={musicMuted ? 'Activer musique' : 'Couper musique'}
            >
              {musicMuted ? <VolumeX size={13}/> : <Volume2 size={13}/>}
            </button>
          )}
        </div>
      </div>

      {/* Media zone */}
      {isExercise && (
        <div className="flex-shrink-0 bg-[#1a1a1a] overflow-hidden" style={{ height: 'clamp(200px, 45vh, 400px)' }}>
          <ExerciseMedia exercise={ex} loop className="w-full h-full object-cover" />
          {!ex?.video_url && !ex?.media_url && (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              💪
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center py-4">
        {isExercise ? (
          <>
            <h2 className="text-2xl font-bold text-white text-center mb-1">{ex?.name}</h2>
            <p className="text-orange-400/80 text-sm mb-2">{ex?.instructions?.slice(0, 80)}{ex?.instructions?.length > 80 ? '…' : ''}</p>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-lg font-semibold mb-1">Repos</p>
            {nextEx && (
              <div className="w-full bg-white/5 rounded-2xl p-3 flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#222] flex-shrink-0">
                  <ExerciseMedia exercise={nextEx} loop={false} className="w-full h-full object-cover" />
                  {!nextEx?.video_url && !nextEx?.media_url && (
                    <div className="w-full h-full flex items-center justify-center text-2xl">💪</div>
                  )}
                </div>
                <div>
                  <p className="text-white/40 text-xs">Prochain exercice</p>
                  <p className="text-white font-semibold text-sm">{nextEx.name}</p>
                </div>
              </div>
            )}
          </>
        )}

        <TimerCircle timeLeft={timeLeft} total={total} phase={current?.type} />

        {paused && (
          <p className="text-white/30 text-sm mt-3 animate-pulse">En pause…</p>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 pb-10 flex gap-3 flex-shrink-0">
        <button
          onClick={togglePause}
          className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          {paused ? <><Play size={18}/> Reprendre</> : <><Pause size={18}/> Pause</>}
        </button>
        <button
          onClick={handleAbandon}
          className="w-14 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-2xl flex items-center justify-center transition-colors"
        >
          <X size={18}/>
        </button>
      </div>
    </div>
  )
}

// ── Screen principal ──────────────────────────────────────────────────────────
export default function SessionScreen() {
  const { exercises, muscleGroups, addSession, dailyCheckins, sessionFeedbacks, trainingProfile, adaptiveConfig } = useStore()
  const { generateSessionProfile } = useAdaptiveEngine()

  const [step, setStep] = useState('init') // init | checkin | pick | playing | feedback | done
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [sessionExercises, setSessionExercises] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [sequence, setSequence] = useState(null)
  const [finishedSessionId, setFinishedSessionId] = useState(null)

  useEffect(() => {
    const todayCheckin = dailyCheckins.find(c => c.date === today())
    setStep(todayCheckin ? 'pick' : 'checkin')
  }, [dailyCheckins])

  const activeExercises = exercises.filter(e => e.is_active)
  const exercisesByGroup = selectedGroup
    ? activeExercises.filter(e => e.muscle_group_id === selectedGroup)
    : activeExercises

  function launchGuided(exList) {
    const todayCheckin = dailyCheckins.find(c => c.date === today())
    const recentCheckins = dailyCheckins.slice(0, 7)
    const recentFeedbacks = sessionFeedbacks.slice(0, 3)

    let seq
    if (exList) {
      const work_sec = trainingProfile?.work_sec_base || 25
      const rest_sec = trainingProfile?.rest_sec_base || 35
      seq = []
      exList.forEach((ex, i) => {
        seq.push({ type: 'exercise', exercise: ex, duration_sec: work_sec })
        if (i < exList.length - 1) {
          seq.push({ type: 'rest', nextExercise: exList[i + 1], duration_sec: rest_sec })
        }
      })
    } else {
      const result = generateSessionProfile({
        exercises: activeExercises,
        trainingProfile,
        adaptiveConfig,
        todayCheckin,
        recentCheckins,
        recentFeedbacks,
      })
      seq = result.sequence
    }

    if (!seq || seq.length === 0) {
      alert('Aucun exercice disponible pour ce profil. Vérifie les paramètres dans Admin.')
      return
    }
    setSequence(seq)
    setStep('playing')
  }

  function startManual(exList) {
    setSessionExercises(exList.map(e => ({ ...e, done: false })))
    setStep('manual')
  }

  function startRandom() {
    const pool = selectedGroup
      ? activeExercises.filter(e => e.muscle_group_id === selectedGroup)
      : activeExercises
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    launchGuided(shuffled.slice(0, Math.min(4, shuffled.length)))
  }

  function launchGuidedWith(mandatoryEx) {
    const others = activeExercises
      .filter(e => e.id !== mandatoryEx.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    launchGuided([mandatoryEx, ...others])
  }

  if (step === 'init') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-4xl animate-pulse">⚡</div>
      </div>
    )
  }

  if (step === 'checkin') {
    const existing = dailyCheckins.find(c => c.date === today())
    return <CheckInForm onDone={() => setStep('pick')} existing={existing} />
  }

  if (step === 'playing' && sequence) {
    return (
      <GuidedPlayer
        sequence={sequence}
        onAbandon={() => setStep('pick')}
        onFinish={(sid) => { setFinishedSessionId(sid); setStep('feedback') }}
      />
    )
  }

  if (step === 'feedback') {
    return (
      <FeedbackForm
        sessionId={finishedSessionId}
        onDone={() => setStep('done')}
      />
    )
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

  if (step === 'manual') {
    function toggleDone(id) {
      setSessionExercises(exs => exs.map(e => e.id === id ? { ...e, done: !e.done } : e))
    }
    function finishManual(status) {
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
    }
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
              <div key={ex.id} className={`rounded-2xl overflow-hidden transition-all ${ex.done ? 'opacity-60' : ''}`}>
                <ExerciseMedia exercise={ex} loop className="w-full h-40 object-cover" />
                {!ex.video_url && !ex.media_url && (
                  <div className="w-full h-24 bg-gradient-to-r from-orange-900/40 to-orange-800/20 flex items-center justify-center">
                    <span className="text-3xl">{group?.icon || '💪'}</span>
                  </div>
                )}
                <div className="bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-white">{ex.name}</p>
                      <p className="text-orange-400/80 text-xs mt-0.5">{group?.name}</p>
                    </div>
                    <button
                      onClick={() => toggleDone(ex.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${ex.done ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'}`}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                  <button onClick={() => setExpanded(isExpanded ? null : ex.id)} className="flex items-center gap-1 text-white/30 text-xs mt-2">
                    Instructions {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                  </button>
                  {isExpanded && <p className="text-white/60 text-sm mt-2 leading-relaxed">{ex.instructions}</p>}
                </div>
              </div>
            )
          })}
        </div>
        <div className="px-4 pt-4 flex gap-3">
          <button onClick={() => finishManual('completed')} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl">Terminer ✓</button>
          <button onClick={() => finishManual('skipped')} className="w-14 bg-white/10 text-white/60 rounded-2xl flex items-center justify-center"><X size={18}/></button>
        </div>
      </div>
    )
  }

  // ── PICK screen ─────────────────────────────────────────────────────────────
  const todayCheckin = dailyCheckins.find(c => c.date === today())

  return (
    <div className="min-h-[100dvh] pb-28">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">Séance</h1>
        <p className="text-white/40 text-sm mt-1">
          {todayCheckin ? `Énergie aujourd'hui : ${todayCheckin.energy}/5` : 'Choisir ou lancer au hasard'}
        </p>
      </div>

      {/* Check-in rapide si déjà fait */}
      {todayCheckin && (
        <div className="px-4 mb-3">
          <button
            onClick={() => setStep('checkin')}
            className="text-white/30 text-xs underline"
          >
            Modifier mon check-in du jour
          </button>
        </div>
      )}

      {/* Filter by group */}
      <div className="px-4 mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedGroup === null ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'}`}
          >
            Tous
          </button>
          {muscleGroups.map(g => (
            <button key={g.id} onClick={() => setSelectedGroup(g.id === selectedGroup ? null : g.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedGroup === g.id ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'}`}
            >
              {g.icon} {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Guided session button */}
      <div className="px-4 mb-2">
        <button
          onClick={() => launchGuided(null)}
          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold py-4 rounded-2xl text-base transition-colors"
        >
          ⚡ Séance guidée ~5 min{selectedGroup ? ` — ${muscleGroups.find(g => g.id === selectedGroup)?.name}` : ''}
        </button>
      </div>
      <div className="px-4 mb-5">
        <button
          onClick={startRandom}
          className="w-full bg-white/10 hover:bg-white/15 text-white/70 font-medium py-3 rounded-2xl text-sm transition-colors"
        >
          Mode libre (pas de timer)
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
              onClick={() => launchGuidedWith(ex)}
              className="w-full flex items-center gap-3 bg-[#1a1a1a] hover:bg-[#222] rounded-xl p-3 text-left transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-900/30 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                {ex.video_url || ex.media_url
                  ? <ExerciseMedia exercise={ex} loop={false} className="w-full h-full object-cover" />
                  : group?.icon
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{ex.name}</p>
                <p className="text-white/30 text-xs">{group?.name} · {ex.type}</p>
              </div>
              <Plus size={16} className="text-orange-400 flex-shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
