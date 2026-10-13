import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { visibleCategories } from '../data/categories'

export function CategoriesPage() {
  return <main>
    <section className="page-hero"><div className="container-main"><span className="eyebrow">Toutes les catégories</span><h1>Les univers VitalNova</h1><p>Choisissez l’univers qui correspond à votre besoin du moment.</p></div></section>
    <section className="container-main -mt-10 relative z-10 grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
      {visibleCategories.map(category => <Link key={category.id} to={`/boutique?categorie=${category.id}`} className="category-card group"><img src={category.backgroundImage} alt="" /><div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[10px] font-black uppercase tracking-[.17em] text-gold-300">Collection</p><h2 className="mt-1 font-display text-2xl font-bold text-white">{category.title}</h2><p className="mt-1 text-xs text-white/75">{category.description}</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold">Découvrir <FontAwesomeIcon icon={faArrowRight} /></span></div></Link>)}
    </section>
  </main>
}
