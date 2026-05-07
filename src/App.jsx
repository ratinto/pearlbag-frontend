import { useMemo, useState } from 'react'
import './App.css'

const SHIPPING_COST = 12

const handbags = [
  {
    id: 1,
    name: 'Pearl Mini Tote',
    description: 'Compact structured tote with pearl hardware.',
    price: 129,
  },
  {
    id: 2,
    name: 'City Crossbody',
    description: 'Everyday crossbody with soft vegan leather.',
    price: 99,
  },
  {
    id: 3,
    name: 'Luna Shoulder Bag',
    description: 'Classic shoulder silhouette with magnetic flap.',
    price: 149,
  },
  {
    id: 4,
    name: 'Weekend Bucket',
    description: 'Spacious bucket bag designed for travel days.',
    price: 139,
  },
]

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

  return (
    <main className="store">
      <header className="store-header">
        <p className="eyebrow">Pearl Bag Boutique</p>
        <h1>Handbags for every day and every occasion</h1>
        <p className="subtitle">
          Discover bestselling handbags with simple checkout and fast delivery.
        </p>
      </header>

      <section className="store-content" aria-label="Handbag catalog and cart">
        <section className="catalog" aria-label="Handbag catalog">
          {handbags.map((bag) => (
            <article className="product-card" key={bag.id}>
              <h2>{bag.name}</h2>
              <p>{bag.description}</p>
              <div className="product-footer">
                <strong>${bag.price}</strong>
                <button type="button" onClick={() => addToCart(bag.id)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart" aria-label="Shopping cart">
          <h2>Shopping cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((bag) => (
                <li key={bag.id}>
                  <div>
                    <strong>{bag.name}</strong>
                    <span>
                      ${bag.price} × {cart[bag.id]}
                    </span>
                  </div>
                  <button type="button" onClick={() => removeFromCart(bag.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="summary">
            <p>
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </p>
            <p>
              <span>Shipping</span>
              <strong>${shipping}</strong>
            </p>
            <p className="total">
              <span>Total</span>
              <strong>${total}</strong>
            </p>
            <button type="button" disabled={cartItems.length === 0}>
              Checkout
            </button>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
