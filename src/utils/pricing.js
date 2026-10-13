export function getDiscountForQuantity(product, quantity) {
  const tiers = [...(product.discounts || [])].sort((a, b) => a.quantity - b.quantity)
  return tiers.reduce((best, tier) => quantity >= tier.quantity ? tier : best, null)
}

export function calculateProductPrice(product, quantity) {
  const tier = getDiscountForQuantity(product, quantity)
  const discountPercent = tier?.percent || 0
  const unitPrice = product.price * (1 - discountPercent / 100)
  const lineTotal = unitPrice * quantity
  const savings = product.price * quantity - lineTotal
  return { tier, discountPercent, unitPrice, lineTotal, savings }
}

export function getProductDelivery(product, quantity) {
  const rule = (product.deliveryRules || []).find(item => quantity >= item.minQuantity && (!item.maxQuantity || quantity <= item.maxQuantity))
  if (!rule) return { configured: false, fee: null, free: false, label: 'Frais à confirmer' }
  const fee = Number(rule.fee)
  return {
    configured: Number.isFinite(fee),
    fee: Number.isFinite(fee) ? fee : null,
    free: fee === 0,
    label: rule.label || (fee === 0 ? 'Livraison gratuite' : `Livraison : ${fee.toFixed(2)} $`),
  }
}

export function calculateCartDelivery(items) {
  const lines = items.map(item => ({ id: item.id, quantity: item.quantity, ...getProductDelivery(item, item.quantity) }))
  const configured = lines.every(line => line.configured)
  const fee = configured ? lines.reduce((total, line) => total + line.fee, 0) : null
  return { configured, fee, free: configured && fee === 0, lines }
}
