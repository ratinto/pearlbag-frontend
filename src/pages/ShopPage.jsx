import ProductCard from '../components/ProductCard'

function ShopPage({ handbags, onAddToCart }) {
  return (
    <div className="page">
      <section className="section-head">
        <h1>Shop handbags</h1>
        <p>Find the right style for work, weekends, and special occasions.</p>
      </section>
      <section className="catalog" aria-label="Handbag catalog">
        {handbags.map((bag) => (
          <ProductCard bag={bag} key={bag.id} onAddToCart={onAddToCart} />
        ))}
      </section>
    </div>
  )
}

export default ShopPage
