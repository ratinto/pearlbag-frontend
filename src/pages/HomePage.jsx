import { Link } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/handbags'

const testimonials = [
  {
    quote:
      'The Aurora Satchel has become the bag I reach for every morning. Beautifully made and just the right shape.',
    name: 'Amelia R.',
    role: 'Verified buyer',
  },
  {
    quote:
      'Quality I would expect at twice the price. The hardware feels considered and the leather looks even better in person.',
    name: 'Priya K.',
    role: 'Verified buyer',
  },
  {
    quote:
      'I ordered the Evening Clutch for a wedding and got compliments all night. Shipping was quick and packaging felt elevated.',
    name: 'Lina M.',
    role: 'Verified buyer',
  },
]

function HomePage({ featuredBags, recentItems, onAddToCart, onToggleWishlist, wishlist }) {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Spring · Summer collection</p>
          <h1>
            Handbags made for <em>everyday</em> moments.
          </h1>
          <p className="subtitle">
            Thoughtful silhouettes, refined materials, and a quiet kind of luxury you carry with
            you wherever the day takes you.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/shop">
              Shop the collection
            </Link>
            <Link className="button ghost" to="/about">
              Our story
            </Link>
          </div>
          <ul className="hero-points">
            <li>Free shipping over $250</li>
            <li>30-day easy returns</li>
            <li>Crafted to last</li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-card hero-card-1">
            <BagIllustration
              style="satchel"
              color="#2f2722"
              background="linear-gradient(160deg, #f0e6d2 0%, #e3d3b1 100%)"
            />
          </div>
          <div className="hero-card hero-card-2">
            <BagIllustration
              style="shoulder"
              color="#b89070"
              background="linear-gradient(160deg, #fff7e8 0%, #f5e7c8 100%)"
            />
          </div>
          <div className="hero-card hero-card-3">
            <BagIllustration
              style="clutch"
              color="#5a1f2b"
              background="linear-gradient(160deg, #faf3e5 0%, #ead7a8 100%)"
            />
          </div>
        </div>
      </section>

      <section className="value-row" aria-label="Store benefits">
        <article>
          <h3>Considered craft</h3>
          <p>Hand-finished details and materials chosen for longevity.</p>
        </article>
        <article>
          <h3>Modern silhouettes</h3>
          <p>Pieces designed to work with what you already wear.</p>
        </article>
        <article>
          <h3>Care included</h3>
          <p>Every bag arrives with a dust bag and a care guide.</p>
        </article>
        <article>
          <h3>Five-year promise</h3>
          <p>Free repairs on hardware and stitching for five years.</p>
        </article>
      </section>

      <section className="category-row" aria-label="Shop by category">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by silhouette</p>
            <h2>Find your everyday</h2>
          </div>
          <Link to="/shop" className="link-arrow">
            View all →
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(0, 6).map((c, idx) => (
            <Link to={`/shop?category=${c.id}`} className="category-card" key={c.id}>
              <BagIllustration
                style={c.id === 'tote' ? 'tote' : c.id}
                color={['#c8a87a', '#3a3530', '#a89a86', '#5a3826', '#1f1f24', '#dcc8a6'][idx % 6]}
                background={[
                  'linear-gradient(160deg, #f4ecd9 0%, #e6d7b7 100%)',
                  'linear-gradient(160deg, #f6efe1 0%, #e6d4b6 100%)',
                  'linear-gradient(160deg, #fff5e3 0%, #efdcb3 100%)',
                  'linear-gradient(160deg, #f1e5cc 0%, #d8c19a 100%)',
                  'linear-gradient(160deg, #ece2cb 0%, #d2bf9a 100%)',
                  'linear-gradient(160deg, #fbf3df 0%, #ecd9b0 100%)',
                ][idx % 6]}
              />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured" aria-label="Featured handbags">
        <div className="section-head">
          <div>
            <p className="eyebrow">This season</p>
            <h2>Featured handbags</h2>
          </div>
          <Link to="/shop" className="link-arrow">Browse all →</Link>
        </div>
        <div className="catalog">
          {featuredBags.map((bag) => (
            <ProductCard
              bag={bag}
              key={bag.id}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
            />
          ))}
        </div>
      </section>

      <section className="story-band">
        <div className="story-band-art" aria-hidden="true">
          <BagIllustration
            style="tote"
            color="#1f1f24"
            background="linear-gradient(160deg, #efe5cf 0%, #d8c7a0 100%)"
          />
        </div>
        <div className="story-band-copy">
          <p className="eyebrow">A small studio</p>
          <h2>Designed in our atelier. Made for your routine.</h2>
          <p>
            Pearl Bag Boutique is a small, independent studio. We design each silhouette in-house,
            work with a single trusted workshop, and release only a handful of styles every season.
          </p>
          <Link className="button ghost dark" to="/about">
            Read our story
          </Link>
        </div>
      </section>

      {recentItems && recentItems.length > 0 && (
        <section className="featured" aria-label="Recently viewed">
          <div className="section-head">
            <div>
              <p className="eyebrow">Just for you</p>
              <h2>Recently viewed</h2>
            </div>
          </div>
          <div className="catalog">
            {recentItems.slice(0, 4).map((bag) => (
              <ProductCard
                bag={bag}
                key={bag.id}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                wishlist={wishlist}
              />
            ))}
          </div>
        </section>
      )}

      <section className="testimonials" aria-label="Customer reviews">
        <p className="eyebrow center">What customers say</p>
        <h2 className="center">Loved by readers, travelers, and city-dwellers.</h2>
        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <figure key={t.name} className="testimonial">
              <div className="stars" aria-hidden="true">★★★★★</div>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="newsletter" aria-label="Newsletter signup">
        <div>
          <p className="eyebrow">The list</p>
          <h2>Be first to see new arrivals.</h2>
          <p>Join the list for early access, restocks, and 10% off your first order.</p>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault()
            event.currentTarget.reset()
          }}
        >
          <input type="email" required placeholder="your@email.com" aria-label="Email address" />
          <button type="submit" className="button primary">Subscribe</button>
        </form>
      </section>
    </div>
  )
}

export default HomePage
