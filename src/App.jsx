import { Routes, Route, useLocation } from 'react-router-dom'
import { StoreProvider } from './store/useStore'
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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/newbody-app/sw.js').catch(() => {})
    }
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#0f0f0f]">
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
