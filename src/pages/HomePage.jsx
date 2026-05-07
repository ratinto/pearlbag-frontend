import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function HomePage({ featuredBags, onAddToCart }) {
  return (
    <div className="page home-page">
      <section className="hero">
        <p className="eyebrow">New season collection</p>
        <h1>Handbags for every day and every occasion</h1>
        <p className="subtitle">
          Discover modern, premium handbags with reliable checkout and delivery.
        </p>
        <div className="hero-actions">
          <Link className="button-link" to="/shop">
            Shop now
          </Link>
          <Link className="button-link subtle" to="/about">
            Learn more
          </Link>
        </div>
      </section>

      <section className="info-grid" aria-label="Store benefits">
        <article>
          <h2>Fast Delivery</h2>
          <p>2–4 day shipping on all orders with tracking included.</p>
        </article>
        <article>
          <h2>Secure Checkout</h2>
          <p>Simple cart flow and protected online transactions.</p>
        </article>
        <article>
          <h2>Top Quality</h2>
          <p>Carefully crafted handbags built for daily wear.</p>
        </article>
      </section>

      <section className="section-head">
        <h2>Featured handbags</h2>
        <Link to="/shop">Browse all</Link>
      </section>
      <section className="catalog" aria-label="Featured handbag catalog">
        {featuredBags.map((bag) => (
          <ProductCard bag={bag} key={bag.id} onAddToCart={onAddToCart} />
        ))}
      </section>
    </div>
  )
}

export default HomePage
