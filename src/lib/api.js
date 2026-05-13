const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    /* ignore non-JSON response */
  }
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || `Request failed: ${res.status}`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data ?? {}
}

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (entries.length === 0) return ''
  return `?${new URLSearchParams(entries).toString()}`
}

export const api = {
  products: {
    list: (params) => request(`/api/products${buildQuery(params)}`).then((d) => d.products ?? []),
    get: (id) => request(`/api/products/${id}`).then((d) => d.product),
  },
  orders: {
    create: (payload) =>
      request('/api/orders', { method: 'POST', body: JSON.stringify(payload) }).then(
        (d) => d.order,
      ),
    get: (orderNumber) => request(`/api/orders/${orderNumber}`).then((d) => d.order),
  },
  promo: {
    validate: (code, subtotal) =>
      request('/api/promo/validate', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      }),
  },
  reviews: {
    list: (productId) =>
      request(`/api/reviews/${productId}`).then((d) => d.reviews ?? []),
    create: (payload) =>
      request('/api/reviews', { method: 'POST', body: JSON.stringify(payload) }).then(
        (d) => d.review,
      ),
  },
  newsletter: {
    subscribe: (email) =>
      request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
  },
  contact: {
    send: (payload) =>
      request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),
  },
}
