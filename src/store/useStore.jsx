import { useState, useEffect, createContext, useContext } from 'react'
import { api } from '../api/client'
import { MUSCLE_GROUPS, EXERCISES, BONUS_TYPES, BONUS_ITEMS, PROGRESS_PHOTO_ZONES, VISUALS, DEFAULT_GOAL, DEFAULT_REMINDER_RULES } from '../data/seed'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [state, setState] = useState({
    goal: { ...DEFAULT_GOAL },
    reminderRules: { ...DEFAULT_REMINDER_RULES },
    muscleGroups: MUSCLE_GROUPS,
    exercises: EXERCISES,
    bonusTypes: BONUS_TYPES,
    bonusItems: BONUS_ITEMS,
    progressPhotoZones: PROGRESS_PHOTO_ZONES,
    visuals: VISUALS,
    sessions: [],
    bonusLogs: [],
    progressPhotos: [],
    notificationsEnabled: JSON.parse(localStorage.getItem('newbody_notif') || 'false'),
  })

  useEffect(() => {
    api.all()
      .then(data => {
        setState(s => ({
          ...s,
          goal: data.goal?.title ? data.goal : s.goal,
          reminderRules: data.reminderRules?.start_time ? {
            ...data.reminderRules,
            excluded_ranges: typeof data.reminderRules.excluded_ranges === 'string'
              ? JSON.parse(data.reminderRules.excluded_ranges)
              : data.reminderRules.excluded_ranges,
          } : s.reminderRules,
          muscleGroups: data.muscleGroups?.length ? data.muscleGroups : s.muscleGroups,
          exercises: data.exercises?.length ? data.exercises : s.exercises,
          bonusTypes: data.bonusTypes?.length ? data.bonusTypes : s.bonusTypes,
          bonusItems: data.bonusItems?.length ? data.bonusItems : s.bonusItems,
          progressPhotoZones: data.progressPhotoZones?.length ? data.progressPhotoZones : s.progressPhotoZones,
          visuals: data.visuals?.length ? data.visuals : s.visuals,
          sessions: data.sessions || [],
          bonusLogs: data.bonusLogs || [],
          progressPhotos: data.progressPhotos || [],
        }))
        setLoading(false)
      })
      .catch(err => {
        console.warn('API unreachable, using seed data', err)
        setError('Hors ligne — données locales')
        setLoading(false)
      })
  }, [])

  const update = (partial) => setState(s => ({ ...s, ...partial }))

  const setGoal = async (fields) => {
    const newGoal = { ...state.goal, ...fields }
    update({ goal: newGoal })
    try { await api.setGoal(newGoal) } catch {}
  }

  const addSession = async (session) => {
    update({ sessions: [session, ...state.sessions] })
    try { await api.addSession({ ...session, exercises: JSON.stringify(session.exercises) }) } catch {}
  }

  const updateSession = (id, fields) => {
    update({ sessions: state.sessions.map(s => s.id === id ? { ...s, ...fields } : s) })
  }

  const addBonusLog = async (log) => {
    update({ bonusLogs: [log, ...state.bonusLogs] })
    try { await api.addBonusLog(log) } catch {}
  }

  const addProgressPhoto = async (photo) => {
    update({ progressPhotos: [photo, ...state.progressPhotos] })
    try { await api.addProgressPhoto(photo) } catch {}
  }

  const saveExercise = async (ex) => {
    const exists = state.exercises.find(e => e.id === ex.id)
    update({ exercises: exists
      ? state.exercises.map(e => e.id === ex.id ? ex : e)
      : [...state.exercises, ex]
    })
    try { await api.saveExercise(ex) } catch {}
  }

  const deleteExercise = async (id) => {
    update({ exercises: state.exercises.filter(e => e.id !== id) })
    try { await api.deleteExercise(id) } catch {}
  }

  const saveBonusItem = async (item) => {
    const exists = state.bonusItems.find(b => b.id === item.id)
    update({ bonusItems: exists
      ? state.bonusItems.map(b => b.id === item.id ? item : b)
      : [...state.bonusItems, item]
    })
    try { await api.saveBonusItem(item) } catch {}
  }

  const deleteBonusItem = async (id) => {
    update({ bonusItems: state.bonusItems.filter(b => b.id !== id) })
    try { await api.deleteBonusItem(id) } catch {}
  }

  const saveVisual = async (v) => {
    const exists = state.visuals.find(x => x.id === v.id)
    update({ visuals: exists
      ? state.visuals.map(x => x.id === v.id ? v : x)
      : [...state.visuals, v]
    })
    try { await api.saveVisual(v) } catch {}
  }

  const deleteVisual = async (id) => {
    update({ visuals: state.visuals.filter(v => v.id !== id) })
    try { await api.deleteVisual(id) } catch {}
  }

  const setReminderRules = async (rules) => {
    const merged = { ...state.reminderRules, ...rules }
    update({ reminderRules: merged })
    try { await api.setReminderRules(merged) } catch {}
  }

  const setNotificationsEnabled = (v) => {
    update({ notificationsEnabled: v })
    localStorage.setItem('newbody_notif', JSON.stringify(v))
  }

  const resetAllData = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <StoreContext.Provider value={{
      ...state,
      loading,
      error,
      setGoal,
      addSession, updateSession,
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
