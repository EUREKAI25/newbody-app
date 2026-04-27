const BASE = 'https://newbody.nathaliebrigitte.com'

let apiKey = localStorage.getItem('newbody_api_key') || ''

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

  // Content (admin)
  getExercises: () => req('GET', '/api/exercises'),
  saveExercise: (ex) => req('POST', '/api/exercises', ex),
  deleteExercise: (id) => req('DELETE', `/api/exercises/${id}`),

  getBonusTypes: () => req('GET', '/api/bonus_types'),
  getBonusItems: () => req('GET', '/api/bonus_items'),
  saveBonusItem: (item) => req('POST', '/api/bonus_items', item),
  deleteBonusItem: (id) => req('DELETE', `/api/bonus_items/${id}`),

  getVisuals: () => req('GET', '/api/visuals'),
  saveVisual: (v) => req('POST', '/api/visuals', v),
  deleteVisual: (id) => req('DELETE', `/api/visuals/${id}`),

  getGoal: () => req('GET', '/api/goal'),
  setGoal: (data) => req('PUT', '/api/goal', data),

  getReminderRules: () => req('GET', '/api/reminder_rules'),
  setReminderRules: (data) => req('PUT', '/api/reminder_rules', data),

  // User data
  getSessions: () => req('GET', '/api/sessions'),
  addSession: (s) => req('POST', '/api/sessions', s),

  getBonusLogs: () => req('GET', '/api/bonus_logs'),
  addBonusLog: (l) => req('POST', '/api/bonus_logs', l),

  getProgressPhotos: () => req('GET', '/api/progress_photos'),
  addProgressPhoto: (p) => req('POST', '/api/progress_photos', p),

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
