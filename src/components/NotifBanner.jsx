import { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'
import { useReminders } from '../hooks/useReminders'
import { useStore } from '../store/useStore.jsx'

const DISMISSED_KEY = 'newbody_notif_dismissed'

export default function NotifBanner() {
  const { notificationsEnabled } = useStore()
  const { requestAndEnable, getPermissionStatus } = useReminders()
  const [status, setStatus] = useState(null) // null | 'asking' | 'denied' | 'done' | 'hidden'

  useEffect(() => {
    if (notificationsEnabled) { setStatus('done'); return }
    if (localStorage.getItem(DISMISSED_KEY)) { setStatus('hidden'); return }
    const perm = getPermissionStatus()
    if (perm === 'denied') { setStatus('denied'); return }
    if (perm === 'granted') return // granted but store not updated — edge case
    setStatus('ask') // show the banner
  }, [notificationsEnabled])

  if (status === 'done' || status === 'hidden' || status === null) return null

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setStatus('hidden')
  }

  if (status === 'denied') {
    return (
      <div className="mx-4 mb-3 bg-amber-900/30 border border-amber-500/30 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-amber-300 text-sm font-semibold mb-1">Notifications bloquées</p>
            <p className="text-amber-200/60 text-xs leading-relaxed">
              Pour les activer :{' '}
              <strong>Réglages → Safari → Notifications</strong> ou{' '}
              <strong>Réglages → [NewBody] → Notifications</strong>
            </p>
          </div>
          <button onClick={dismiss} className="text-amber-400/50 flex-shrink-0 mt-0.5">
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  // status === 'ask'
  return (
    <div className="mx-4 mb-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Bell size={16} className="text-orange-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">Activer les rappels ?</p>
          <p className="text-white/40 text-xs mt-0.5">Séances aléatoires dans la journée</p>
        </div>
        <button onClick={dismiss} className="text-white/20 flex-shrink-0">
          <X size={14} />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={async () => {
            setStatus('asking')
            const result = await requestAndEnable()
            if (result.ok) {
              setStatus('done')
            } else if (result.reason === 'denied') {
              setStatus('denied')
            } else {
              dismiss()
            }
          }}
          className="flex-1 bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-xl"
        >
          {status === 'asking' ? '…' : 'Oui, activer'}
        </button>
        <button
          onClick={dismiss}
          className="flex-1 bg-white/5 text-white/40 text-sm py-2.5 rounded-xl"
        >
          Plus tard
        </button>
      </div>
    </div>
  )
}
