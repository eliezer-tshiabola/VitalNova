export const reviews = [
  {
    id: 'avis-ginseng-1',
    productId: 'the-ginseng-cinq-tresors',
    rating: 5,
    title: 'Une belle découverte',
    comment: 'Le produit est arrivé bien emballé et la confirmation sur WhatsApp était très claire. J’apprécie particulièrement le goût de cette infusion.',
    author: 'Marie K.',
    location: 'Kinshasa',
    date: '2026-09-18',
    verifiedPurchase: true,
    demo: true,
  },
  {
    id: 'avis-dentifrice-1',
    productId: 'dentifrice-repair',
    rating: 4,
    title: 'Service rassurant',
    comment: 'Commande simple, équipe disponible et paiement à la livraison très pratique. Le produit correspond bien à la présentation.',
    author: 'Patrick M.',
    location: 'Lubumbashi',
    date: '2026-09-07',
    verifiedPurchase: true,
    demo: true,
  },
  {
    id: 'avis-bracelet-noir-1',
    productId: 'bracelet-magnetique-noir',
    rating: 5,
    title: 'Très belle finition',
    comment: 'Le bracelet est sobre et agréable à porter. La livraison a été confirmée rapidement et tout s’est bien passé.',
    author: 'David T.',
    location: 'Kinshasa',
    date: '2026-08-29',
    verifiedPurchase: true,
    demo: true,
  },
  {
    id: 'avis-ginseng-2',
    productId: 'the-ginseng-cinq-tresors',
    rating: 4,
    title: 'Bonne expérience',
    comment: 'J’ai reçu ma commande dans de bonnes conditions. Les informations données avant la livraison étaient utiles.',
    author: 'Clarisse N.',
    location: 'Matadi',
    date: '2026-08-15',
    verifiedPurchase: true,
    demo: true,
  },
]

export const getProductReviews = productId => reviews.filter(review => review.productId === productId)

export const getReviewSummary = productReviews => {
  const count = productReviews.length
  const average = count ? productReviews.reduce((total, review) => total + review.rating, 0) / count : 0
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: productReviews.filter(review => review.rating === star).length,
  }))

  return { count, average, distribution }
}
