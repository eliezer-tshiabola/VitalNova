import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'

export function RatingStars({ rating, size = 'text-sm', label }) {
  const roundedRating = Math.round(rating)

  return <span className={`inline-flex items-center gap-1 text-gold-500 ${size}`} aria-label={label || `${rating.toFixed(1)} étoiles sur 5`}>
    {[1, 2, 3, 4, 5].map(star => <FontAwesomeIcon key={star} icon={star <= roundedRating ? faStar : faStarRegular} aria-hidden="true" />)}
  </span>
}

