export function useAdaptiveEngine() {
  function generateSessionProfile({ exercises, trainingProfile, adaptiveConfig, todayCheckin, recentCheckins, recentFeedbacks }) {
    const cfg = {
      target_muscle_min: 3,
      target_muscle_max: 4,
      max_cardio_allowed: 3,
      adjust_step_percent: 0.10,
      rest_adjust_percent: 0.15,
      min_work_sec: 20,
      max_work_sec: 60,
      min_rest_sec: 10,
      max_rest_sec: 60,
      target_session_sec: 300,
      ...adaptiveConfig,
    }
    const profile = {
      level_estimate: 1,
      energy_level: 3,
      equipment_list: [],
      max_intensity_allowed: 5,
      max_cardio_allowed: 5,
      work_sec_base: 40,
      rest_sec_base: 20,
      ...trainingProfile,
    }

    let work_sec = Number(profile.work_sec_base) || 40
    let rest_sec = Number(profile.rest_sec_base) || 20
    let max_cardio = Number(profile.max_cardio_allowed) || 5

    const energy_today = todayCheckin?.energy ?? 3
    const cardio_readiness = todayCheckin?.cardio_readiness ?? 3

    const avg_energy_7d = recentCheckins.length
      ? recentCheckins.reduce((s, c) => s + (c.energy ?? 3), 0) / recentCheckins.length
      : 3

    const avg_cardio_diff = recentFeedbacks.length
      ? recentFeedbacks.reduce((s, f) => s + (f.cardio_difficulty ?? 2), 0) / recentFeedbacks.length
      : 2
    const avg_muscle_diff = recentFeedbacks.length
      ? recentFeedbacks.reduce((s, f) => s + (f.muscular_difficulty ?? 3), 0) / recentFeedbacks.length
      : 3

    // Too much cardio or low readiness → soften timing
    if (avg_cardio_diff >= 4 || cardio_readiness <= 2) {
      work_sec = Math.round(work_sec * (1 - cfg.adjust_step_percent))
      rest_sec = Math.round(rest_sec * (1 + cfg.rest_adjust_percent))
      max_cardio = Math.max(1, max_cardio - 1)
    }

    // Too easy + good energy → intensify (work only)
    if (avg_muscle_diff <= 2 && avg_cardio_diff <= 3 && avg_energy_7d >= 3) {
      work_sec = Math.round(work_sec * (1 + cfg.adjust_step_percent))
    }

    // Low energy today → gentle mode (energy check-in driven, no manual toggle)
    const isGentleMode = energy_today <= 2
    if (isGentleMode) {
      work_sec = Math.round(work_sec * 0.85)
      rest_sec = Math.round(rest_sec * 1.20)
      max_cardio = Math.max(1, max_cardio - 1)
    }

    // Clamp timing
    work_sec = Math.max(cfg.min_work_sec, Math.min(cfg.max_work_sec, work_sec))
    rest_sec = Math.max(cfg.min_rest_sec, Math.min(cfg.max_rest_sec, rest_sec))
    max_cardio = Math.min(max_cardio, cfg.max_cardio_allowed)

    // Guard: rest must stay below work (handles legacy stored profiles with inverted ratio)
    if (rest_sec >= work_sec) {
      rest_sec = Math.max(cfg.min_rest_sec, Math.floor(work_sec * 0.5))
    }

    // Level cap: user's mastered level, lowered by 1 when fatigued (never below 1)
    const userLevel = profile.level_estimate || 1
    const levelCap = isGentleMode ? Math.max(1, userLevel - 1) : userLevel

    // Filter exercises
    const availableEquipment = Array.isArray(profile.equipment_list) ? profile.equipment_list : []
    const pool = exercises.filter(ex => {
      if (!ex.is_active) return false
      const cardio = Number(ex.default_cardio ?? 2)
      if (cardio > max_cardio) return false
      // Level filter: exercises with no score are always included
      const score = Number(ex.difficulty_score ?? 0)
      if (score > 0 && score > levelCap) return false
      try {
        const needed = typeof ex.equipment_needed === 'string'
          ? JSON.parse(ex.equipment_needed || '[]')
          : (ex.equipment_needed || [])
        if (needed.length > 0 && !needed.includes('none') && !needed.includes('')) {
          if (!needed.every(e => availableEquipment.includes(e))) return false
        }
      } catch {}
      return true
    })

    if (pool.length === 0) return { sequence: [], work_sec, rest_sec, max_cardio, isGentleMode }

    // Compute how many exercise slots needed to fill target duration
    // N * work + (N-1) * rest = target  →  N = ceil((target + rest) / (work + rest))
    const target_sec = cfg.target_session_sec || 300
    const interval_sec = work_sec + rest_sec
    const N = Math.ceil((target_sec + rest_sec) / interval_sec)

    // Build circuit from shuffled pool (capped for variety)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const circuitSize = Math.min(shuffled.length, isGentleMode ? 4 : 6)
    const circuit = shuffled.slice(0, circuitSize)

    // Fill N slots by cycling through circuit
    const sequence = []
    for (let i = 0; i < N; i++) {
      const ex = circuit[i % circuit.length]
      const nextEx = circuit[(i + 1) % circuit.length]
      sequence.push({ type: 'exercise', exercise: ex, duration_sec: work_sec })
      if (i < N - 1) {
        sequence.push({ type: 'rest', nextExercise: nextEx, duration_sec: rest_sec })
      }
    }

    return { sequence, work_sec, rest_sec, max_cardio, isGentleMode }
  }

  return { generateSessionProfile }
}
