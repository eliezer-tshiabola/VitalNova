import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLock, faPen } from '@fortawesome/free-solid-svg-icons'
import { getProductReviews, getReviewSummary } from '../data/reviews'
import { RatingStars } from './RatingStars'
import { buttonVariants } from './ui/button'
import { cn } from '../lib/utils'

export function ProductReviews({ productId }) {
  const productReviews = useMemo(() => getProductReviews(productId), [productId])
  const summary = getReviewSummary(productReviews)
  const [filter, setFilter] = useState('all')
  const displayedReviews = filter === 'all' ? productReviews : productReviews.filter(review => review.rating === Number(filter))

  return <section className="container-main pb-20" aria-labelledby="product-reviews-title">
    <div className="rounded-2xl border border-green-900/10 bg-white p-5 shadow-sm sm:p-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><span className="eyebrow">Avis clients</span><h2 id="product-reviews-title" className="mt-3">Ce qu’en pensent nos clients</h2></div>
        <span className="rounded-full bg-gold-50 px-4 py-2 text-xs font-bold text-gold-800">Aperçu avec données de démonstration</span>
      </div>

      <div className="mt-8 grid gap-8 border-y border-stone-200 py-8 lg:grid-cols-[.65fr_1.35fr]">
        <div className="flex items-center gap-5 lg:border-r lg:border-stone-200">
          <strong className="font-display text-6xl text-green-950">{summary.average ? summary.average.toFixed(1) : '—'}</strong>
          <div><RatingStars rating={summary.average} size="text-lg" /><p className="mt-2 text-sm text-stone-500">{summary.count} avis vérifié{summary.count > 1 ? 's' : ''}</p></div>
        </div>
        <div className="grid gap-2.5">
          {summary.distribution.map(item => <button key={item.star} onClick={() => setFilter(String(item.star))} className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3 text-sm" aria-label={`Afficher les avis ${item.star} étoiles`}>
            <span className="font-bold text-stone-600">{item.star} ★</span><span className="h-2 overflow-hidden rounded-full bg-stone-100"><span className="block h-full rounded-full bg-gold-400" style={{ width: `${summary.count ? (item.count / summary.count) * 100 : 0}%` }} /></span><span className="text-right text-stone-400">{item.count}</span>
          </button>)}
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setFilter('all')} className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${filter === 'all' ? 'bg-green-800 text-white' : 'bg-stone-100 text-stone-600'}`}>Tous ({summary.count})</button>
        {[5, 4, 3].map(star => <button key={star} onClick={() => setFilter(String(star))} className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${filter === String(star) ? 'bg-green-800 text-white' : 'bg-stone-100 text-stone-600'}`}>{star} étoiles</button>)}
      </div>

      <div className="mt-5 divide-y divide-stone-200">
        {displayedReviews.map(review => <article key={review.id} className="py-6 first:pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3"><RatingStars rating={review.rating} /><time className="text-xs text-stone-400" dateTime={review.date}>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(review.date))}</time></div>
          <h3 className="mt-3 font-bold text-green-950">{review.title}</h3><p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">« {review.comment} »</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs"><strong className="text-green-900">{review.author} · {review.location}</strong>{review.demo ? <span className="font-bold text-gold-700">Avis de démonstration</span> : review.verifiedPurchase && <span className="font-bold text-green-700"><FontAwesomeIcon icon={faCheck} className="mr-1" />Achat vérifié</span>}</div>
        </article>)}
        {displayedReviews.length === 0 && <p className="py-8 text-sm text-stone-500">Aucun avis ne correspond à ce filtre.</p>}
      </div>

      <div className="mt-5 rounded-xl bg-green-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7">
        <div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-green-800"><FontAwesomeIcon icon={faLock} /></span><div><h3 className="font-bold text-green-950">Vous avez reçu ce produit ?</h3><p className="mt-1 max-w-xl text-sm leading-6 text-stone-600">L’évaluation devient disponible dans votre compte après confirmation de la livraison. Un seul avis est autorisé par produit livré.</p></div></div>
        <Link to="/compte" className={cn(buttonVariants({ variant: 'secondary' }), 'mt-5 shrink-0 sm:mt-0')}><FontAwesomeIcon icon={faPen} />Évaluer mon achat</Link>
      </div>
    </div>
  </section>
}
