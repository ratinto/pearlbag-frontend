import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  SHIPPING_COST,
  TAX_RATE,
  handbags,
} from './data/handbags'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import FaqPage from './pages/FaqPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'
import WishlistPage from './pages/WishlistPage'

const STORAGE_KEY = 'pearlbag.cart'
const WISHLIST_KEY = 'pearlbag.wishlist'
const RECENT_KEY = 'pearlbag.recent'

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function App() {
  const [cart, setCart] = useState(() => {
    const v = loadJson(STORAGE_KEY, {})
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {}
  })
  const [wishlist, setWishlist] = useState(() => {
    const v = loadJson(WISHLIST_KEY, [])
    return Array.isArray(v) ? v : []
  })
  const [recent, setRecent] = useState(() => {
    const v = loadJson(RECENT_KEY, [])
    return Array.isArray(v) ? v : []
  })
  const [promo, setPromo] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      /* ignore persistence errors */
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch {
      /* ignore persistence errors */
    }
  }, [wishlist])

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
    } catch {
      /* ignore persistence errors */
    }
  }, [recent])

  const showToast = useCallback((message) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const addToCart = useCallback(
    (id) => {
      setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
      const bag = handbags.find((b) => b.id === id)
      if (bag) showToast(`${bag.name} added to your bag`)
    },
    [showToast],
  )

  const removeFromCart = useCallback((id) => {
    setCart((current) => {
      const quantity = current[id] ?? 0
      if (quantity <= 1) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity - 1 }
    })
  }, [])

  const removeAll = useCallback((id) => {
    setCart((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({})
    setPromo(null)
  }, [])

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((current) => {
        if (current.includes(id)) {
          const bag = handbags.find((b) => b.id === id)
          if (bag) showToast(`${bag.name} removed from wishlist`)
          return current.filter((x) => x !== id)
        }
        const bag = handbags.find((b) => b.id === id)
        if (bag) showToast(`${bag.name} saved to wishlist`)
        return [...current, id]
      })
    },
    [showToast],
  )

  const trackView = useCallback((id) => {
    setRecent((current) => {
      const next = [id, ...current.filter((x) => x !== id)]
      return next.slice(0, 8)
    })
  }, [])

  const applyPromo = useCallback(
    (code) => {
      const key = String(code || '').trim().toUpperCase()
      if (!key) return { ok: false, message: 'Enter a promo code.' }
      const found = PROMO_CODES[key]
      if (!found) return { ok: false, message: 'That code is not valid.' }
      setPromo({ code: key, ...found })
      showToast(`Promo applied: ${found.label}`)
      return { ok: true, message: found.label }
    },
    [showToast],
  )

  const clearPromo = useCallback(() => setPromo(null), [])

  const cartItems = useMemo(
    () => handbags.filter((bag) => (cart[bag.id] ?? 0) > 0),
    [cart],
  )

  const wishlistItems = useMemo(
    () => handbags.filter((bag) => wishlist.includes(bag.id)),
    [wishlist],
  )

  const recentItems = useMemo(
    () =>
      recent
        .map((id) => handbags.find((b) => b.id === id))
        .filter(Boolean),
    [recent],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, bag) => sum + bag.price * cart[bag.id], 0),
    [cart, cartItems],
  )

  const promoDiscount = useMemo(() => {
    if (!promo || subtotal === 0) return 0
    if (promo.type === 'percent') {
      return Math.round((subtotal * promo.value) / 100)
    }
    if (promo.type === 'fixed') {
      if (promo.min && subtotal < promo.min) return 0
      return Math.min(promo.value, subtotal)
    }
    return 0
  }, [promo, subtotal])

  const discountedSubtotal = Math.max(0, subtotal - promoDiscount)

  const shippingFree =
    cartItems.length === 0 ||
    discountedSubtotal >= FREE_SHIPPING_THRESHOLD ||
    (promo && promo.type === 'shipping')

  const shipping = shippingFree ? 0 : SHIPPING_COST
  const tax = Math.round(discountedSubtotal * TAX_RATE)
  const total = discountedSubtotal + shipping + tax

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart],
  )

  return (
    <BrowserRouter>
      <Layout
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        cartItems={cartItems}
        cart={cart}
        subtotal={subtotal}
        toast={toast}
        onRemoveAll={removeAll}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                featuredBags={handbags.slice(0, 4)}
                recentItems={recentItems}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                handbags={handbags}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route
            path="/shop/:id"
            element={
              <ProductPage
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                onTrackView={trackView}
                wishlist={wishlist}
                recentItems={recentItems}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                items={wishlistItems}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onRemoveAll={removeAll}
                shipping={shipping}
                subtotal={subtotal}
                tax={tax}
                total={total}
                promo={promo}
                promoDiscount={promoDiscount}
                onApplyPromo={applyPromo}
                onClearPromo={clearPromo}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                cartItems={cartItems}
                shipping={shipping}
                subtotal={subtotal}
                tax={tax}
                total={total}
                promo={promo}
                promoDiscount={promoDiscount}
                onApplyPromo={applyPromo}
                onClearPromo={clearPromo}
                onClearCart={clearCart}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
