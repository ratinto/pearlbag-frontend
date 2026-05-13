export const SHIPPING_COST = 12
export const FREE_SHIPPING_THRESHOLD = 250
export const TAX_RATE = 0.08

export const categories = [
  { id: 'tote', label: 'Totes' },
  { id: 'crossbody', label: 'Crossbody' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'bucket', label: 'Bucket' },
  { id: 'satchel', label: 'Satchel' },
  { id: 'clutch', label: 'Clutches' },
]

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const formatCurrencyExact = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

export const getBagById = (products, id) =>
  products.find((bag) => bag.id === Number(id))

export const getAllColors = (products) => {
  const map = new Map()
  products.forEach((bag) => {
    bag.colors?.forEach((c) => {
      if (!map.has(c.name)) map.set(c.name, c)
    })
  })
  return Array.from(map.values())
}

export const getPriceRange = (products) => {
  if (!products || products.length === 0) return { min: 0, max: 500 }
  const prices = products.map((b) => Number(b.price))
  return { min: Math.min(...prices), max: Math.max(...prices) }
}
