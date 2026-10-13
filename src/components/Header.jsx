import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faHeart } from '@fortawesome/free-solid-svg-icons'
import { Logo } from './Logo'
import { useStore } from '../context/StoreContext'
import { HeaderSearch } from './HeaderSearch'

const links = [['/', 'Accueil'], ['/boutique', 'Boutique'], ['/contact', 'Contact'], ['/compte', 'Compte']]

export function Header() {
  const { cartCount, favorites, setCartOpen } = useStore()
  return <>
    <div className="bg-green-900 px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">Livraison disponible à Kinshasa · Commande confirmée avec notre équipe</div>
    <header className="sticky top-0 z-40 border-b border-green-900/10 bg-ivory-50/95 backdrop-blur-xl">
      <div className="container-main flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation principale">
          {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `relative py-3 text-sm font-bold transition ${isActive ? 'text-green-800 after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:bg-gold-500' : 'text-stone-600 hover:text-green-800'}`}>{label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <Link to="/boutique?favoris=1" aria-label={`${favorites.length} favoris`} className="relative grid size-10 place-items-center rounded-full text-green-900 hover:bg-green-100 sm:size-11"><FontAwesomeIcon icon={faHeart} /><span className="sr-only">Favoris</span>{favorites.length > 0 && <span className="counter">{favorites.length}</span>}</Link>
          <button onClick={() => setCartOpen(true)} aria-label={`Panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`} className="relative grid size-11 place-items-center rounded-full bg-green-800 text-white hover:bg-green-900"><FontAwesomeIcon icon={faBagShopping} />{cartCount > 0 && <span className="counter counter-gold">{cartCount}</span>}</button>
        </div>
      </div>
    </header>
  </>
}
