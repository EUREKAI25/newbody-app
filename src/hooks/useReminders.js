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
    if (!('Notification' in window)) return false
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return false
    setNotificationsEnabled(true)
    return true
  }

  function disable() {
    setNotificationsEnabled(false)
    navigator.serviceWorker?.ready.then(reg => {
      reg.active?.postMessage({ type: 'CANCEL_REMINDERS' })
    })
  }

  return { requestAndEnable, disable, scheduleToday }
}
