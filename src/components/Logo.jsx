import { Link } from 'react-router-dom'
import logo from '../assets/vitalnova-logo.jpeg'

export function Logo({ compact = false }) {
  return <Link to="/" className="inline-flex items-center gap-3" aria-label="VitalNova — Accueil">
    <img src={logo} alt="Logo VitalNova" className={`${compact ? 'size-10' : 'size-12'} rounded-full object-cover`} width="48" height="48" />
    <span className="font-display text-xl font-bold tracking-tight text-green-950">Vital<span className="text-gold-600">Nova</span></span>
  </Link>
}
