import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash, faXmark, faBagShopping } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { useStore } from '../context/StoreContext'
import { Button } from './ui/button'
import { CheckoutDialog } from './CheckoutDialog'
import { getProductDelivery } from '../utils/pricing'

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartDetails, subtotal, deliverySummary, orderTotal, updateQuantity, removeFromCart } = useStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  return <>
    <DialogPrimitive.Root open={cartOpen} onOpenChange={setCartOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-green-950/55 backdrop-blur-[2px]" />
        <DialogPrimitive.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5"><div><DialogPrimitive.Title className="font-display text-2xl font-bold text-green-950">Votre panier</DialogPrimitive.Title><DialogPrimitive.Description className="text-xs text-stone-500">Les articles restent enregistrés sur cet appareil.</DialogPrimitive.Description></div><DialogPrimitive.Close className="grid size-10 place-items-center rounded-full bg-stone-100" aria-label="Fermer"><FontAwesomeIcon icon={faXmark} /></DialogPrimitive.Close></div>
          {cartDetails.length === 0 ? <div className="grid flex-1 place-items-center p-8 text-center"><div><FontAwesomeIcon icon={faBagShopping} className="text-4xl text-green-200" /><h3 className="mt-4 font-display text-xl font-bold text-green-950">Votre panier est vide</h3><p className="mt-2 text-sm text-stone-500">Ajoutez un produit pour commencer votre commande.</p><Button className="mt-5" onClick={() => setCartOpen(false)}>Continuer mes achats</Button></div></div> : <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">{cartDetails.map(item => <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />)}</div>
            <div className="border-t border-stone-200 bg-ivory-50 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><div className="grid gap-2 text-sm"><div className="flex justify-between font-bold text-green-950"><span>Sous-total</span><span>{subtotal.toFixed(2)} $</span></div><div className="flex justify-between font-bold text-green-800"><span>Livraison estimée</span><span>{deliverySummary.configured ? deliverySummary.free ? 'Gratuite' : `${deliverySummary.fee.toFixed(2)} $` : 'À confirmer'}</span></div><div className="mt-1 flex justify-between border-t border-stone-200 pt-3 text-base font-black text-green-950"><span>Total estimé</span><span className="text-xl">{Number.isFinite(orderTotal) ? `${orderTotal.toFixed(2)} $` : 'À confirmer'}</span></div></div><p className="mt-2 text-[11px] leading-5 text-stone-500">Tarifs de démonstration calculés selon la quantité de chaque produit. Notre équipe confirme le montant final.</p><Button size="lg" className="mt-4 w-full" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}><FontAwesomeIcon icon={faWhatsapp} className="text-xl" />Commander sur WhatsApp</Button></div>
          </>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
    <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
  </>
}

function CartItem({ item, updateQuantity, removeFromCart }) {
  const delivery = getProductDelivery(item, item.quantity)
  return <div className="flex gap-4 rounded-xl border border-stone-200 p-3"><img src={item.image} alt="" className="size-20 rounded-lg object-cover" /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-green-950">{item.name}</h3><div className="mt-1 flex items-center gap-2"><p className="text-sm font-black text-green-800">{item.unitPrice.toFixed(2)} $ / pièce</p>{item.discountPercent > 0 && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800">−{item.discountPercent} %</span>}</div>{item.savings > 0 && <p className="mt-1 text-[11px] font-bold text-green-700">Économie : {item.savings.toFixed(2)} $</p>}<p className={`mt-1 text-[11px] font-bold ${delivery.free ? 'text-green-700' : 'text-stone-500'}`}>{delivery.label}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-lg border border-stone-200"><button aria-label="Diminuer" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="size-8"><FontAwesomeIcon icon={faMinus} className="text-xs" /></button><span className="w-7 text-center text-sm font-bold">{item.quantity}</span><button aria-label="Augmenter" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="size-8"><FontAwesomeIcon icon={faPlus} className="text-xs" /></button></div><strong className="text-sm text-green-950">{item.lineTotal.toFixed(2)} $</strong><button onClick={() => removeFromCart(item.id)} aria-label="Supprimer" className="size-8 text-red-600"><FontAwesomeIcon icon={faTrash} /></button></div></div></div>
}
