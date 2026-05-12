import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import { formatCurrency } from '../data/handbags'

function CheckoutPage({ cartItems, cart, subtotal, shipping, total, onClearCart }) {
  const [step, setStep] = useState('details')
  const [placed, setPlaced] = useState(false)

  if (cartItems.length === 0 && !placed) return <Navigate to="/cart" replace />

  const submit = (event) => {
    event.preventDefault()
    if (step === 'details') {
      setStep('payment')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 'payment') {
      setPlaced(true)
      onClearCart()
    }
  }

  if (placed) {
    return (
      <div className="page checkout-page">
        <section className="order-confirmed">
          <div className="confirmation-mark" aria-hidden="true">✓</div>
          <h1>Thank you for your order</h1>
          <p>
            We've received your order. A confirmation email is on its way with your tracking
            details.
          </p>
          <Link to="/shop" className="button primary">
            Continue shopping
          </Link>
        </section>
      </div>
    )
  }

  return (
    <div className="page checkout-page">
      <header className="cart-header">
        <h1>Checkout</h1>
        <ol className="checkout-steps">
          <li className={step === 'details' ? 'active' : 'done'}>1 · Details</li>
          <li className={step === 'payment' ? 'active' : ''}>2 · Payment</li>
          <li>3 · Review</li>
        </ol>
      </header>

      <section className="checkout-layout">
        <form className="checkout-form" onSubmit={submit}>
          {step === 'details' && (
            <>
              <fieldset>
                <legend>Contact</legend>
                <label>
                  Email
                  <input type="email" required placeholder="you@example.com" />
                </label>
              </fieldset>
              <fieldset>
                <legend>Shipping address</legend>
                <div className="grid-2">
                  <label>
                    First name
                    <input type="text" required />
                  </label>
                  <label>
                    Last name
                    <input type="text" required />
                  </label>
                </div>
                <label>
                  Address
                  <input type="text" required />
                </label>
                <div className="grid-2">
                  <label>
                    City
                    <input type="text" required />
                  </label>
                  <label>
                    Postal code
                    <input type="text" required />
                  </label>
                </div>
                <label>
                  Country
                  <select defaultValue="US">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                  </select>
                </label>
              </fieldset>
              <div className="checkout-actions">
                <Link to="/cart" className="link-arrow">
                  ← Back to bag
                </Link>
                <button type="submit" className="button primary">
                  Continue to payment
                </button>
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <fieldset>
                <legend>Payment method</legend>
                <label>
                  Card number
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </label>
                <div className="grid-2">
                  <label>
                    Expiry
                    <input type="text" placeholder="MM / YY" required />
                  </label>
                  <label>
                    CVC
                    <input type="text" inputMode="numeric" placeholder="123" required />
                  </label>
                </div>
                <label>
                  Name on card
                  <input type="text" required />
                </label>
                <p className="muted small">
                  Your payment is encrypted and processed securely.
                </p>
              </fieldset>
              <div className="checkout-actions">
                <button
                  type="button"
                  className="link-arrow"
                  onClick={() => setStep('details')}
                >
                  ← Back to details
                </button>
                <button type="submit" className="button primary">
                  Place order · {formatCurrency(total)}
                </button>
              </div>
            </>
          )}
        </form>

        <aside className="summary checkout-summary">
          <h2>Your order</h2>
          <ul className="mini-cart">
            {cartItems.map((bag) => (
              <li key={bag.id}>
                <div className="mini-art">
                  <BagIllustration
                    style={bag.style}
                    color={bag.colors[0].hex}
                    background="linear-gradient(160deg, #f5efe2 0%, #e6d6b3 100%)"
                  />
                  <span className="mini-qty">{cart[bag.id]}</span>
                </div>
                <div className="mini-body">
                  <p className="mini-name">{bag.name}</p>
                  <p className="muted small">{bag.colors[0].name}</p>
                </div>
                <strong>{formatCurrency(bag.price * cart[bag.id])}</strong>
              </li>
            ))}
          </ul>
          <p>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </p>
          <p>
            <span>Shipping</span>
            <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
          </p>
          <p className="total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </p>
        </aside>
      </section>
    </div>
  )
}

export default CheckoutPage
