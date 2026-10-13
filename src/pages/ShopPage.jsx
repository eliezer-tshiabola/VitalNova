import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSliders, faHeart } from '@fortawesome/free-solid-svg-icons'
import { products } from '../data/products'
import { visibleCategories } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { Input } from '../components/ui/input'
import { useStore } from '../context/StoreContext'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const { favorites } = useStore()
  const category = params.get('categorie') || 'tous'
  const favoritesOnly = params.get('favoris') === '1'
  const categoryOptions = [['tous', 'Tous'], ...visibleCategories.map(item => [item.id, item.title])]

  const filtered = useMemo(() => products
    .filter(product => (category === 'tous' || product.category === category)
      && (!favoritesOnly || favorites.includes(product.id))
      && product.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'price-asc'
      ? a.price - b.price
      : sort === 'price-desc'
        ? b.price - a.price
        : Number(b.popular) - Number(a.popular)), [category, favoritesOnly, search, sort, favorites])

  const selectCategory = value => {
    const next = new URLSearchParams(params)
    if (value === 'tous') next.delete('categorie')
    else next.set('categorie', value)
    next.delete('favoris')
    setParams(next)
  }

  const toggleFavorites = () => {
    const next = new URLSearchParams()
    if (!favoritesOnly) next.set('favoris', '1')
    setParams(next)
  }

  return <main className="pb-10">
    <section className="page-hero"><div className="container-main"><span className="eyebrow">Catalogue</span><h1>La boutique VitalNova</h1><p>Explorez nos produits de démonstration, comparez et préparez votre demande.</p></div></section>

    <section className="container-main -mt-8 relative z-10">
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xl shadow-green-950/5 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative"><span className="sr-only">Rechercher un produit</span><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Rechercher un produit…" className="pl-11" /></label>
          <label className="relative"><span className="sr-only">Trier</span><FontAwesomeIcon icon={faSliders} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><select value={sort} onChange={event => setSort(event.target.value)} className="input-base min-w-48 pl-11"><option value="featured">En vedette</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label>
          <button onClick={toggleFavorites} className={`h-12 rounded-xl px-5 text-sm font-bold ${favoritesOnly ? 'bg-green-800 text-white' : 'bg-green-50 text-green-800'}`}><FontAwesomeIcon icon={faHeart} className="mr-2" /> Mes favoris ({favorites.length})</button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categoryOptions.map(([value, label]) => <button key={value} onClick={() => selectCategory(value)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold ${!favoritesOnly && category === value ? 'bg-gold-500 text-green-950' : 'bg-stone-100 text-stone-600 hover:bg-green-50'}`}>{label}</button>)}
        </div>
      </div>
    </section>

    <section className="container-main pt-10">
      <div className="mb-6 flex items-center justify-between"><p className="text-sm font-bold text-green-950">{filtered.length} produit{filtered.length !== 1 ? 's' : ''}</p><p className="text-xs text-stone-500">Catalogue de démonstration</p></div>
      {filtered.length
        ? <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-6 lg:grid-cols-3">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div>
        : <div className="rounded-2xl border border-dashed border-green-200 bg-green-50/50 px-6 py-20 text-center"><FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl text-green-300" /><h2 className="mt-4 font-display text-2xl font-bold text-green-950">Aucun produit trouvé</h2><p className="mt-2 text-sm text-stone-500">Essayez une autre recherche ou retirez certains filtres.</p></div>}
    </section>
  </main>
}
