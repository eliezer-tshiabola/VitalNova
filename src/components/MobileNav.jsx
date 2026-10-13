import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse, faStore, faMessage, faUser } from '@fortawesome/free-solid-svg-icons'

const items = [
  ['/', 'Accueil', faHouse], ['/boutique', 'Boutique', faStore], ['/contact', 'Contact', faMessage], ['/compte', 'Compte', faUser],
]

export function MobileNav() {
  return <nav aria-label="Navigation mobile" className="mobile-nav md:hidden">
    {items.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition ${isActive ? 'bg-green-800 text-white' : 'text-stone-500 hover:bg-green-50 hover:text-green-800'}`}>
      <FontAwesomeIcon icon={icon} className="text-base" /><span>{label}</span>
    </NavLink>)}
  </nav>
}
