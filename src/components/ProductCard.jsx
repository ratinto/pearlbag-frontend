import { Link } from 'react-router-dom'
import BagIllustration from './BagIllustration'
import { formatCurrency } from '../data/handbags'

function ProductCard({ bag, onAddToCart }) {
  const primaryColor = bag.colors[0]

  return (
    <article className="product-card">
      <Link to={`/shop/${bag.id}`} className="product-media" aria-label={bag.name}>
        <BagIllustration style={bag.style} color={primaryColor.hex} />
        {bag.badge && <span className="product-badge">{bag.badge}</span>}
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
