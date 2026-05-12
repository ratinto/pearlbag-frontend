import { Link } from 'react-router-dom'
import BagIllustration from '../components/BagIllustration'

function NotFoundPage() {
  return (
    <div className="page not-found">
      <section className="not-found-card">
        <div className="not-found-art" aria-hidden="true">
          <BagIllustration
            style="clutch"
            color="#5a1f2b"
            background="linear-gradient(160deg, #faf3e5 0%, #ead7a8 100%)"
          />
        </div>
        <p className="eyebrow">Lost in the lining</p>
        <h1>This page wandered off.</h1>
        <p className="subtitle">
          We can't find what you're looking for. Try the collection, or head back home.
        </p>
        <div className="not-found-actions">
          <Link to="/shop" className="button primary">Shop handbags</Link>
          <Link to="/" className="button ghost">Back to home</Link>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
