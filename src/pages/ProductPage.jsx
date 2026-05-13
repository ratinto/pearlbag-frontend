import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import ProductCard from '../components/ProductCard'
import { formatCurrency } from '../data/handbags'
import { api } from '../lib/api'

function timeAgo(iso) {
  const date = new Date(iso)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`
  return `${Math.floor(diff / 31536000)} years ago`
}

function ProductPage({
  onAddToCart,
  onToggleWishlist,
  onTrackView,
  wishlist,
  recentItems,
  products,
  onShowToast,
}) {
  const { id } = useParams()
  const [bag, setBag] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)

  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewForm, setReviewForm] = useState({ authorName: '', rating: 5, title: '', body: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setColorIndex(0)
    setQty(1)
    window.scrollTo({ top: 0 })

    api.products
      .get(id)
      .then((p) => {
        if (cancelled) return
        setBag(p)
        if (onTrackView) onTrackView(p.id)
      })
      .catch((err) => {
        if (cancelled) return
        if (err.status === 404) setNotFound(true)
        else setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    setReviewsLoading(true)
    api.reviews
      .list(id)
      .then((list) => {
        if (!cancelled) setReviews(list)
      })
      .catch(() => {
        if (!cancelled) setReviews([])
      })
      .finally(() => {
        if (!cancelled) setReviewsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, onTrackView])

  const recommended = useMemo(() => {
    if (!bag || !products) return []
    return products
      .filter((b) => b.id !== bag.id && b.category === bag.category)
      .concat(products.filter((b) => b.id !== bag.id && b.category !== bag.category))
      .slice(0, 3)
  }, [bag, products])

  const submitReview = async (event) => {
    event.preventDefault()
    setReviewError('')
    if (!reviewForm.authorName.trim()) {
      setReviewError('Please enter your name.')
      return
    }
    setReviewSubmitting(true)
    try {
      const created = await api.reviews.create({
        productId: bag.id,
        authorName: reviewForm.authorName.trim(),
        rating: Number(reviewForm.rating),
        title: reviewForm.title.trim() || undefined,
        body: reviewForm.body.trim() || undefined,
      })
      setReviews((prev) => [created, ...prev])
      setReviewForm({ authorName: '', rating: 5, title: '', body: '' })
      onShowToast?.('Thanks for your review')
      // Refetch product so updated rating / reviewCount reflect.
      api.products.get(bag.id).then(setBag).catch(() => {})
    } catch (err) {
      setReviewError(err.message || 'Could not submit review.')
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page product-page" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p className="muted">Loading…</p>
      </div>
    )
  }
  if (notFound || !bag) return <Navigate to="/shop" replace />

  const color = bag.colors[colorIndex] || bag.colors[0]
  const isSaved = wishlist?.includes(bag.id)
  const outOfStock = bag.stock === 0
  const lowStock = bag.stock > 0 && bag.stock <= 3
  const recentlyViewed = (recentItems || []).filter((b) => b.id !== bag.id).slice(0, 4)
  const reviewCount = bag.reviewCount ?? reviews.length
  const rating = Number(bag.rating || 0)

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
              ★ {rating.toFixed(1)} <span className="muted">({reviewCount})</span>
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
            {bag.details?.map((d) => (
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
            <h2>{rating.toFixed(1)} out of 5 · {reviewCount} reviews</h2>
          </div>
        </div>

        <form className="review-form" onSubmit={submitReview} aria-label="Write a review">
          <div className="grid-2">
            <label>
              Your name
              <input
                type="text"
                required
                value={reviewForm.authorName}
                onChange={(e) => setReviewForm((f) => ({ ...f, authorName: e.target.value }))}
              />
            </label>
            <label>
              Rating
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((f) => ({ ...f, rating: e.target.value }))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Title (optional)
            <input
              type="text"
              value={reviewForm.title}
              onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>
          <label>
            Your review (optional)
            <textarea
              rows={3}
              value={reviewForm.body}
              onChange={(e) => setReviewForm((f) => ({ ...f, body: e.target.value }))}
            />
          </label>
          {reviewError && <p className="error small">{reviewError}</p>}
          <button type="submit" className="button primary" disabled={reviewSubmitting}>
            {reviewSubmitting ? 'Submitting…' : 'Submit review'}
          </button>
        </form>

        <div className="review-list">
          {reviewsLoading && reviews.length === 0 && (
            <p className="muted small">Loading reviews…</p>
          )}
          {!reviewsLoading && reviews.length === 0 && (
            <p className="muted small">No reviews yet. Be the first.</p>
          )}
          {reviews.map((r) => (
            <article className="review" key={r.id}>
              <div className="stars" aria-hidden="true">
                {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
              </div>
              {r.title && <h4>{r.title}</h4>}
              {r.body && <p>{r.body}</p>}
              <footer className="muted small">
                {r.authorName} · {timeAgo(r.createdAt)}
              </footer>
            </article>
          ))}
        </div>
      </section>

      {recommended.length > 0 && (
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
      )}

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
