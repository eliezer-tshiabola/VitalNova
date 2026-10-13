import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { StoreProvider } from './context/StoreContext'
import { Header } from './components/Header'
import { MobileNav } from './components/MobileNav'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ContactPage } from './pages/ContactPage'
import { AccountPage } from './pages/AccountPage'
import { ProductPage } from './pages/ProductPage'
import { CategoriesPage } from './pages/CategoriesPage'

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname]); return null }

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><StoreProvider><ScrollToTop /><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/categories" element={<CategoriesPage />} /><Route path="/boutique" element={<ShopPage />} /><Route path="/produit/:productId" element={<ProductPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/compte" element={<AccountPage />} /><Route path="*" element={<HomePage />} /></Routes><Footer /><MobileNav /><CartDrawer /></StoreProvider></BrowserRouter>
}
