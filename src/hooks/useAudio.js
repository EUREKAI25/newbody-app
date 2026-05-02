import { useRef, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

export function useAudio() {
  const refs = useRef({})

  function load(key, path) {
    if (!refs.current[key]) {
      const a = new Audio(BASE + path)
      a.preload = 'auto'
      refs.current[key] = a
    }
    return refs.current[key]
  }

  const playShortBeep = useCallback(() => {
    const a = load('short', 'sounds/short_beep.mp3')
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  const playStartBeep = useCallback(() => {
    const a = load('start', 'sounds/start_beep.mp3')
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  const playEndSession = useCallback(() => {
    const a = load('end', 'sounds/end_session.mp3')
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  return { playShortBeep, playStartBeep, playEndSession }
}
