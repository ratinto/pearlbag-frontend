import { useState } from 'react'
import { api } from '../lib/api'

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Standard orders ship within 1–2 business days and arrive in 3–5 business days within the U.S. Express arrives in 1–2 business days. International orders take 7–14 business days.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes — we ship to over 40 countries. Duties and taxes are calculated at checkout so you see the full cost before placing your order.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer 30-day returns on unused bags in original condition with the dust bag. Sale items and personalized pieces are final sale.',
  },
  {
    q: 'How do I start a return?',
    a: 'Email care@pearlbag.com with your order number. We send a prepaid label and process refunds within 5 business days of receiving the item.',
  },
  {
    q: 'What does the five-year promise cover?',
    a: 'Free repairs on hardware (snaps, zippers, clasps) and stitching for five years from the purchase date.',
  },
  {
    q: 'How should I care for my bag?',
    a: 'Wipe with a soft, dry cloth. Store in the included dust bag, away from direct sun and moisture.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'Visa, Mastercard, American Express, PayPal, and Apple Pay.',
  },
]

function FaqPage({ onShowToast }) {
  const [open, setOpen] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const submitContact = async (event) => {
    event.preventDefault()
    setStatus({ state: 'pending', message: '' })
    try {
      await api.contact.send({
        name: form.name.trim() || undefined,
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      })
      setForm({ name: '', email: '', subject: '', message: '' })
      setStatus({ state: 'success', message: 'Thanks — we’ll be in touch within one business day.' })
      onShowToast?.('Message sent')
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Could not send message.' })
    }
  }

  return (
    <div className="page faq-page">
      <header className="shop-header">
        <p className="eyebrow">Help</p>
        <h1>Frequently asked questions.</h1>
        <p className="subtitle">
          Shipping, returns, and care — answered.
        </p>
      </header>

      <section className="faq-list">
        {FAQS.map((item, idx) => (
          <details
            key={item.q}
            open={idx === open}
            onToggle={(e) => e.target.open && setOpen(idx)}
          >
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </section>

      <section className="contact-block">
        <p className="eyebrow">Still need help?</p>
        <h2>We're here.</h2>
        <p className="subtitle">
          Our team replies within one business day.
        </p>
        <ul className="contact-list">
          <li>care@pearlbag.com</li>
          <li>Mon–Fri · 9am–5pm ET</li>
        </ul>

        <form className="contact-form" onSubmit={submitContact} aria-label="Contact us">
          <div className="grid-2">
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </label>
          </div>
          <label>
            Subject
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </label>
          <label>
            Message
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </label>
          {status.message && (
            <p className={`small ${status.state === 'error' ? 'error' : 'muted'}`}>
              {status.message}
            </p>
          )}
          <button type="submit" className="button primary" disabled={status.state === 'pending'}>
            {status.state === 'pending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default FaqPage
