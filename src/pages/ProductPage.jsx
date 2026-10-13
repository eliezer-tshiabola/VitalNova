import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBagShopping, faBolt, faCheck, faHeart as heartSolid, faMinus, faPlay, faPlus, faShieldHeart, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartRegular } from '@fortawesome/free-regular-svg-icons'
import { products } from '../data/products'
import { useStore } from '../context/StoreContext'
import { calculateProductPrice, getProductDelivery } from '../utils/pricing'
import { Button } from '../components/ui/button'
import { ProductCard } from '../components/ProductCard'
import { ProductReviews } from '../components/ProductReviews'

export function ProductPage() {
  const { productId } = useParams()
  const product = products.find(item => item.id === productId)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addToCart, favorites, toggleFavorite } = useStore()

  const gallery = useMemo(() => product ? [product.image, ...(product.gallery || [])] : [], [product])
  useEffect(() => {
    document.title = product ? `${product.name} — VitalNova` : 'Produit introuvable — VitalNova'
    return () => { document.title = 'VitalNova — Votre bien-être, notre priorité' }
  }, [product])
  if (!product) return <NotFoundProduct />

  const pricing = calculateProductPrice(product, quantity)
  const favorite = favorites.includes(product.id)
  const related = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 3)
  const bestDiscount = Math.max(0, ...(product.discounts || []).map(offer => offer.percent))
  const changeQuantity = next => setQuantity(Math.max(1, Math.min(99, Number(next) || 1)))

  return <main className="pb-10">
    <div className="container-main py-5 text-sm text-stone-500">
      <Link to="/boutique" className="inline-flex items-center gap-2 font-bold text-green-800 hover:text-green-950"><FontAwesomeIcon icon={faArrowLeft} /> Retour à la boutique</Link>
    </div>

    <section className="container-main grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
      <div>
        <div className="overflow-hidden rounded-2xl border border-green-900/10 bg-stone-100">
          <img src={gallery[selectedImage]} alt={`${product.name} — vue ${selectedImage + 1}`} className="aspect-[4/4.4] w-full object-cover" />
        </div>
        {gallery.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto pb-2">{gallery.map((image, index) => <button key={image} onClick={() => setSelectedImage(index)} aria-label={`Afficher la vue ${index + 1}`} className={`shrink-0 overflow-hidden rounded-2xl border-2 ${selectedImage === index ? 'border-green-700' : 'border-transparent'}`}><img src={image} alt="" className="size-20 object-cover sm:size-24" /></button>)}</div>}
      </div>

      <div className="lg:py-3">
        <div className="flex items-center justify-between gap-4"><span className="eyebrow">{product.categoryLabel}</span><button onClick={() => toggleFavorite(product.id)} className="grid size-11 place-items-center rounded-full border border-green-200 text-green-800" aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}><FontAwesomeIcon icon={favorite ? heartSolid : heartRegular} /></button></div>
        <h1 className="mt-5 text-[clamp(2.35rem,5vw,4.25rem)]">{product.name}</h1>
        <p className="mt-5 text-base leading-7 text-stone-600">{product.short}</p>
        {product.demo && <div className="mt-5 rounded-2xl border border-gold-200 bg-gold-50 p-4 text-sm leading-6 text-gold-900"><strong>Données de démonstration :</strong> le prix et les caractéristiques seront confirmés avant publication.</div>}

        <div className="mt-7 flex items-end gap-3"><div><span className="text-xs font-bold uppercase tracking-wide text-stone-500">Prix unitaire</span><p className="text-3xl font-black text-green-900">{pricing.unitPrice.toFixed(2)} $</p></div>{pricing.discountPercent > 0 && <><span className="mb-1 rounded-full bg-gold-400 px-3 py-1 text-xs font-black text-green-950">−{pricing.discountPercent} %</span><span className="mb-1 text-sm text-stone-400 line-through">{product.price.toFixed(2)} $</span></>}</div>

        <div className="mt-8 rounded-2xl border border-green-700/30 bg-green-50/70 p-3 sm:p-4">
          <div className="flex items-center gap-3 px-1 pb-3"><span className="grid size-10 place-items-center rounded-full bg-green-100 text-green-800"><FontAwesomeIcon icon={faBagShopping} /></span><div><h2 className="font-sans text-base font-black tracking-normal">Choisissez votre offre</h2><p className="mt-0.5 text-xs text-stone-500">Plus vous commandez, plus vous économisez</p></div></div>
          <div className="grid gap-3">
            <OfferButton product={product} quantity={1} active={quantity === 1} label="1 pièce" detail="Prix standard" onClick={() => setQuantity(1)} />
            {(product.discounts || []).map(offer => <OfferButton key={offer.quantity} product={product} quantity={offer.quantity} percent={offer.percent} active={quantity === offer.quantity} label={offer.label || `${offer.quantity} pièces`} detail={offer.quantity === 2 ? 'Idéal pour commencer' : 'Économisez davantage'} best={offer.percent === bestDiscount} onClick={() => setQuantity(offer.quantity)} />)}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-green-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div><span className="text-xs font-bold text-stone-500">Quantité</span><div className="mt-2 flex w-fit items-center rounded-full border border-stone-300"><button onClick={() => changeQuantity(quantity - 1)} className="size-11" aria-label="Diminuer la quantité"><FontAwesomeIcon icon={faMinus} /></button><input value={quantity} onChange={event => changeQuantity(event.target.value)} className="w-12 bg-transparent text-center font-black outline-none" inputMode="numeric" aria-label="Quantité" /><button onClick={() => changeQuantity(quantity + 1)} className="size-11" aria-label="Augmenter la quantité"><FontAwesomeIcon icon={faPlus} /></button></div></div>
            <div className="text-right"><span className="text-xs font-bold text-stone-500">Total produit</span><p className="mt-1 text-2xl font-black text-green-950">{pricing.lineTotal.toFixed(2)} $</p>{pricing.savings > 0 && <p className="text-xs font-bold text-green-700">Vous économisez {pricing.savings.toFixed(2)} $</p>}</div>
          </div>
          <Button size="lg" className="mt-5 w-full" onClick={() => addToCart(product.id, quantity)}><FontAwesomeIcon icon={faBagShopping} />Ajouter {quantity} au panier</Button>
        </div>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2"><Reassurance icon={faTruckFast} text="Livraison organisée avec vous" /><Reassurance icon={faShieldHeart} text="Paiement à la livraison" /></div>
      </div>
    </section>

    <section className="container-main section-space grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
      <article className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-9"><span className="eyebrow">Informations</span><h2 className="mt-4">Tout savoir sur ce produit</h2><p className="mt-5 leading-8 text-stone-600">{product.description}</p><div className="mt-7 divide-y divide-stone-200">{(product.specifications || []).map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[.45fr_1fr]"><span className="text-sm font-bold text-green-950">{label}</span><span className="text-sm text-stone-600">{value}</span></div>)}</div></article>
      <article className="overflow-hidden rounded-2xl bg-green-950 text-white">{product.videoUrl ? <video className="aspect-video w-full bg-black object-cover" controls poster={product.image}><source src={product.videoUrl} />Votre navigateur ne peut pas lire cette vidéo.</video> : <div className="grid min-h-72 place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-400 text-xl text-green-950"><FontAwesomeIcon icon={faPlay} /></span><h2 className="mt-6 text-2xl text-white">Vidéo explicative</h2><p className="mt-3 max-w-sm text-sm leading-6 text-green-100/70">La vidéo officielle de ce produit sera affichée ici dès qu’elle sera ajoutée au catalogue.</p></div></div>}</article>
    </section>

    <ProductReviews productId={product.id} />

    {related.length > 0 && <section className="container-main pb-16"><div className="section-heading"><div><span className="eyebrow">À découvrir aussi</span><h2>Produits similaires</h2></div><Link to={`/boutique?categorie=${product.category}`} className="text-link">Voir la catégorie</Link></div><div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-6 lg:grid-cols-3">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
  </main>
}

