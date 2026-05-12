import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import { formatCurrency } from '../data/handbags'

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase().slice(-5)
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6)
  return `PB-${ts}-${rand}`
}

function CheckoutPage({
  cartItems,
  cart,
  subtotal,
  shipping,
  tax,
  total,
  promo,
  promoDiscount,
  onApplyPromo,
  onClearPromo,
  onClearCart,
}) {
  const [step, setStep] = useState('details')
  const [placed, setPlaced] = useState(null)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [email, setEmail] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  const expressFee = 18
  const finalShipping = shippingMethod === 'express' ? shipping + expressFee : shipping
  const finalTotal = total + (shippingMethod === 'express' ? expressFee : 0)

  const orderItems = useMemo(
    () =>
      cartItems.map((bag) => ({
        ...bag,
        qty: cart[bag.id],
        line: bag.price * cart[bag.id],
      })),
    [cart, cartItems],
  )

  if (cartItems.length === 0 && !placed) return <Navigate to="/cart" replace />

  const submit = (event) => {
    event.preventDefault()
    if (step === 'details') {
      setStep('payment')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 'payment') {
      const orderNumber = generateOrderNumber()
      const items = orderItems.map(({ id, name, qty, line }) => ({ id, name, qty, line }))
      setPlaced({
        orderNumber,
        email,
        total: finalTotal,
        items,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })
      onClearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submitPromo = (event) => {
    event.preventDefault()
    setPromoError('')
    const result = onApplyPromo(promoInput)
    if (!result.ok) setPromoError(result.message)
    else setPromoInput('')
  }

  if (placed) {
    return (
      <div className="page checkout-page">
        <section className="order-confirmed">
          <div className="confirmation-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Thank you for your order</h1>
          <p>
            We've received your order and a confirmation is on its way
            {placed.email && <> to <strong>{placed.email}</strong></>}.
          </p>
          <dl className="order-summary-card">
            <div>
              <dt>Order number</dt>
              <dd><strong>{placed.orderNumber}</strong></dd>
            </div>
            <div>
              <dt>Order date</dt>
              <dd>{placed.date}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatCurrency(placed.total)}</dd>
            </div>
            <div>
              <dt>Items</dt>
              <dd>{placed.items.reduce((s, i) => s + i.qty, 0)}</dd>
            </div>
          </dl>
          <p className="muted small">
            Estimated delivery in 3–5 business days. You'll get tracking once your order ships.
          </p>
          <div className="confirmed-actions">
            <Link to="/shop" className="button primary">Continue shopping</Link>
            <Link to="/" className="button ghost">Back to home</Link>
          </div>
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
          <li>3 · Confirmation</li>
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
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Email me about new arrivals and offers</span>
                </label>
              </fieldset>

              <fieldset>
                <legend>Shipping address</legend>
                <div className="grid-2">
                  <label>
                    First name
                    <input type="text" required autoComplete="given-name" />
                  </label>
                  <label>
                    Last name
                    <input type="text" required autoComplete="family-name" />
                  </label>
                </div>
                <label>
                  Address
                  <input type="text" required autoComplete="street-address" />
                </label>
                <label>
                  Apartment, suite, etc. (optional)
                  <input type="text" autoComplete="address-line2" />
                </label>
                <div className="grid-3">
                  <label>
                    City
                    <input type="text" required autoComplete="address-level2" />
                  </label>
                  <label>
                    State / Region
                    <input type="text" autoComplete="address-level1" />
                  </label>
                  <label>
                    Postal code
                    <input type="text" required autoComplete="postal-code" />
                  </label>
                </div>
                <label>
                  Country
                  <select defaultValue="US" autoComplete="country">
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                  </select>
                </label>
                <label>
                  Phone (optional)
                  <input type="tel" autoComplete="tel" placeholder="For delivery updates" />
                </label>
              </fieldset>

              <fieldset>
                <legend>Shipping method</legend>
                <label className={`radio-row ${shippingMethod === 'standard' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                  />
                  <div>
                    <strong>Standard</strong>
                    <p className="muted small">3–5 business days</p>
                  </div>
                  <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </label>
                <label className={`radio-row ${shippingMethod === 'express' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                  />
                  <div>
                    <strong>Express</strong>
                    <p className="muted small">1–2 business days</p>
                  </div>
                  <span>{formatCurrency(shipping + expressFee)}</span>
                </label>
              </fieldset>

              <div className="checkout-actions">
                <Link to="/cart" className="link-arrow">← Back to bag</Link>
                <button type="submit" className="button primary">Continue to payment</button>
              </div>
            </>
          )}

          {step === 'payment' && (
            <>
              <fieldset>
                <legend>Payment method</legend>
                <div className="payment-tabs">
                  <button
                    type="button"
                    className={paymentMethod === 'card' ? 'active' : ''}
                    onClick={() => setPaymentMethod('card')}
                  >
                    Credit card
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === 'paypal' ? 'active' : ''}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    PayPal
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === 'apple' ? 'active' : ''}
                    onClick={() => setPaymentMethod('apple')}
                  >
                    Apple Pay
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <label>
                      Card number
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        required
                        autoComplete="cc-number"
                      />
                    </label>
                    <div className="grid-2">
                      <label>
                        Expiry
                        <input type="text" placeholder="MM / YY" required autoComplete="cc-exp" />
                      </label>
                      <label>
                        CVC
                        <input type="text" inputMode="numeric" placeholder="123" required autoComplete="cc-csc" />
                      </label>
                    </div>
                    <label>
                      Name on card
                      <input type="text" required autoComplete="cc-name" />
                    </label>
                  </>
                )}
                {paymentMethod === 'paypal' && (
                  <p className="muted small">
                    You'll be redirected to PayPal to complete your purchase securely.
                  </p>
                )}
                {paymentMethod === 'apple' && (
                  <p className="muted small">
                    Use Touch ID or Face ID to confirm payment with Apple Pay.
                  </p>
                )}

                <p className="muted small">
                  Your payment is encrypted and processed securely.
                </p>
              </fieldset>

              <fieldset>
                <legend>Billing address</legend>
                <label className="checkbox-row">
                  <input type="checkbox" defaultChecked />
                  <span>Same as shipping address</span>
                </label>
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
                  Place order · {formatCurrency(finalTotal)}
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

          <form className="promo-form compact" onSubmit={submitPromo}>
            <div className="promo-input">
              <input
                type="text"
                placeholder="Promo code"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
              />
              <button type="submit" className="button ghost">Apply</button>
            </div>
            {promoError && <p className="error small">{promoError}</p>}
            {promo && (
              <p className="promo-applied">
                ✓ <strong>{promo.code}</strong>
                <button type="button" className="link-button" onClick={onClearPromo}>Remove</button>
              </p>
            )}
          </form>

          <p>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </p>
          {promoDiscount > 0 && (
            <p className="discount-row">
              <span>Discount</span>
              <strong>−{formatCurrency(promoDiscount)}</strong>
            </p>
          )}
          <p>
            <span>Shipping</span>
            <strong>{finalShipping === 0 ? 'Free' : formatCurrency(finalShipping)}</strong>
          </p>
          <p>
            <span>Estimated tax</span>
            <strong>{formatCurrency(tax)}</strong>
          </p>
          <p className="total">
            <span>Total</span>
            <strong>{formatCurrency(finalTotal)}</strong>
          </p>
          <div className="trust-row">
            <span>Secure checkout</span>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default CheckoutPage
