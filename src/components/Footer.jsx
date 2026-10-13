import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLeaf, faLocationDot, faShieldHeart } from '@fortawesome/free-solid-svg-icons'
import { Logo } from './Logo'

export function Footer() {
  return <footer className="mt-20 bg-green-950 pb-28 pt-14 text-green-50 md:pb-10">
    <div className="container-main grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><div className="inline-block rounded-2xl bg-white px-3 py-2"><Logo compact /></div><p className="mt-5 max-w-sm text-sm leading-7 text-green-100/75">Des produits de bien-être, d’hygiène et des accessoires choisis pour simplifier votre quotidien.</p></div>
      <div><h3 className="font-display text-lg font-bold">Explorer</h3><div className="mt-4 grid gap-3 text-sm text-green-100/75"><Link to="/boutique">La boutique</Link><Link to="/contact">Nous contacter</Link><Link to="/compte">Mon compte</Link></div></div>
      <div><h3 className="font-display text-lg font-bold">Nos engagements</h3><div className="mt-4 grid gap-3 text-sm text-green-100/75"><p><FontAwesomeIcon icon={faLocationDot} className="mr-2 text-gold-400" />Livraison organisée avec vous</p><p><FontAwesomeIcon icon={faShieldHeart} className="mr-2 text-gold-400" />Commande vérifiée par l’équipe</p><p><FontAwesomeIcon icon={faLeaf} className="mr-2 text-gold-400" />Sélection attentive</p></div></div>
    </div>
    <div className="container-main mt-10 border-t border-white/10 pt-6 text-xs text-green-100/60">© {new Date().getFullYear()} VitalNova. Tous droits réservés. · Données produits de démonstration à valider.</div>
  </footer>
}
