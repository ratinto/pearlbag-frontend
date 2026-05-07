import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { SHIPPING_COST, handbags } from './data/handbags'
import AboutPage from './pages/AboutPage'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'

function App() {
  const [cart, setCart] = useState({})

  const addToCart = (id) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }

  const removeFromCart = (id) => {
    setCart((current) => {
      const quantity = current[id] ?? 0
      if (quantity <= 1) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: quantity - 1 }
    })
  }

  const cartItems = useMemo(
    () => handbags.filter((bag) => (cart[bag.id] ?? 0) > 0),
    [cart],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, bag) => sum + bag.price * cart[bag.id], 0),
    [cart, cartItems],
  )

  const shipping = cartItems.length > 0 ? SHIPPING_COST : 0
  const total = subtotal + shipping

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0),
    [cart],
  )

  return (
    <BrowserRouter>
      <Layout cartCount={cartCount}>
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
            path="/cart"
            element={
              <CartPage
                cart={cart}
                cartItems={cartItems}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                shipping={shipping}
                subtotal={subtotal}
                total={total}
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
