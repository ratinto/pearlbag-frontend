import { Link } from 'react-router-dom'
import BagIllustration from './BagIllustration'
import { formatCurrency } from '../data/handbags'

function ProductCard({ bag, onAddToCart, onToggleWishlist, wishlist }) {
  const primaryColor = bag.colors[0]
  const isSaved = wishlist?.includes(bag.id)
  const outOfStock = bag.stock === 0

  return (
    <article className={`product-card ${outOfStock ? 'out-of-stock' : ''}`}>
      <Link to={`/shop/${bag.id}`} className="product-media" aria-label={bag.name}>
        <BagIllustration style={bag.style} color={primaryColor.hex} />
        {outOfStock ? (
          <span className="product-badge muted">Sold out</span>
        ) : (
          bag.badge && <span className="product-badge">{bag.badge}</span>
        )}
        {onToggleWishlist && (
          <button
            type="button"
            className={`wishlist-toggle ${isSaved ? 'active' : ''}`}
            aria-label={isSaved ? `Remove ${bag.name} from wishlist` : `Save ${bag.name} to wishlist`}
            aria-pressed={isSaved}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onToggleWishlist(bag.id)
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
              <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {!outOfStock && (
          <button
            type="button"
            className="quick-add"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onAddToCart(bag.id)
            }}
          >
            Quick add
          </button>
        )}
      </Link>
      <div className="product-body">
        <div className="product-meta">
          <p className="product-category">{bag.category}</p>
          <span className="product-rating" aria-label={`Rated ${bag.rating} out of 5`}>
            ★ {bag.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="product-name">
          <Link to={`/shop/${bag.id}`}>{bag.name}</Link>
        </h3>
        <div className="swatches" aria-label="Available colors">
          {bag.colors.map((color) => (
            <span
              key={color.name}
              className="swatch"
              style={{ background: color.hex }}
              title={color.name}
            />
          ))}
        </div>
        <div className="product-footer">
          <div className="price-block">
            <strong>{formatCurrency(bag.price)}</strong>
            {bag.compareAtPrice && (
              <span className="compare-at">{formatCurrency(bag.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
