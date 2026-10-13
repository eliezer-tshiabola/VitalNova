import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBoxOpen, faHeadset, faLeaf, faShieldHeart, faTruckFast, faCheck, faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { products } from '../data/products'
import { visibleCategories } from '../data/categories'
import { ProductCard } from '../components/ProductCard'
import { buttonVariants } from '../components/ui/button'
import { cn } from '../lib/utils'
import { STORE_CONFIG } from '../config/store'
import { reviews } from '../data/reviews'
import { RatingStars } from '../components/RatingStars'

export function HomePage() {
  const whatsappUrl = STORE_CONFIG.whatsappNumber ? `https://wa.me/${STORE_CONFIG.whatsappNumber}` : '/contact'
  const homeCategories = visibleCategories.slice(0, 3)
  return <main>
    <section className="hero-section">
      <div className="container-main grid min-h-[660px] items-center gap-12 py-14 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <span className="eyebrow"><FontAwesomeIcon icon={faLeaf} /> Bien-être · Hygiène · Soins personnels</span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-[-.04em] text-green-950 sm:text-6xl lg:text-7xl">Votre quotidien, <span className="text-gold-600">naturellement</span> mieux.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">VitalNova réunit une sélection attentive de produits de bien-être, d’hygiène et d’accessoires, avec une commande simple et un accompagnement humain sur WhatsApp.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/boutique" className={cn(buttonVariants({ size: 'lg' }))}>Découvrir la boutique <FontAwesomeIcon icon={faArrowRight} /></Link><a href={whatsappUrl} className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}><FontAwesomeIcon icon={faWhatsapp} className="text-xl" /> Commander sur WhatsApp</a></div>
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-green-900"><span><FontAwesomeIcon icon={faCheck} className="mr-2 text-gold-600" />Prix clairs</span><span><FontAwesomeIcon icon={faCheck} className="mr-2 text-gold-600" />Paiement à la livraison</span><span><FontAwesomeIcon icon={faCheck} className="mr-2 text-gold-600" />Assistance humaine</span></div>
        </div>
      </div>
    </section>

    <section className="section-space container-main"><div className="section-heading"><div><span className="eyebrow">Nos univers</span><h2>Choisissez ce qui vous fait du bien</h2></div></div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{homeCategories.map(category => <Link key={category.id} to={`/boutique?categorie=${category.id}`} className="category-card group"><img src={category.backgroundImage} alt="" /><div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><p className="text-[10px] font-black uppercase tracking-[.17em] text-gold-300">Collection</p><h3 className="mt-1 font-display text-xl font-bold leading-tight sm:text-2xl">{category.title}</h3><p className="mt-1 line-clamp-1 text-xs text-white/75">{category.description}</p></div></Link>)}</div>
      {visibleCategories.length > 3 && <div className="mt-6 text-center"><Link to="/categories" className={cn(buttonVariants({ variant: 'secondary' }))}>Voir toutes les catégories <FontAwesomeIcon icon={faArrowRight} /></Link></div>}
    </section>

    <section className="section-space bg-green-50/60"><div className="container-main"><div className="section-heading"><div><span className="eyebrow">Les favoris</span><h2>Une sélection à découvrir</h2></div><p className="max-w-md text-sm leading-6 text-stone-500">Prix et fiches marqués comme données de démonstration, à valider avant publication.</p></div><div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-6 lg:grid-cols-3">{products.filter(p => p.popular).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="mt-9 text-center"><Link to="/boutique" className={cn(buttonVariants({ size: 'lg' }))}>Voir tous les produits <FontAwesomeIcon icon={faArrowRight} /></Link></div></div></section>

    <section className="section-space container-main"><div className="split-feature"><div><span className="eyebrow">Pourquoi VitalNova</span><h2 className="mt-4">Une boutique proche, simple et rassurante</h2><p className="mt-5 max-w-xl text-stone-600 leading-7">Nous avons conçu chaque étape pour vous laisser le temps de choisir, vérifier votre demande et échanger avec une vraie personne avant confirmation.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><Feature icon={faShieldHeart} title="Sélection attentive" text="Des références présentées avec des informations claires." /><Feature icon={faTruckFast} title="Livraison organisée" text="Votre zone et les frais sont confirmés avec vous." /><Feature icon={faHeadset} title="Assistance disponible" text="Une question ? Notre équipe vous accompagne." /><Feature icon={faLeaf} title="Choix essentiels" text="Une gamme lisible, pensée pour le quotidien." /></div></div><div className="quote-panel"><FontAwesomeIcon icon={faLeaf} className="text-3xl text-gold-500" /><p className="mt-8 font-display text-3xl font-bold leading-tight text-white">« Votre bien-être, notre priorité. »</p><p className="mt-4 text-sm leading-6 text-green-100/70">L’engagement qui guide l’expérience VitalNova.</p></div></div></section>

    <section className="section-space bg-ivory-100"><div className="container-main"><div className="text-center"><span className="eyebrow">Comment ça marche</span><h2 className="mt-4">Votre commande en trois étapes</h2></div><div className="mt-12 grid gap-8 md:grid-cols-3"><Step n="01" icon={faBagShopping} title="Choisissez" text="Explorez les produits et ajoutez vos préférences au panier." /><Step n="02" icon={faBoxOpen} title="Renseignez la livraison" text="Indiquez vos coordonnées et votre adresse en toute simplicité." /><Step n="03" icon={faWhatsapp} title="Confirmez avec nous" text="Envoyez la demande sur WhatsApp. Notre équipe confirme les détails, puis le paiement s’effectue à la livraison." /></div></div></section>

    <section className="section-space bg-green-50/60" aria-labelledby="home-reviews-title"><div className="container-main"><div className="text-center"><span className="eyebrow">Avis clients</span><h2 id="home-reviews-title" className="mt-4">Ce que disent nos clients</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">Aperçu de la future section d’avis, alimentée après la confirmation des livraisons.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{reviews.slice(0, 3).map(review => <article key={review.id} className="rounded-2xl border border-green-900/10 bg-white p-6 shadow-sm"><RatingStars rating={review.rating} /><p className="mt-5 min-h-24 text-sm leading-7 text-stone-600">« {review.comment} »</p><div className="mt-5 border-t border-stone-100 pt-4"><strong className="text-sm text-green-900">{review.author}</strong><span className="ml-2 text-xs text-stone-400">{review.location}</span><p className="mt-1 text-[11px] font-bold text-gold-700">Avis de démonstration</p></div></article>)}</div></div></section>

    <section className="container-main pb-6 pt-20"><div className="cta-panel"><div><span className="eyebrow eyebrow-light">Prêt à découvrir ?</span><h2 className="mt-4 max-w-2xl text-white">Le bien-être commence par un choix simple.</h2><p className="mt-4 max-w-xl text-green-100/70">Parcourez notre sélection et préparez votre demande en quelques minutes.</p></div><Link to="/boutique" className={cn(buttonVariants({ variant: 'gold', size: 'lg' }), 'shrink-0')}>Explorer la boutique <FontAwesomeIcon icon={faArrowRight} /></Link></div></section>
  </main>
}

function Feature({ icon, title, text }) { return <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-green-100 text-green-800"><FontAwesomeIcon icon={icon} /></span><div><h3 className="font-bold text-green-950">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-500">{text}</p></div></div> }
function Step({ n, icon, title, text }) { return <div className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-green-900/5"><span className="absolute right-6 top-4 font-display text-5xl font-black text-green-100">{n}</span><span className="grid size-12 place-items-center rounded-xl bg-green-800 text-white"><FontAwesomeIcon icon={icon} /></span><h3 className="mt-6 font-display text-2xl font-bold text-green-950">{title}</h3><p className="mt-3 text-sm leading-6 text-stone-500">{text}</p></div> }
