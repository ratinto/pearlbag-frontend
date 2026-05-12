import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST, handbags } from './data/handbags'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ShopPage from './pages/ShopPage'

const STORAGE_KEY = 'pearlbag.cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function App() {
  const [cart, setCart] = useState(loadCart)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      /* ignore persistence errors */
    }
  }, [cart])

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

  const clearCart = useCallback(() => setCart({}), [])

  const cartItems = useMemo(
    () => handbags.filter((bag) => (cart[bag.id] ?? 0) > 0),
    [cart],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, bag) => sum + bag.price * cart[bag.id], 0),
    [cart, cartItems],
  )

  const shipping =
    cartItems.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart],
  )

  return (
    <BrowserRouter>
      <Layout cartCount={cartCount} toast={toast}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                featuredBags={handbags.slice(0, 4)}
                onAddToCart={addToCart}
              />
            }
          />
          <Route
            path="/shop"
            element={<ShopPage handbags={handbags} onAddToCart={addToCart} />}
          />
          <Route
            path="/shop/:id"
            element={<ProductPage onAddToCart={addToCart} />}
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
                total={total}
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
                total={total}
                onClearCart={clearCart}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
