import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/handbags'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

function ShopPage({ handbags, onAddToCart }) {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') ?? 'all'
  const [sort, setSort] = useState('featured')

  const setCategory = (cat) => {
    const next = new URLSearchParams(params)
    if (cat === 'all') next.delete('category')
    else next.set('category', cat)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    let list = handbags
    if (activeCategory !== 'all') {
      list = list.filter((bag) => bag.category === activeCategory)
    }
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [handbags, activeCategory, sort])

  return (
    <div className="page shop-page">
      <header className="shop-header">
        <p className="eyebrow">The collection</p>
        <h1>Shop handbags</h1>
        <p className="subtitle">
          A small, considered range. Choose the silhouette that fits your day.
        </p>
      </header>

      <div className="shop-toolbar">
        <div className="filter-chips" role="tablist" aria-label="Filter by category">
          <button
            type="button"
            role="tab"
            className={`chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              type="button"
              role="tab"
              key={c.id}
              className={`chip ${activeCategory === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="sort-select">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="result-count">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No bags match this filter yet. Try another category.</p>
        </div>
      ) : (
        <section className="catalog" aria-label="Handbag catalog">
          {filtered.map((bag) => (
            <ProductCard bag={bag} key={bag.id} onAddToCart={onAddToCart} />
          ))}
        </section>
      )}
    </div>
  )
}

export default ShopPage
