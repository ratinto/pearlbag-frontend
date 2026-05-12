import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import ProductCard from '../components/ProductCard'
import { formatCurrency, getBagById, handbags } from '../data/handbags'

function ProductPage({ onAddToCart }) {
  const { id } = useParams()
  const bag = getBagById(id)
  const [colorIndex, setColorIndex] = useState(0)
  const [qty, setQty] = useState(1)

  if (!bag) return <Navigate to="/shop" replace />

  const color = bag.colors[colorIndex]
  const recommended = handbags.filter((b) => b.id !== bag.id).slice(0, 3)

  return (
    <div className="page product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
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
            <span className="product-rating">
              ★ {bag.rating.toFixed(1)} <span className="muted">({bag.reviews} reviews)</span>
            </span>
          </div>
          <p className="product-desc">{bag.description}</p>

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
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                −
              </button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                +
              </button>
            </div>
          </div>

          <div className="cta-row">
            <button
              type="button"
              className="button primary large"
              onClick={() => {
                for (let i = 0; i < qty; i += 1) onAddToCart(bag.id)
              }}
            >
              Add to bag · {formatCurrency(bag.price * qty)}
            </button>
            <button type="button" className="button ghost large" aria-label="Save to wishlist">
              ♡ Save
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
              <p>Free shipping on orders over $250. 30-day easy returns on unworn items.</p>
            </details>
            <details>
              <summary>Materials & care</summary>
              <p>
                Wipe with a soft, dry cloth. Store in the included dust bag. Avoid prolonged
                exposure to direct sun and rain.
              </p>
            </details>
            <details>
              <summary>Our five-year promise</summary>
              <p>
                Hardware and stitching repairs are free for five years from purchase. Just send us
                a note and we'll take care of it.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="recommendations">
        <div className="section-head">
          <h2>You may also like</h2>
          <Link to="/shop" className="link-arrow">View all →</Link>
        </div>
        <div className="catalog">
          {recommended.map((b) => (
            <ProductCard bag={b} key={b.id} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductPage
