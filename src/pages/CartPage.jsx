import { useState } from 'react'
import { Link } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import { FREE_SHIPPING_THRESHOLD, formatCurrency } from '../data/handbags'

function CartPage({
  cartItems,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onRemoveAll,
  shipping,
  subtotal,
  tax,
  total,
  promo,
  promoDiscount,
  onApplyPromo,
  onClearPromo,
}) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const submitPromo = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await onApplyPromo(code)
      if (!result.ok) setError(result.message)
      else setCode('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page cart-page">
      <header className="cart-header">
        <h1>Your bag</h1>
        <p className="subtitle">
          Review your selection. You can update quantities or remove items before checkout.
        </p>
      </header>

      {cartItems.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-art" aria-hidden="true">
            <BagIllustration
              style="tote"
              color="#cfb997"
              background="linear-gradient(160deg, #f4ecd9 0%, #e2cea1 100%)"
            />
          </div>
          <h2>Your bag is empty</h2>
          <p>Discover modern handbags designed for everyday wear.</p>
          <div className="empty-cart-actions">
            <Link className="button primary" to="/shop">
              Shop the collection
            </Link>
            <Link className="button ghost" to="/wishlist">
              View wishlist
            </Link>
          </div>
        </section>
      ) : (
        <section className="cart-layout" aria-label="Cart items and order summary">
          <div className="cart-main">
            <div className="shipping-bar">
              {remainingForFreeShipping > 0 ? (
                <p>
                  You're <strong>{formatCurrency(remainingForFreeShipping)}</strong> away from
                  free shipping.
                </p>
              ) : (
                <p>You've unlocked complimentary shipping.</p>
              )}
              <div className="bar">
                <div className="bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="cart-list">
              {cartItems.map((bag) => (
                <li key={bag.id}>
                  <div className="cart-item-art">
                    <BagIllustration
                      style={bag.style}
                      color={bag.colors[0].hex}
                      background="linear-gradient(160deg, #f5efe2 0%, #e2d1a8 100%)"
                    />
                  </div>
                  <div className="cart-item-body">
                    <div className="cart-item-top">
                      <div>
                        <p className="product-category">{bag.category}</p>
                        <h3>
                          <Link to={`/shop/${bag.id}`}>{bag.name}</Link>
                        </h3>
                        <p className="muted small">Color: {bag.colors[0].name} · SKU: {bag.sku}</p>
                        {bag.stock <= 3 && bag.stock > 0 && (
                          <p className="warn small">Only {bag.stock} left in stock</p>
                        )}
                      </div>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => onRemoveAll(bag.id)}
                        aria-label={`Remove ${bag.name}`}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="qty-stepper small">
                        <button type="button" onClick={() => onRemoveFromCart(bag.id)} aria-label="Decrease">−</button>
                        <span>{cart[bag.id]}</span>
                        <button type="button" onClick={() => onAddToCart(bag.id)} aria-label="Increase">+</button>
                      </div>
                      <div className="cart-item-price">
                        <strong>{formatCurrency(bag.price * cart[bag.id])}</strong>
                        <span className="muted small">{formatCurrency(bag.price)} each</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-actions-row">
              <Link to="/shop" className="link-arrow">← Continue shopping</Link>
            </div>
          </div>

          <aside className="summary" aria-label="Order summary">
            <h2>Order summary</h2>

            <form className="promo-form" onSubmit={submitPromo}>
              <label>
                Promo code
                <div className="promo-input">
                  <input
                    type="text"
                    placeholder="WELCOME10"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError('') }}
                  />
                  <button type="submit" className="button ghost" disabled={submitting}>
                    {submitting ? '…' : 'Apply'}
                  </button>
                </div>
              </label>
              {error && <p className="error small">{error}</p>}
              {promo && (
                <p className="promo-applied">
                  ✓ <strong>{promo.code}</strong> · {promo.label}
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
              <strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong>
            </p>
            <p>
              <span>Estimated tax</span>
              <strong>{formatCurrency(tax)}</strong>
            </p>
            <p className="total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </p>
            <Link to="/checkout" className="button primary full">
              Proceed to checkout
            </Link>
            <Link to="/shop" className="link-arrow center">
              Continue shopping →
            </Link>
            <div className="trust-row">
              <span>Secure checkout</span>
              <span>·</span>
              <span>Easy returns</span>
              <span>·</span>
              <span>Fast delivery</span>
            </div>
          </aside>
        </section>
      )}
    </div>
  )
}

export default CartPage
