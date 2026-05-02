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
      ...adaptiveConfig,
    }
    const profile = {
      level_estimate: 1,
      energy_level: 3,
      recovery_mode: false,
      equipment_list: [],
      max_intensity_allowed: 3,
      max_cardio_allowed: 2,
      work_sec_base: 25,
      rest_sec_base: 35,
      ...trainingProfile,
    }

    let work_sec = Number(profile.work_sec_base) || 25
    let rest_sec = Number(profile.rest_sec_base) || 35
    let max_cardio = Number(profile.max_cardio_allowed) || 2

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

    // Too much cardio or low readiness → soften
    if (avg_cardio_diff >= 4 || cardio_readiness <= 2) {
      work_sec = Math.round(work_sec * (1 - cfg.adjust_step_percent))
      rest_sec = Math.round(rest_sec * (1 + cfg.rest_adjust_percent))
      max_cardio = Math.max(1, max_cardio - 1)
    }

    // Too easy + good energy → intensify (work only)
    if (avg_muscle_diff <= 2 && avg_cardio_diff <= 3 && avg_energy_7d >= 3) {
      work_sec = Math.round(work_sec * (1 + cfg.adjust_step_percent))
    }

    // Low energy today → gentle mode
    const isGentleMode = energy_today <= 2 || profile.recovery_mode
    if (isGentleMode) {
      work_sec = Math.round(work_sec * 0.85)
      rest_sec = Math.round(rest_sec * 1.20)
      max_cardio = Math.max(1, max_cardio - 1)
    }

    // Clamp
    work_sec = Math.max(cfg.min_work_sec, Math.min(cfg.max_work_sec, work_sec))
    rest_sec = Math.max(cfg.min_rest_sec, Math.min(cfg.max_rest_sec, rest_sec))
    max_cardio = Math.min(max_cardio, cfg.max_cardio_allowed)

    // Filter exercises
    const availableEquipment = Array.isArray(profile.equipment_list) ? profile.equipment_list : []
    const pool = exercises.filter(ex => {
      if (!ex.is_active) return false
      const cardio = Number(ex.default_cardio ?? 2)
      const intensity = Number(ex.default_intensity ?? 3)
      if (cardio > max_cardio) return false
      if (intensity > Number(profile.max_intensity_allowed)) return false
      if (isGentleMode && !ex.beginner_friendly) return false
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

    // Select exercises alternating muscle groups
    const groupOrder = ['fessiers', 'ventre', 'abdos_profond', 'cuisses', 'bras', 'dos', 'hanches', 'mobilite', 'etirements', 'corps_global']
    const TARGET = isGentleMode ? 3 : 4
    const selected = []
    const shuffled = [...pool].sort(() => Math.random() - 0.5)

    for (const group of groupOrder) {
      if (selected.length >= TARGET) break
      const pick = shuffled.find(e => e.muscle_group_id === group && !selected.includes(e))
      if (pick) selected.push(pick)
    }
    // Fill remaining if needed
    for (const ex of shuffled) {
      if (selected.length >= TARGET) break
      if (!selected.includes(ex)) selected.push(ex)
    }

    // Build sequence: exercise / rest / exercise / rest / ...
    const sequence = []
    selected.forEach((ex, i) => {
      sequence.push({ type: 'exercise', exercise: ex, duration_sec: work_sec })
      if (i < selected.length - 1) {
        sequence.push({ type: 'rest', nextExercise: selected[i + 1], duration_sec: rest_sec })
      }
    })

    return { sequence, work_sec, rest_sec, max_cardio, isGentleMode }
  }

  return { generateSessionProfile }
}
