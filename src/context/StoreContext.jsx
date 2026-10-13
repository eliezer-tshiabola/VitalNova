import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { products } from '../data/products'
import { calculateCartDelivery, calculateProductPrice } from '../utils/pricing'

const StoreContext = createContext(null)

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => readStorage('vitalnova-cart', []))
  const [favorites, setFavorites] = useState(() => readStorage('vitalnova-favorites', []))
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => { localStorage.setItem('vitalnova-cart', JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem('vitalnova-favorites', JSON.stringify(favorites)) }, [favorites])

  const addToCart = (id, quantity = 1) => {
    setCart(current => {
      const found = current.find(item => item.id === id)
      return found ? current.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { id, quantity }]
    })
    setCartOpen(true)
  }
  const updateQuantity = (id, quantity) => setCart(current => quantity < 1 ? current.filter(item => item.id !== id) : current.map(item => item.id === id ? { ...item, quantity } : item))
  const removeFromCart = id => setCart(current => current.filter(item => item.id !== id))
  const toggleFavorite = id => setFavorites(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id])

  const cartDetails = useMemo(() => cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id)
    return product ? { ...product, quantity: item.quantity, ...calculateProductPrice(product, item.quantity) } : null
  }).filter(Boolean), [cart])
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartDetails.reduce((total, item) => total + item.lineTotal, 0)
  const deliverySummary = useMemo(() => calculateCartDelivery(cartDetails), [cartDetails])
  const orderTotal = deliverySummary.configured ? subtotal + deliverySummary.fee : null

  return <StoreContext.Provider value={{ cart, cartDetails, cartCount, subtotal, deliverySummary, orderTotal, favorites, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, toggleFavorite }}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
