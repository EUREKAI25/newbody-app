import { useState, useEffect, createContext, useContext } from 'react'
import {
  MUSCLE_GROUPS, EXERCISES, BONUS_TYPES, BONUS_ITEMS,
  PROGRESS_PHOTO_ZONES, VISUALS, DEFAULT_GOAL, DEFAULT_REMINDER_RULES
} from '../data/seed'

const STORAGE_KEY = 'newbody_v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function getInitialState() {
  const saved = loadState()
  return {
    goal: saved?.goal ?? { ...DEFAULT_GOAL },
    reminderRules: saved?.reminderRules ?? { ...DEFAULT_REMINDER_RULES },
    muscleGroups: saved?.muscleGroups ?? MUSCLE_GROUPS,
    exercises: saved?.exercises ?? EXERCISES,
    bonusTypes: saved?.bonusTypes ?? BONUS_TYPES,
    bonusItems: saved?.bonusItems ?? BONUS_ITEMS,
    progressPhotoZones: saved?.progressPhotoZones ?? PROGRESS_PHOTO_ZONES,
    visuals: saved?.visuals ?? VISUALS,
    sessions: saved?.sessions ?? [],
    bonusLogs: saved?.bonusLogs ?? [],
    dailyLogs: saved?.dailyLogs ?? [],
    progressPhotos: saved?.progressPhotos ?? [],
    notificationsEnabled: saved?.notificationsEnabled ?? false,
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(getInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const update = (partial) => setState(s => ({ ...s, ...partial }))

  // --- Goal ---
  const setGoal = (fields) => update({ goal: { ...state.goal, ...fields } })

  // --- Sessions ---
  const addSession = (session) => update({ sessions: [session, ...state.sessions] })
  const updateSession = (id, fields) => update({
    sessions: state.sessions.map(s => s.id === id ? { ...s, ...fields } : s)
  })

  const getSessionsForDate = (dateStr) =>
    state.sessions.filter(s => s.date === dateStr)

  const getSessionsForMonth = (year, month) =>
    state.sessions.filter(s => {
      const d = new Date(s.date)
      return d.getFullYear() === year && d.getMonth() === month
    })

  // --- Bonus logs ---
  const addBonusLog = (log) => update({ bonusLogs: [log, ...state.bonusLogs] })

  // --- Progress photos ---
  const addProgressPhoto = (photo) => update({ progressPhotos: [photo, ...state.progressPhotos] })

  // --- Admin: exercises ---
  const saveExercise = (ex) => {
    const exists = state.exercises.find(e => e.id === ex.id)
    if (exists) {
      update({ exercises: state.exercises.map(e => e.id === ex.id ? ex : e) })
    } else {
      update({ exercises: [...state.exercises, ex] })
    }
  }
  const deleteExercise = (id) => update({ exercises: state.exercises.filter(e => e.id !== id) })

  // --- Admin: bonus items ---
  const saveBonusItem = (item) => {
    const exists = state.bonusItems.find(b => b.id === item.id)
    if (exists) {
      update({ bonusItems: state.bonusItems.map(b => b.id === item.id ? item : b) })
    } else {
      update({ bonusItems: [...state.bonusItems, item] })
    }
  }
  const deleteBonusItem = (id) => update({ bonusItems: state.bonusItems.filter(b => b.id !== id) })

  // --- Admin: visuals ---
  const saveVisual = (v) => {
    const exists = state.visuals.find(x => x.id === v.id)
    if (exists) {
      update({ visuals: state.visuals.map(x => x.id === v.id ? v : x) })
    } else {
      update({ visuals: [...state.visuals, v] })
    }
  }
  const deleteVisual = (id) => update({ visuals: state.visuals.filter(v => v.id !== id) })

  // --- Reminder rules ---
  const setReminderRules = (rules) => update({ reminderRules: { ...state.reminderRules, ...rules } })

  const setNotificationsEnabled = (v) => update({ notificationsEnabled: v })

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState(getInitialState())
  }

  return (
    <StoreContext.Provider value={{
      ...state,
      setGoal,
      addSession, updateSession, getSessionsForDate, getSessionsForMonth,
      addBonusLog,
      addProgressPhoto,
      saveExercise, deleteExercise,
      saveBonusItem, deleteBonusItem,
      saveVisual, deleteVisual,
      setReminderRules,
      setNotificationsEnabled,
      resetAllData,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
