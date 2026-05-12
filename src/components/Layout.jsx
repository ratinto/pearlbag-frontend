import { Link, NavLink } from 'react-router-dom'

function Layout({ children, cartCount, toast }) {
  return (
    <div className="site-shell">
      <div className="announcement">
        Complimentary shipping on orders over $250 · 30-day returns
      </div>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Pearl Bag Boutique home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 12 C 6 9 9 7 16 7 C 23 7 26 9 26 12 L 27.5 24 C 27.5 26 26 27 24 27 L 8 27 C 6 27 4.5 26 4.5 24 Z"
                fill="currentColor"
              />
              <path
                d="M10 11 C 10 7 13 5 16 5 C 19 5 22 7 22 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="brand-name">
            <span className="brand-name-line">PEARL</span>
            <span className="brand-name-line italic">bag</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">Our story</NavLink>
        </nav>
        <div className="header-actions">
          <NavLink to="/cart" className="cart-link" aria-label={`Cart with ${cartCount} items`}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 8 H 19 L 17.5 19 A 2 2 0 0 1 15.5 21 H 8.5 A 2 2 0 0 1 6.5 19 L 5 8 Z" />
              <path d="M9 8 V 6 A 3 3 0 0 1 15 6 V 8" strokeLinecap="round" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">PEARL<span className="italic">bag</span></p>
            <p className="footer-tag">
              Modern handbags, made to last. Crafted with care and shipped worldwide.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">All handbags</Link></li>
              <li><Link to="/shop?category=tote">Totes</Link></li>
              <li><Link to="/shop?category=crossbody">Crossbody</Link></li>
              <li><Link to="/shop?category=clutch">Clutches</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link to="/about">Our story</Link></li>
              <li><a href="#shipping">Shipping</a></li>
              <li><a href="#returns">Returns</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Stay in the loop</h4>
            <p className="footer-small">Get early access to new releases and seasonal offers.</p>
            <form
              className="footer-newsletter"
              onSubmit={(event) => {
                event.preventDefault()
                event.currentTarget.reset()
              }}
            >
              <input type="email" required placeholder="your@email.com" aria-label="Email" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>
        <div className="footer-base">
          <p>© {new Date().getFullYear()} Pearl Bag Boutique. All rights reserved.</p>
          <p>Crafted with care · Shipped worldwide</p>
        </div>
      </footer>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}

export default Layout