function OfferButton({ product, quantity, percent = 0, active, label, detail, best, onClick }) {
  const offerPrice = calculateProductPrice(product, quantity)
  const delivery = getProductDelivery(product, quantity)
  const regularTotal = product.price * quantity

  return <button type="button" onClick={onClick} aria-pressed={active} className={`relative overflow-hidden rounded-xl border-2 text-left transition ${active ? 'border-green-700 bg-white shadow-md shadow-green-900/10 ring-2 ring-green-200' : 'border-white bg-white hover:border-green-300'}`}>
    {best && <span className="flex items-center justify-center gap-2 bg-gold-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.08em] text-green-950"><FontAwesomeIcon icon={faBolt} />Meilleure offre · économies maximales</span>}
    <span className="grid grid-cols-[3.6rem_1fr_auto] items-center gap-3 p-3 sm:grid-cols-[4.25rem_1fr_auto] sm:p-4">
      <span className="overflow-hidden rounded-xl border border-stone-100 bg-ivory-50"><img src={product.image} alt="" className="aspect-square w-full object-cover" /></span>
      <span className="min-w-0"><span className="flex flex-wrap items-center gap-2"><strong className="text-sm text-green-950 sm:text-base">{label}</strong>{percent > 0 && <span className="rounded-full bg-gold-100 px-2 py-1 text-[10px] font-black text-gold-800">−{percent} %</span>}</span><span className="mt-1 block text-xs text-stone-500">{detail}</span>{offerPrice.savings > 0 && <span className="mt-1 block text-[11px] font-bold text-green-700">Économisez {offerPrice.savings.toFixed(2)} $</span>}<span className={`mt-1 block text-[10px] font-bold ${delivery.free ? 'text-green-700' : 'text-stone-500'}`}>{delivery.label}</span></span>
      <span className={`text-right ${active ? 'pr-5' : ''}`}><span className="block text-base font-black text-green-900 sm:text-lg">{offerPrice.lineTotal.toFixed(2)} $</span>{percent > 0 && <span className="block text-[11px] text-stone-400 line-through">{regularTotal.toFixed(2)} $</span>}<span className="mt-1 block text-[10px] text-stone-500">{offerPrice.unitPrice.toFixed(2)} $ / unité</span></span>
    </span>
    {active && <span className={`absolute right-2 grid size-6 place-items-center rounded-full bg-green-800 text-[10px] text-white shadow-sm ${best ? 'top-9' : 'top-2'}`} aria-hidden="true"><FontAwesomeIcon icon={faCheck} /></span>}
  </button>
}

function Reassurance({ icon, text }) { return <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-bold text-green-900"><FontAwesomeIcon icon={icon} /><span>{text}</span></div> }

function NotFoundProduct() { return <main className="container-main py-24 text-center"><h1>Produit introuvable</h1><p className="mt-4 text-stone-600">Cette fiche produit n’existe pas ou n’est plus disponible.</p><Link to="/boutique" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-green-800 px-6 font-bold text-white">Retour à la boutique</Link></main> }
