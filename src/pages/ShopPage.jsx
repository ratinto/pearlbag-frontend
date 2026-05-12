import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { allColors, categories, priceRange } from '../data/handbags'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

function ShopPage({ handbags, onAddToCart, onToggleWishlist, wishlist }) {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') ?? 'all'
  const query = params.get('q') ?? ''
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(priceRange.max)
  const [colorFilter, setColorFilter] = useState('all')
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [view, setView] = useState('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setMaxPrice(priceRange.max)
    setColorFilter('all')
    setOnlyInStock(false)
  }, [activeCategory])

  const setCategory = (cat) => {
    const next = new URLSearchParams(params)
    if (cat === 'all') next.delete('category')
    else next.set('category', cat)
    setParams(next, { replace: true })
  }

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true })
    setMaxPrice(priceRange.max)
    setColorFilter('all')
    setOnlyInStock(false)
    setSort('featured')
  }

  const filtered = useMemo(() => {
    let list = handbags
    if (activeCategory !== 'all') {
      list = list.filter((bag) => bag.category === activeCategory)
    }
    if (query) {
      const q = query.toLowerCase()
      list = list.filter((bag) =>
        [bag.name, bag.category, bag.description, bag.material, ...(bag.tags || []), ...bag.colors.map((c) => c.name)]
          .join(' ')
          .toLowerCase()
          .includes(q),
      )
    }
    if (colorFilter !== 'all') {
      list = list.filter((bag) => bag.colors.some((c) => c.name === colorFilter))
    }
    list = list.filter((bag) => bag.price <= maxPrice)
    if (onlyInStock) list = list.filter((bag) => bag.stock > 0)

    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    else if (sort === 'newest') sorted.sort((a, b) => b.id - a.id)
    return sorted
  }, [handbags, activeCategory, sort, query, maxPrice, colorFilter, onlyInStock])

  const activeFilterCount =
    (activeCategory !== 'all' ? 1 : 0) +
    (query ? 1 : 0) +
    (colorFilter !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (maxPrice < priceRange.max ? 1 : 0)

  return (
    <div className="page shop-page">
      <header className="shop-header">
        <p className="eyebrow">The collection</p>
        <h1>{query ? `Results for "${query}"` : 'Shop handbags'}</h1>
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
        <div className="toolbar-right">
          <button
            type="button"
            className="chip ghost"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            Filters {activeFilterCount > 0 && <span className="chip-count">{activeFilterCount}</span>}
          </button>
          <label className="sort-select">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
              aria-label="Grid view"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
              aria-label="List view"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <p className="filter-label">Max price</p>
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <p className="muted small">Up to ${maxPrice}</p>
          </div>
          <div className="filter-group">
            <p className="filter-label">Color</p>
            <div className="color-filter">
              <button
                type="button"
                className={`chip ${colorFilter === 'all' ? 'active' : ''}`}
                onClick={() => setColorFilter('all')}
              >
                Any
              </button>
              {allColors.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  className={`color-chip ${colorFilter === c.name ? 'active' : ''}`}
                  onClick={() => setColorFilter(c.name)}
                  title={c.name}
                  aria-pressed={colorFilter === c.name}
                >
                  <span style={{ background: c.hex }} />
                  <em>{c.name}</em>
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Only show in-stock items</span>
            </label>
          </div>
          <div className="filter-actions">
            <button type="button" className="link-button" onClick={clearAll}>Clear all</button>
            <button type="button" className="button primary" onClick={() => setFiltersOpen(false)}>Apply</button>
          </div>
        </div>
      )}

      <div className="result-row">
        <p className="result-count">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </p>
        {activeFilterCount > 0 && (
          <button type="button" className="link-button" onClick={clearAll}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No matches</h3>
          <p>No bags match these filters. Try clearing them and browsing the full collection.</p>
          <button type="button" className="button ghost" onClick={clearAll}>Clear filters</button>
        </div>
      ) : (
        <section className={`catalog ${view === 'list' ? 'list-view' : ''}`} aria-label="Handbag catalog">
          {filtered.map((bag) => (
            <ProductCard
              bag={bag}
              key={bag.id}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              wishlist={wishlist}
            />
          ))}
        </section>
      )}
    </div>
  )
}

export default ShopPage
