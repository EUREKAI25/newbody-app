import { useEffect, useCallback } from 'react'
import { useStore } from '../store/useStore.jsx'

export function useReminders() {
  const { reminderRules, notificationsEnabled, setNotificationsEnabled } = useStore()

  const scheduleToday = useCallback(async () => {
    if (!notificationsEnabled) return
    const reg = await navigator.serviceWorker?.ready
    if (!reg) return
    reg.active?.postMessage({ type: 'SCHEDULE_REMINDERS', rules: reminderRules })
  }, [reminderRules, notificationsEnabled])

  useEffect(() => {
    if (notificationsEnabled) scheduleToday()
  }, [scheduleToday, notificationsEnabled])

  async function requestAndEnable() {
    if (!('Notification' in window)) return { ok: false, reason: 'unsupported' }
    const current = Notification.permission
    if (current === 'denied') return { ok: false, reason: 'denied' }
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return { ok: false, reason: 'dismissed' }
    setNotificationsEnabled(true)
    scheduleToday()
    return { ok: true }
  }

  function disable() {
    setNotificationsEnabled(false)
    navigator.serviceWorker?.ready.then(reg => {
      reg.active?.postMessage({ type: 'CANCEL_REMINDERS' })
    })
  }

  function getPermissionStatus() {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission // 'default' | 'granted' | 'denied'
  }

  return { requestAndEnable, disable, scheduleToday, getPermissionStatus }
}
