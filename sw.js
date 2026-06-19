// NewBody ServiceWorker — gestion des rappels aléatoires

const DB_KEY = 'newbody_reminders'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

// Receive a message from the app to schedule reminders
self.addEventListener('message', async (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDERS') {
    const { rules } = event.data
    scheduleReminders(rules)
  }
  if (event.data?.type === 'CANCEL_REMINDERS') {
    cancelAllReminders()
  }
})

// Handle notification click — open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes('newbody'))
      if (existing) return existing.focus()
      return self.clients.openWindow(self.registration.scope)
    })
  )
})

// Handle notification close (skipped)
self.addEventListener('notificationclose', () => {})

// --- Scheduling logic ---

let scheduledTimers = []

function cancelAllReminders() {
  scheduledTimers.forEach(id => clearTimeout(id))
  scheduledTimers = []
}

function scheduleReminders(rules) {
  cancelAllReminders()

  const slots = generateReminderSlots(rules)
  const now = Date.now()

  slots.forEach(ts => {
    const delay = ts - now
    if (delay > 0) {
      const id = setTimeout(() => {
        showReminder()
      }, delay)
      scheduledTimers.push(id)
    }
  })
}

function generateReminderSlots(rules) {
  const {
    start_time = '08:00',
    end_time = '21:00',
    min_delay_min = 90,
    max_per_day = 6,
    excluded_ranges = ['12:30-14:30'],
  } = rules

  const today = new Date()
  today.setSeconds(0, 0)

  const [startH, startM] = start_time.split(':').map(Number)
  const [endH, endM] = end_time.split(':').map(Number)

  const dayStart = new Date(today)
  dayStart.setHours(startH, startM, 0, 0)

  const dayEnd = new Date(today)
  dayEnd.setHours(endH, endM, 0, 0)

  const now = Date.now()
  const windowStart = Math.max(now + 60_000, dayStart.getTime())

  if (windowStart >= dayEnd.getTime()) return []

  // Parse excluded ranges
  const exclusions = excluded_ranges.map(r => {
    const [a, b] = r.split('-')
    const [ah, am] = a.split(':').map(Number)
    const [bh, bm] = b.split(':').map(Number)
    const from = new Date(today); from.setHours(ah, am, 0, 0)
    const to = new Date(today); to.setHours(bh, bm, 0, 0)
    return { from: from.getTime(), to: to.getTime() }
  })

  function isExcluded(ts) {
    return exclusions.some(({ from, to }) => ts >= from && ts <= to)
  }

  const slots = []
  let cursor = windowStart
  const minDelayMs = min_delay_min * 60_000

  while (slots.length < max_per_day && cursor < dayEnd.getTime()) {
    // Random delay between minDelay and minDelay * 1.8
    const randomDelay = minDelayMs + Math.random() * (minDelayMs * 0.8)
    cursor += randomDelay

    if (cursor >= dayEnd.getTime()) break
    if (isExcluded(cursor)) {
      // Skip past exclusion
      const exc = exclusions.find(({ from, to }) => cursor >= from && cursor <= to)
      if (exc) cursor = exc.to + 60_000
      continue
    }

    slots.push(Math.floor(cursor))
  }

  return slots
}

function showReminder() {
  const messages = [
    'Une séance t\'attend 💪',
    'C\'est le moment de bouger ⚡',
    'Petite séance ? Tu peux le faire 🌟',
    'Ton corps te remercie à l\'avance ✨',
    'Allez, 5 minutes ! 🔥',
  ]
  const msg = messages[Math.floor(Math.random() * messages.length)]

  self.registration.showNotification('NewBody', {
    body: msg,
    icon: '/newbody-app/icon-192.png',
    badge: '/newbody-app/icon-192.png',
    tag: 'newbody-reminder',
    renotify: true,
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'dismiss', title: 'Plus tard' },
    ],
  })
}
