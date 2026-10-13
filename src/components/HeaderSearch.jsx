import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faClockRotateLeft, faMagnifyingGlass, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { products } from '../data/products'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'

const RECENT_SEARCHES_KEY = 'vitalnova-recent-searches'

const normalize = value => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()

const readRecentSearches = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY))
    return Array.isArray(saved) ? saved.slice(0, 6) : []
  } catch {
    return []
  }
}

export function HeaderSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(readRecentSearches)
  const normalizedQuery = normalize(query.trim())
  const results = useMemo(() => normalizedQuery
    ? products.filter(product => normalize(`${product.name} ${product.categoryLabel} ${product.short}`).includes(normalizedQuery)).slice(0, 12)
    : products.filter(product => product.popular).slice(0, 6), [normalizedQuery])

  const rememberSearch = value => {
    const term = value.trim()
    if (!term) return
    setRecentSearches(current => {
      const next = [term, ...current.filter(item => normalize(item) !== normalize(term))].slice(0, 6)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
    setRecentSearches([])
  }

  const changeOpen = nextOpen => {
    setOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }

  return <Dialog open={open} onOpenChange={changeOpen}>
    <button type="button" onClick={() => setOpen(true)} aria-label="Rechercher un produit" className="grid size-10 place-items-center rounded-full text-green-900 transition hover:bg-green-100 sm:size-11"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
    <DialogContent className="inset-0 left-0 top-0 h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none bg-ivory-50 p-0 sm:p-0">
      <div className="mx-auto min-h-full w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-8 sm:pt-10">
        <div className="pr-14"><span className="eyebrow">Recherche</span><DialogTitle className="mt-3 text-3xl sm:text-4xl">Quel produit recherchez-vous ?</DialogTitle><DialogDescription className="max-w-xl">Recherchez dans tout le catalogue VitalNova et accédez directement à la fiche qui vous intéresse.</DialogDescription></div>

        <form className="relative mt-7" onSubmit={event => { event.preventDefault(); rememberSearch(query) }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-stone-400" />
          <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Thé, dentifrice, bracelet…" className="h-16 w-full rounded-xl border border-stone-300 bg-white pl-14 pr-5 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-green-700 focus:ring-3 focus:ring-green-100 sm:h-18 sm:text-lg" />
        </form>

        {!normalizedQuery && recentSearches.length > 0 && <section className="mt-7" aria-labelledby="recent-searches-title">
          <div className="flex items-center justify-between gap-4"><h2 id="recent-searches-title" className="flex items-center gap-2 font-sans text-sm font-black tracking-normal text-green-950"><FontAwesomeIcon icon={faClockRotateLeft} className="text-green-700" />Recherches récentes</h2><button type="button" onClick={clearRecentSearches} className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-green-800"><FontAwesomeIcon icon={faTrashCan} />Effacer</button></div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">{recentSearches.map(term => <button type="button" key={term} onClick={() => setQuery(term)} className="shrink-0 rounded-lg border border-green-200 bg-white px-4 py-2 text-xs font-bold text-green-900 hover:bg-green-50">{term}</button>)}</div>
        </section>}

        <section className="mt-8" aria-labelledby="search-products-title">
          <div className="flex items-end justify-between gap-4"><div><span className="eyebrow">{normalizedQuery ? `${results.length} résultat${results.length !== 1 ? 's' : ''}` : 'Pour vous'}</span><h2 id="search-products-title" className="mt-2 text-2xl sm:text-3xl">{normalizedQuery ? 'Produits trouvés' : 'Produits suggérés'}</h2></div><Link to="/boutique" onClick={() => changeOpen(false)} className="hidden items-center gap-2 text-sm font-bold text-green-800 sm:inline-flex">Toute la boutique <FontAwesomeIcon icon={faArrowRight} /></Link></div>

          {results.length > 0 ? <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{results.map(product => <SearchProduct key={product.id} product={product} onSelect={() => { rememberSearch(query || product.name); changeOpen(false) }} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-green-200 bg-green-50/60 px-6 py-16 text-center"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl text-green-300" /><h3 className="mt-4 font-display text-xl font-bold text-green-950">Aucun produit trouvé</h3><p className="mt-2 text-sm text-stone-500">Essayez un autre nom ou consultez toute la boutique.</p><Link to="/boutique" onClick={() => changeOpen(false)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-800">Voir la boutique <FontAwesomeIcon icon={faArrowRight} /></Link></div>}
        </section>
      </div>
    </DialogContent>
  </Dialog>
}

function SearchProduct({ product, onSelect }) {
  return <Link to={`/produit/${product.id}`} onClick={onSelect} className="group min-w-0"><span className="block overflow-hidden rounded-xl bg-stone-100"><img src={product.image} alt="" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]" /></span><span className="mt-3 block text-[10px] font-black uppercase tracking-[.1em] text-gold-700">{product.categoryLabel}</span><strong className="mt-1 line-clamp-2 block text-sm leading-5 text-green-950 sm:text-base">{product.name}</strong><span className="mt-1 block text-sm font-black text-green-800">{product.price.toFixed(2)} $</span></Link>
}
