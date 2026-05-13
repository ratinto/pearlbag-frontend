import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import BagIllustration from './BagIllustration'
import { formatCurrency } from '../data/handbags'
import { api } from '../lib/api'

function Layout({
  children,
  cartCount,
  wishlistCount,
  cartItems,
  cart,
  subtotal,
  toast,
  onRemoveAll,
  onShowToast,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [footerEmail, setFooterEmail] = useState('')
  const [footerStatus, setFooterStatus] = useState({ state: 'idle', message: '' })
  const searchInputRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const submitFooterNewsletter = async (event) => {
    event.preventDefault()
    setFooterStatus({ state: 'pending', message: '' })
    try {
      await api.newsletter.subscribe(footerEmail)
      setFooterEmail('')
      setFooterStatus({ state: 'success', message: 'Subscribed.' })
      onShowToast?.('Subscribed — welcome to the list')
    } catch (err) {
      setFooterStatus({
        state: 'error',
        message: err.message || 'Could not subscribe.',
      })
    }
  }

  useEffect(() => {
    setDrawerOpen(false)
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    if (drawerOpen || mobileMenuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
    return undefined
  }, [drawerOpen, mobileMenuOpen])

  const submitSearch = (event) => {
    event.preventDefault()
    const q = searchValue.trim()
    if (!q) return
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setSearchValue('')
    setSearchOpen(false)
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        Complimentary shipping over $250 · 30-day returns
      </div>

      <header className="site-header">
        <button
          type="button"
          className="icon-button mobile-only"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>

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

        <nav aria-label="Main navigation" className="main-nav desktop-only">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">Our story</NavLink>
          <NavLink to="/faq">Help</NavLink>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <NavLink
            to="/wishlist"
            className="icon-button"
            aria-label={`Wishlist with ${wishlistCount} items`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" strokeLinejoin="round" />
            </svg>
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </NavLink>
          <button
            type="button"
            className="icon-button"
            aria-label={`Cart with ${cartCount} items`}
            onClick={() => setDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 8 H 19 L 17.5 19 A 2 2 0 0 1 15.5 21 H 8.5 A 2 2 0 0 1 6.5 19 L 5 8 Z" />
              <path d="M9 8 V 6 A 3 3 0 0 1 15 6 V 8" strokeLinecap="round" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="search-panel" role="search">
          <form onSubmit={submitSearch} className="search-form">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="6.5" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search handbags…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search products"
            />
            <button
              type="button"
              className="link-button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              Close
            </button>
          </form>
        </div>
      )}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">PEARL<span className="italic">bag</span></p>
            <p className="footer-tag">
              Modern handbags, made to last. Shipped worldwide.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">All handbags</Link></li>
              <li><Link to="/shop?category=tote">Totes</Link></li>
              <li><Link to="/shop?category=crossbody">Crossbody</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link to="/about">Our story</Link></li>
              <li><Link to="/faq">Shipping & returns</Link></li>
              <li><Link to="/faq">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p className="footer-small">Early access, restocks, and the occasional note.</p>
            <form className="footer-newsletter" onSubmit={submitFooterNewsletter}>
              <input
                type="email"
                required
                placeholder="your@email.com"
                aria-label="Email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
              />
              <button type="submit" disabled={footerStatus.state === 'pending'}>
                {footerStatus.state === 'pending' ? '…' : 'Join'}
              </button>
            </form>
            {footerStatus.message && (
              <p className={`small ${footerStatus.state === 'error' ? 'error' : 'muted'}`}>
                {footerStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="footer-base">
          <p>© {new Date().getFullYear()} Pearl Bag Boutique</p>
          <ul className="footer-legal">
            <li><a href="#terms">Terms</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#accessibility">Accessibility</a></li>
          </ul>
        </div>
      </footer>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="scrim"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="mobile-menu" aria-label="Mobile navigation">
            <div className="mobile-menu-head">
              <span className="brand-name">
                <span className="brand-name-line">PEARL</span>
                <span className="brand-name-line italic">bag</span>
              </span>
              <button
                type="button"
                className="icon-button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav>
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/wishlist">Wishlist</NavLink>
              <NavLink to="/about">Our story</NavLink>
              <NavLink to="/faq">Help</NavLink>
            </nav>
          </aside>
        </>
      )}

      {/* Mini cart drawer */}
      {drawerOpen && (
        <>
          <div
            className="scrim"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="cart-drawer" aria-label="Shopping bag preview">
            <header className="drawer-head">
              <h3>Your bag ({cartCount})</h3>
              <button
                type="button"
                className="icon-button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close bag"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            {cartItems.length === 0 ? (
              <div className="drawer-empty">
                <BagIllustration
                  style="tote"
                  color="#cfb997"
                  background="linear-gradient(160deg, #f4ecd9 0%, #e2cea1 100%)"
                />
                <p>Your bag is empty.</p>
                <Link className="button primary" to="/shop">
                  Shop the collection
                </Link>
              </div>
            ) : (
              <>
                <ul className="drawer-list">
                  {cartItems.map((bag) => (
                    <li key={bag.id}>
                      <div className="drawer-art">
                        <BagIllustration
                          style={bag.style}
                          color={bag.colors[0].hex}
                          background="linear-gradient(160deg, #f5efe2 0%, #e2d1a8 100%)"
                        />
                      </div>
                      <div className="drawer-body">
                        <Link to={`/shop/${bag.id}`}>{bag.name}</Link>
                        <p className="muted small">Qty {cart[bag.id]} · {bag.colors[0].name}</p>
                        <strong>{formatCurrency(bag.price * cart[bag.id])}</strong>
                      </div>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => onRemoveAll(bag.id)}
                        aria-label={`Remove ${bag.name}`}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="drawer-foot">
                  <p className="drawer-subtotal">
                    <span>Subtotal</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </p>
                  <Link to="/cart" className="button ghost full" onClick={() => setDrawerOpen(false)}>
                    View bag
                  </Link>
                  <Link to="/checkout" className="button primary full" onClick={() => setDrawerOpen(false)}>
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </aside>
        </>
      )}

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}

export default Layout
