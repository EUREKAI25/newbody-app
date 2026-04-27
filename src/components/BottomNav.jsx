import { NavLink } from 'react-router-dom'
import { Home, Zap, Star, Calendar, Camera } from 'lucide-react'

const links = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/session', icon: Zap, label: 'Séance' },
  { to: '/bonus', icon: Star, label: 'Bonus' },
  { to: '/calendar', icon: Calendar, label: 'Suivi' },
  { to: '/photos', icon: Camera, label: 'Photos' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#141414] border-t border-white/10 flex z-50">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-3 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-orange-400' : 'text-white/40'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.5} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
