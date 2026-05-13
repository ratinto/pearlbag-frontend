import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  TAX_RATE,
} from './data/handbags'
import { api } from './lib/api'
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
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState(null)

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
    let cancelled = false
    setProductsLoading(true)
    api.products
      .list()
      .then((list) => {
        if (cancelled) return
        setProducts(list)
        setProductsError(null)
      })
      .catch((err) => {
        if (cancelled) return
        setProductsError(err.message || 'Failed to load products')
      })
      .finally(() => {
        if (!cancelled) setProductsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
      const bag = products.find((b) => b.id === id)
      if (bag) showToast(`${bag.name} added to your bag`)
    },
    [products, showToast],
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
        const bag = products.find((b) => b.id === id)
        if (current.includes(id)) {
          if (bag) showToast(`${bag.name} removed from wishlist`)
          return current.filter((x) => x !== id)
        }
        if (bag) showToast(`${bag.name} saved to wishlist`)
        return [...current, id]
      })
    },
    [products, showToast],
  )

  const trackView = useCallback((id) => {
    setRecent((current) => {
      const next = [id, ...current.filter((x) => x !== id)]
      return next.slice(0, 8)
    })
  }, [])

  const cartItems = useMemo(
    () => products.filter((bag) => (cart[bag.id] ?? 0) > 0),
    [cart, products],
  )

  const wishlistItems = useMemo(
    () => products.filter((bag) => wishlist.includes(bag.id)),
    [wishlist, products],
  )

  const recentItems = useMemo(
    () =>
      recent
        .map((id) => products.find((b) => b.id === id))
        .filter(Boolean),
    [recent, products],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, bag) => sum + Number(bag.price) * cart[bag.id], 0),
    [cart, cartItems],
  )

  const applyPromo = useCallback(
    async (code) => {
      const key = String(code || '').trim().toUpperCase()
      if (!key) return { ok: false, message: 'Enter a promo code.' }
      try {
        const res = await api.promo.validate(key, subtotal)
        if (!res.ok || !res.promo) {
          return { ok: false, message: res.message || 'That code is not valid.' }
        }
        setPromo({ ...res.promo, code: res.promo.code })
        showToast(`Promo applied: ${res.promo.label}`)
        return { ok: true, message: res.promo.label }
      } catch (err) {
        return { ok: false, message: err.message || 'Could not validate code.' }
      }
    },
    [subtotal, showToast],
  )

  const clearPromo = useCallback(() => setPromo(null), [])

  const promoDiscount = useMemo(() => {
    if (!promo || subtotal === 0) return 0
    const minOrder = Number(promo.minOrder ?? 0)
    if (minOrder > 0 && subtotal < minOrder) return 0
    if (promo.type === 'percent') {
      return Math.round((subtotal * Number(promo.value)) / 100)
    }
    if (promo.type === 'fixed') {
      return Math.min(Number(promo.value), subtotal)
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

  const featuredBags = useMemo(() => products.slice(0, 4), [products])

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
        onShowToast={showToast}
      >
        {productsError ? (
          <div className="page" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <h2>We couldn't load the collection</h2>
            <p className="muted">{productsError}</p>
            <p className="muted small">
              Make sure the backend is running at <code>{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</code>.
            </p>
          </div>
        ) : productsLoading && products.length === 0 ? (
          <div className="page" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <p className="muted">Loading…</p>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  featuredBags={featuredBags}
                  recentItems={recentItems}
                  onAddToCart={addToCart}
                  onToggleWishlist={toggleWishlist}
                  wishlist={wishlist}
                  onShowToast={showToast}
                />
              }
            />
            <Route
              path="/shop"
              element={
                <ShopPage
                  handbags={products}
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
                  products={products}
                  onShowToast={showToast}
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
            <Route path="/faq" element={<FaqPage onShowToast={showToast} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  )
}

export default App
