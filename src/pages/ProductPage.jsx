import { useEffect, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import ProductCard from '../components/ProductCard'
import { formatCurrency, getBagById, handbags } from '../data/handbags'

const SAMPLE_REVIEWS = [
  {
    rating: 5,
    title: 'Beautiful everyday bag',
    body:
      'This is the bag I reach for every morning. The hardware feels considered and it sits perfectly under the arm.',
    name: 'Amelia R.',
    date: '2 weeks ago',
  },
  {
    rating: 5,
    title: 'Better than expected',
    body:
      'Quality I would expect at twice the price. The leather looks even better in person.',
    name: 'Priya K.',
    date: '1 month ago',
  },
  {
    rating: 4,
    title: 'Lovely, slightly smaller than I thought',
    body:
      'Beautifully made. Just check the dimensions — it is more of a mini than I anticipated.',
    name: 'Hana T.',
    date: '2 months ago',
  },
]

function ProductPage({ onAddToCart, onToggleWishlist, onTrackView, wishlist, recentItems }) {
  const { id } = useParams()
  const bag = getBagById(id)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (bag && onTrackView) onTrackView(bag.id)
    window.scrollTo({ top: 0 })
    setColorIndex(0)
    setQty(1)
  }, [id, bag, onTrackView])

  if (!bag) return <Navigate to="/shop" replace />

  const color = bag.colors[colorIndex]
  const recommended = handbags
    .filter((b) => b.id !== bag.id && b.category === bag.category)
    .concat(handbags.filter((b) => b.id !== bag.id && b.category !== bag.category))
    .slice(0, 3)
  const isSaved = wishlist?.includes(bag.id)
  const outOfStock = bag.stock === 0
  const lowStock = bag.stock > 0 && bag.stock <= 3
  const recentlyViewed = (recentItems || []).filter((b) => b.id !== bag.id).slice(0, 4)

  return (
    <div className="page product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${bag.category}`}>{bag.category}</Link>
        <span>/</span>
        <span>{bag.name}</span>
      </nav>

      <section className="product-layout">
        <div className="product-gallery">
          <div className="gallery-main">
            <BagIllustration
              style={bag.style}
              color={color.hex}
              background="linear-gradient(160deg, #f5efe2 0%, #e6d6b3 100%)"
            />
            {bag.badge && <span className="product-badge large">{bag.badge}</span>}
          </div>
          <div className="gallery-thumbs">
            {bag.colors.map((c, idx) => (
              <button
                type="button"
                key={c.name}
                className={`thumb ${idx === colorIndex ? 'active' : ''}`}
                onClick={() => setColorIndex(idx)}
                aria-label={`View in ${c.name}`}
              >
                <BagIllustration
                  style={bag.style}
                  color={c.hex}
                  background="linear-gradient(160deg, #f4ecd9 0%, #ddc99e 100%)"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="product-info">
          <p className="eyebrow">{bag.category}</p>
          <h1>{bag.name}</h1>
          <div className="product-info-row">
            <div className="price-block large">
              <strong>{formatCurrency(bag.price)}</strong>
              {bag.compareAtPrice && (
                <span className="compare-at">{formatCurrency(bag.compareAtPrice)}</span>
              )}
            </div>
            <a href="#reviews" className="product-rating">
              ★ {bag.rating.toFixed(1)} <span className="muted">({bag.reviews})</span>
            </a>
          </div>

          <p className="product-desc">{bag.description}</p>

          <p className={`stock-pill ${outOfStock ? 'out' : lowStock ? 'low' : 'in'}`}>
            <span className="dot" aria-hidden="true" />
            {outOfStock
              ? 'Out of stock'
              : lowStock
                ? `Only ${bag.stock} left`
                : 'In stock'}
          </p>

          <div className="option-block">
            <p className="option-label">
              Color: <strong>{color.name}</strong>
            </p>
            <div className="color-options">
              {bag.colors.map((c, idx) => (
                <button
                  type="button"
                  key={c.name}
                  className={`color-option ${idx === colorIndex ? 'active' : ''}`}
                  onClick={() => setColorIndex(idx)}
                  aria-label={c.name}
                  title={c.name}
                >
                  <span style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          <div className="option-block">
            <p className="option-label">Quantity</p>
            <div className="qty-stepper">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(bag.stock || 10, q + 1))}
                aria-label="Increase"
                disabled={qty >= (bag.stock || 10)}
              >
                +
              </button>
            </div>
          </div>

          <div className="cta-row">
            <button
              type="button"
              className="button primary large"
              disabled={outOfStock}
              onClick={() => {
                for (let i = 0; i < qty; i += 1) onAddToCart(bag.id)
              }}
            >
              {outOfStock ? 'Sold out' : `Add to bag · ${formatCurrency(bag.price * qty)}`}
            </button>
            <button
              type="button"
              className={`button ghost large ${isSaved ? 'active' : ''}`}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-pressed={isSaved}
              onClick={() => onToggleWishlist?.(bag.id)}
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>

          <ul className="product-details">
            {bag.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <div className="info-list">
            <details open>
              <summary>Shipping & returns</summary>
              <p>Free shipping on orders over $250. 30-day easy returns on unused items.</p>
            </details>
            <details>
              <summary>Materials & care</summary>
              <p>
                {bag.material}. Wipe with a soft, dry cloth. Store in the included dust bag.
              </p>
            </details>
            <details>
              <summary>Our five-year promise</summary>
              <p>
                Hardware and stitching repairs are free for five years from purchase.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section id="reviews" className="reviews-section" aria-label="Customer reviews">
        <div className="section-head">
          <div>
            <p className="eyebrow">Customer reviews</p>
            <h2>{bag.rating.toFixed(1)} out of 5 · {bag.reviews} reviews</h2>
          </div>
        </div>
        <div className="review-list">
          {SAMPLE_REVIEWS.map((r) => (
            <article className="review" key={r.title}>
              <div className="stars" aria-hidden="true">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <h4>{r.title}</h4>
              <p>{r.body}</p>
              <footer className="muted small">{r.name} · {r.date}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className="recommendations">
        <div className="section-head">
          <h2>You may also like</h2>
          <Link to="/shop" className="link-arrow">View all →</Link>
        </div>
        <div className="catalog">
          {recommended.map((b) => (
            <ProductCard
              bag={b}
              key={b.id}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
            />
          ))}
        </div>
      </section>

      {recentlyViewed.length > 0 && (
        <section className="recommendations">
          <div className="section-head">
            <h2>Recently viewed</h2>
          </div>
          <div className="catalog">
            {recentlyViewed.map((b) => (
              <ProductCard
                bag={b}
                key={b.id}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductPage
