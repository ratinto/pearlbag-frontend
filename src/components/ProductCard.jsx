import { formatCurrency } from '../data/handbags'

function ProductCard({ bag, onAddToCart }) {
  return (
    <article className="product-card">
      <p className="product-category">{bag.category}</p>
      <h2>{bag.name}</h2>
      <p>{bag.description}</p>
      <div className="product-footer">
        <strong>{formatCurrency(bag.price)}</strong>
        <button type="button" onClick={() => onAddToCart(bag.id)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
