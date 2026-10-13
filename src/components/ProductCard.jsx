import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBagShopping, faHeart as heartSolid, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons'
import { Button } from './ui/button'
import { useStore } from '../context/StoreContext'

export function ProductCard({ product }) {
  const { addToCart, favorites, toggleFavorite } = useStore()
  const favorite = favorites.includes(product.id)
  return <article className="product-card group relative">
    <Link to={`/produit/${product.id}`} aria-label={`Voir la fiche détaillée de ${product.name}`} className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-3 focus-visible:ring-gold-300" />
    <div className="relative overflow-hidden rounded-xl bg-stone-100 sm:rounded-none">
      <img src={product.image} alt={product.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" width="540" height="540" />
      <span className="absolute left-3 top-3 hidden rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-green-800 shadow-sm sm:block">Démo</span>
      <button onClick={() => toggleFavorite(product.id)} aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} className="absolute right-3 top-3 z-20 hidden size-10 place-items-center rounded-full bg-white/95 text-green-800 shadow-sm hover:bg-green-50 sm:grid"><FontAwesomeIcon icon={favorite ? heartSolid : heartRegular} /></button>
    </div>
    <div className="flex flex-1 flex-col px-1 py-2 sm:p-5">
      <p className="hidden text-[11px] font-black uppercase tracking-[.16em] text-gold-700 sm:block">{product.categoryLabel}</p>
      <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-5 text-green-950 sm:mt-2 sm:font-display sm:text-xl sm:font-bold sm:leading-tight">{product.name}</h3>
      <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-stone-600 sm:block">{product.short}</p>
      <div className="mt-auto flex items-end justify-between pt-2 sm:pt-5"><div><span className="hidden text-xs text-stone-500 sm:block">Prix démo</span><p className="text-base font-black text-green-800 sm:text-2xl sm:text-green-900">{product.price.toFixed(2)} $</p></div>
        <Button size="icon" className="relative z-20 hidden sm:inline-flex" onClick={() => addToCart(product.id)} aria-label={`Ajouter ${product.name} au panier`}><FontAwesomeIcon icon={faBagShopping} /></Button>
      </div>
      <Link to={`/produit/${product.id}`} className="relative z-20 mt-4 hidden items-center gap-2 text-left text-sm font-bold text-green-800 hover:text-green-950 sm:inline-flex">Voir la fiche complète <FontAwesomeIcon icon={faArrowRight} className="text-xs" /></Link>
    </div>
  </article>
}
