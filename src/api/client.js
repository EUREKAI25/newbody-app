const BASE = 'https://newbody.nathaliebrigitte.com'

let apiKey = import.meta.env.VITE_NEWBODY_API_KEY || localStorage.getItem('newbody_api_key') || ''

export function setApiKey(key) {
  apiKey = key
  localStorage.setItem('newbody_api_key', key)
}

export function getApiKey() {
  return apiKey
}

async function req(method, path, body) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-API-Key': apiKey } : {}),
    },
  }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + path, opts)
  if (!res.ok) throw new Error(`API ${method} ${path} → ${res.status}`)
  return res.json()
}

export const api = {
  health: () => req('GET', '/api/health'),
  all: () => req('GET', '/api/all'),

  // Exercises
  getExercises: () => req('GET', '/api/exercises'),
  saveExercise: (ex) => req('POST', '/api/exercises', ex),
  deleteExercise: (id) => req('DELETE', `/api/exercises/${id}`),

  // Bonus
  getBonusTypes: () => req('GET', '/api/bonus_types'),
  getBonusItems: () => req('GET', '/api/bonus_items'),
  saveBonusItem: (item) => req('POST', '/api/bonus_items', item),
  deleteBonusItem: (id) => req('DELETE', `/api/bonus_items/${id}`),

  // Visuals
  getVisuals: () => req('GET', '/api/visuals'),
  saveVisual: (v) => req('POST', '/api/visuals', v),
  deleteVisual: (id) => req('DELETE', `/api/visuals/${id}`),

  // Goal
  getGoal: () => req('GET', '/api/goal'),
  setGoal: (data) => req('PUT', '/api/goal', data),

  // Reminder rules
  getReminderRules: () => req('GET', '/api/reminder_rules'),
  setReminderRules: (data) => req('PUT', '/api/reminder_rules', data),

  // Sessions
  getSessions: () => req('GET', '/api/sessions'),
  addSession: (s) => req('POST', '/api/sessions', s),

  // Bonus logs
  getBonusLogs: () => req('GET', '/api/bonus_logs'),
  addBonusLog: (l) => req('POST', '/api/bonus_logs', l),

  // Progress photos
  getProgressPhotos: () => req('GET', '/api/progress_photos'),
  addProgressPhoto: (p) => req('POST', '/api/progress_photos', p),

  // Equipment
  getEquipment: () => req('GET', '/api/equipment'),
  saveEquipment: (e) => req('POST', '/api/equipment', e),
  deleteEquipment: (id) => req('DELETE', `/api/equipment/${id}`),
  getEquipmentVariants: () => req('GET', '/api/equipment_variants'),
  saveEquipmentVariant: (v) => req('POST', '/api/equipment_variants', v),
  deleteEquipmentVariant: (id) => req('DELETE', `/api/equipment_variants/${id}`),

  // Training profile (singleton)
  getTrainingProfile: () => req('GET', '/api/user_training_profile'),
  saveTrainingProfile: (p) => req('PUT', '/api/user_training_profile', p),

  // Daily checkins
  getDailyCheckins: () => req('GET', '/api/daily_checkins'),
  saveCheckin: (c) => req('POST', '/api/daily_checkins', c),

  // Session feedback
  getSessionFeedbacks: () => req('GET', '/api/session_feedback'),
  saveSessionFeedback: (f) => req('POST', '/api/session_feedback', f),

  // Adaptive config (singleton)
  getAdaptiveConfig: () => req('GET', '/api/adaptive_config'),
  saveAdaptiveConfig: (c) => req('PUT', '/api/adaptive_config', c),

  // Workout programs
  getWorkoutPrograms: () => req('GET', '/api/workout_programs'),
  saveWorkoutProgram: (p) => req('POST', '/api/workout_programs', p),
  deleteWorkoutProgram: (id) => req('DELETE', `/api/workout_programs/${id}`),

  // Videos list
  getVideos: () => req('GET', '/api/videos'),

  // Upload
  upload: async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(BASE + '/api/upload', {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      body: fd,
    })
    if (!res.ok) throw new Error('Upload failed')
    return res.json()
  },
}
