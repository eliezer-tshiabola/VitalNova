import { STORE_CONFIG } from '../config/store'

export function createOrderMessage(customer, items, subtotal, deliverySummary, orderTotal) {
  const address = [customer.address, customer.district, customer.city, customer.province].filter(Boolean).join(', ')
  const lines = items.map((item, index) => {
    const delivery = deliverySummary?.lines?.[index]
    const deliveryText = delivery?.configured ? delivery.free ? 'livraison gratuite' : `livraison ${delivery.fee.toFixed(2)} $` : 'livraison à confirmer'
    return `• ${item.name} — ${item.quantity} × ${(item.unitPrice ?? item.price).toFixed(2)} $${item.discountPercent ? ` (-${item.discountPercent} %)` : ''} = ${(item.lineTotal ?? item.quantity * item.price).toFixed(2)} $ · ${deliveryText}`
  })
  const deliveryLabel = deliverySummary?.configured ? deliverySummary.free ? 'Gratuite' : `${deliverySummary.fee.toFixed(2)} $` : 'À confirmer'
  const estimatedTotal = Number.isFinite(orderTotal) ? `${orderTotal.toFixed(2)} $` : 'À confirmer'
  return [
    'Bonjour VitalNova, je souhaite demander cette commande :', '',
    `Client : ${customer.fullName}`, `Téléphone : ${customer.phone}`, `Livraison : ${address}`, '',
    'Produits :', ...lines, '', `Sous-total : ${subtotal.toFixed(2)} $`,
    `Frais de livraison estimés : ${deliveryLabel}`, `Total estimé : ${estimatedTotal}`,
    customer.instructions ? `Instructions : ${customer.instructions}` : '', '',
    'Merci de me confirmer la disponibilité, les frais de livraison définitifs et les modalités de la commande.',
  ].filter(line => line !== '').join('\n')
}

export function buildWhatsAppUrl(message) {
  if (!STORE_CONFIG.whatsappNumber) return null
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`
}
