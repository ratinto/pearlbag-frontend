import { Link } from 'react-router-dom'
import { formatCurrency } from '../data/handbags'

function CartPage({ cartItems, cart, onAddToCart, onRemoveFromCart, shipping, subtotal, total }) {
  return (
    <div className="page cart-page">
      <section className="section-head">
        <h1>Shopping cart</h1>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-cart">
          <p>Your cart is empty.</p>
          <Link className="button-link" to="/shop">
            Continue shopping
          </Link>
        </section>
      ) : (
        <section className="cart-layout" aria-label="Cart items and order summary">
          <ul className="cart-list">
            {cartItems.map((bag) => (
              <li key={bag.id}>
                <div>
                  <h2>{bag.name}</h2>
                  <p>{formatCurrency(bag.price)}</p>
                </div>
                <div className="cart-item-actions">
                  <button type="button" onClick={() => onRemoveFromCart(bag.id)}>
                    -
                  </button>
                  <span>{cart[bag.id]}</span>
                  <button type="button" onClick={() => onAddToCart(bag.id)}>
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="summary" aria-label="Order summary">
            <p>
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </p>
            <p>
              <span>Shipping</span>
              <strong>{formatCurrency(shipping)}</strong>
            </p>
            <p className="total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </p>
            <button type="button">Proceed to checkout</button>
          </aside>
        </section>
      )}
    </div>
  )
}

export default CartPage
