import { Link } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import ProductCard from '../components/ProductCard'

function WishlistPage({ items, onAddToCart, onToggleWishlist, wishlist }) {
  return (
    <div className="page wishlist-page">
      <header className="cart-header">
        <p className="eyebrow">Saved for later</p>
        <h1>Your wishlist</h1>
        <p className="subtitle">
          Bags you've saved while browsing. They live here until you're ready.
        </p>
      </header>

      {items.length === 0 ? (
        <section className="empty-cart">
          <div className="empty-cart-art" aria-hidden="true">
            <BagIllustration
              style="shoulder"
              color="#b89070"
              background="linear-gradient(160deg, #fff7e8 0%, #f5e7c8 100%)"
            />
          </div>
          <h2>No saved bags yet</h2>
          <p>Tap the heart on any handbag to save it for later.</p>
          <Link className="button primary" to="/shop">
            Browse the collection
          </Link>
        </section>
      ) : (
        <section className="catalog">
          {items.map((bag) => (
            <ProductCard
              bag={bag}
              key={bag.id}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
            />
          ))}
        </section>
      )}
    </div>
  )
}

export default WishlistPage
