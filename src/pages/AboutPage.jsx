import { Link } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'

function AboutPage() {
  return (
    <div className="page about-page">
      <section className="about-hero">
        <div>
          <p className="eyebrow">Our story</p>
          <h1>A small studio, devoted to the everyday handbag.</h1>
          <p className="subtitle">
            Pearl Bag Boutique was founded on a simple idea: a thoughtfully made bag should be
            quietly beautiful, comfortable to carry, and built to last for years rather than
            seasons.
          </p>
        </div>
        <div className="about-hero-art" aria-hidden="true">
          <BagIllustration
            style="satchel"
            color="#3b2a20"
            background="linear-gradient(160deg, #f0e6d2 0%, #d8c19a 100%)"
          />
        </div>
      </section>

      <section className="values">
        <article>
          <h3>Considered design</h3>
          <p>
            We design every silhouette in-house, prototype slowly, and only release the shapes that
            earn their place in your wardrobe.
          </p>
        </article>
        <article>
          <h3>One trusted workshop</h3>
          <p>
            Each bag is cut, stitched, and finished by the same partner workshop. We've worked
            with them since the beginning.
          </p>
        </article>
        <article>
          <h3>Made to last</h3>
          <p>
            Reinforced stress points, solid hardware, and a five-year repair promise. We want you
            to carry the bag, not replace it.
          </p>
        </article>
      </section>

      <section className="manifesto">
        <p className="eyebrow">Our promise</p>
        <h2>Quiet luxury, without the markup.</h2>
        <p>
          We sell directly to you, skip the seasonal trend cycle, and invest in materials and
          construction instead. The result is a small, considered collection at a fair price.
        </p>
        <Link to="/shop" className="button primary">
          Shop the collection
        </Link>
      </section>
    </div>
  )
}

export default AboutPage
