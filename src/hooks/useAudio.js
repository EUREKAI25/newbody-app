import { useRef, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

const DEFAULT_AUDIO_CONFIG = {
  default_session_audio_url: '',
  volume_music: 0.5,
  volume_beep: 1.0,
  music_enabled: true,
  mute_videos: true,
}

export function getAudioConfig() {
  try {
    return { ...DEFAULT_AUDIO_CONFIG, ...JSON.parse(localStorage.getItem('newbody_audio_config') || 'null') }
  } catch {
    return { ...DEFAULT_AUDIO_CONFIG }
  }
}

export function saveAudioConfig(updates) {
  const current = getAudioConfig()
  localStorage.setItem('newbody_audio_config', JSON.stringify({ ...current, ...updates }))
}

// ── Beep hook (stateless, used anywhere) ───────────────────────────────────
export function useAudio() {
  const refs = useRef({})

  function load(key, path) {
    if (!refs.current[key]) {
      const a = new Audio(path.startsWith('http') ? path : BASE + path)
      a.preload = 'auto'
      refs.current[key] = a
    }
    return refs.current[key]
  }

  const playShortBeep = useCallback(() => {
    const cfg = getAudioConfig()
    const a = load('short', 'sounds/short_beep.mp3')
    a.volume = cfg.volume_beep ?? 1
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  const playStartBeep = useCallback(() => {
    const cfg = getAudioConfig()
    const a = load('start', 'sounds/start_beep.mp3')
    a.volume = cfg.volume_beep ?? 1
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  const playEndSession = useCallback(() => {
    const cfg = getAudioConfig()
    const a = load('end', 'sounds/end_session.mp3')
    a.volume = cfg.volume_beep ?? 1
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  return { playShortBeep, playStartBeep, playEndSession }
}

// ── Session music hook (used only inside GuidedPlayer) ─────────────────────
export function useSessionMusic() {
  const musicRef = useRef(null)

  const init = useCallback(() => {
    const cfg = getAudioConfig()
    const url = cfg.default_session_audio_url
    if (!url) return
    if (musicRef.current) return // already loaded
    const a = new Audio(url.startsWith('http') ? url : BASE + url)
    a.loop = true
    a.volume = cfg.volume_music ?? 0.5
    a.preload = 'auto'
    musicRef.current = a
  }, [])

  const startMusic = useCallback(() => {
    const cfg = getAudioConfig()
    if (!cfg.music_enabled) return
    init()
    if (!musicRef.current) return
    musicRef.current.play().catch(() => {})
  }, [init])

  const pauseMusic = useCallback(() => {
    musicRef.current?.pause()
  }, [])

  const resumeMusic = useCallback(() => {
    const cfg = getAudioConfig()
    if (!cfg.music_enabled || !musicRef.current) return
    musicRef.current.play().catch(() => {})
  }, [])

  const stopMusic = useCallback((fade = true) => {
    const m = musicRef.current
    if (!m) return
    if (!fade || m.volume === 0) {
      m.pause()
      m.currentTime = 0
      return
    }
    const original = m.volume
    const steps = 12
    const step = original / steps
    let count = 0
    const id = setInterval(() => {
      count++
      m.volume = Math.max(0, original - step * count)
      if (count >= steps) {
        clearInterval(id)
        m.pause()
        m.currentTime = 0
        m.volume = original // restore for next session
      }
    }, 50)
  }, [])

  const setVolume = useCallback((v) => {
    if (musicRef.current) musicRef.current.volume = v
    saveAudioConfig({ volume_music: v })
  }, [])

  const setMuted = useCallback((muted) => {
    if (!musicRef.current) return
    musicRef.current.muted = muted
    if (!muted) musicRef.current.play().catch(() => {})
    saveAudioConfig({ music_enabled: !muted })
  }, [])

  const destroy = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause()
      musicRef.current = null
    }
  }, [])

  return { startMusic, pauseMusic, resumeMusic, stopMusic, setVolume, setMuted, destroy, init }
}
