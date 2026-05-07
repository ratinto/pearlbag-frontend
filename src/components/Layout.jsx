import { Link, NavLink } from 'react-router-dom'

function Layout({ children, cartCount }) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          Pearl Bag Boutique
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart <span>{cartCount}</span>
          </NavLink>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <p>Premium handbags with fast shipping and secure checkout.</p>
      </footer>
    </div>
  )
}

export default Layout
