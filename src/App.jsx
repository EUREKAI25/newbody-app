import { Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './store/useStore'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import SessionScreen from './screens/SessionScreen'
import BonusScreen from './screens/BonusScreen'
import CalendarScreen from './screens/CalendarScreen'
import PhotosScreen from './screens/PhotosScreen'
import AdminScreen from './screens/AdminScreen'
import { useEffect } from 'react'

function AppInner() {
  const location = useLocation()
  const showNav = location.pathname !== '/admin'
  const { loading, error } = useStore()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/newbody-app/sw.js').catch(() => {})
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <p className="text-white/40 text-sm">Chargement…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#0f0f0f]">
      {error && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-4 pt-2">
          <div className="bg-amber-900/80 text-amber-200 text-xs text-center py-1.5 rounded-xl">
            {error}
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/session" element={<SessionScreen />} />
        <Route path="/bonus" element={<BonusScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/photos" element={<PhotosScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
      {showNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner />
    </StoreProvider>
  )
}
