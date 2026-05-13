# Pearlbag Frontend — Context

Boutique handbag ecommerce storefront. Aesthetic is **minimal, editorial, warm-neutral** — avoid visual noise (no emoji, no badge stacks, no marketing banners, no "as seen in" press strips). Keep additions restrained.

## Stack

- **React 19** + **Vite 8**
- **React Router 7** (data-router not used — plain `BrowserRouter` + `Routes`)
- **Plain CSS** in `src/index.css` (tokens/typography) and `src/App.css` (everything else). No Tailwind, no CSS-in-JS.
- **No TypeScript.** No state library — server-fetched product state + UI state lives in `App.jsx` as React state, persisted slices go to `localStorage`.
- **Fonts:** Cormorant Garamond (serif, headings) + Inter (sans, body), loaded via Google Fonts in `index.css`.

## Layout

```
src/
├── App.jsx                 # routes, products fetch, cart/wishlist/recent/promo state, persistence
├── App.css                 # all component styles
├── index.css               # CSS variables, base typography, resets
├── main.jsx                # ReactDOM root
├── lib/
│   └── api.js              # fetch wrappers for the backend API
├── components/
│   ├── Layout.jsx          # header (search, wishlist, cart drawer), footer (newsletter), mobile menu
│   ├── ProductCard.jsx     # grid card with wishlist heart + quick add
│   └── BagIllustration.jsx # SVG bag silhouettes used everywhere as imagery
├── data/
│   └── handbags.js         # pricing constants, categories, formatters, getAllColors/getPriceRange helpers
└── pages/
    ├── HomePage.jsx        # hero, value row, categories, featured, story, reviews, newsletter
    ├── ShopPage.jsx        # filters (category/price/color/in-stock), search query, sort, grid/list
    ├── ProductPage.jsx     # fetches product + reviews, gallery, options, stock pill, review submission
    ├── CartPage.jsx        # line items, promo code (async), free-shipping bar, summary
    ├── CheckoutPage.jsx    # multi-step form, posts order to API, confirmation
    ├── WishlistPage.jsx    # saved items
    ├── AboutPage.jsx       # brand story
    ├── FaqPage.jsx         # accordion FAQ + contact form
    └── NotFoundPage.jsx    # 404
```

## Backend integration

The sibling Express + Prisma + Supabase backend lives at `../pearlbag-backend`. The frontend reads it via `src/lib/api.js`, configured by `VITE_API_URL` (default `http://localhost:5000`). Copy `.env.example` → `.env` and set `VITE_API_URL` if the backend isn't on localhost.

`api` shape (all methods return parsed JSON; errors throw with `.status` and `.data`):

- `api.products.list(params?)` → product[]; `params` supports `category, q, minPrice, maxPrice, inStock, sort`
- `api.products.get(id)` → product
- `api.orders.create(payload)` → order
- `api.orders.get(orderNumber)` → order
- `api.promo.validate(code, subtotal)` → `{ ok, promo? }`
- `api.reviews.list(productId)` → review[]
- `api.reviews.create(payload)` → review
- `api.newsletter.subscribe(email)` → subscriber
- `api.contact.send(payload)` → message

**Never add a parallel fetch layer or mock data.** If a feature needs new state, add a route to the backend and a method to `api`.

## State model (in App.jsx)

App.jsx fetches the product catalog once on mount, then derives `cartItems`, `wishlistItems`, `recentItems` from the fetched products + persisted ID lists.

- `products` — fetched from `GET /api/products`. Until it loads, App shows a centered "Loading…" placeholder so cart/wishlist resolution can't see a stale empty array.
- `cart` — `{ [bagId]: qty }`, persisted at `localStorage["pearlbag.cart"]`
- `wishlist` — array of bag IDs, persisted at `localStorage["pearlbag.wishlist"]`
- `recent` — last 8 viewed bag IDs (most recent first), persisted at `localStorage["pearlbag.recent"]`
- `promo` — server-validated promo object `{ code, type, value, label, minOrder, ... } | null`, in-memory only (cleared on order placement). `applyPromo(code)` is **async** — it calls `api.promo.validate()`. Cart/Checkout call sites must await it.
- `toast` — transient flash message, auto-clears after 2.2s. Forwarded as `onShowToast` to pages that need it.

Totals (`subtotal`, `promoDiscount`, `shipping`, `tax`, `total`) are derived with `useMemo`. Tax is `subtotal * TAX_RATE` (`0.08`). Free shipping over `$250` or with a `shipping`-type promo. These are **display-only** — the backend recomputes totals server-side when the order is submitted.

When adding state-derived UI (e.g. a coupon banner), derive from existing state — don't add parallel state.

## Routes

| Path           | Page             |
| -------------- | ---------------- |
| `/`            | HomePage         |
| `/shop`        | ShopPage         |
| `/shop/:id`    | ProductPage      |
| `/wishlist`    | WishlistPage     |
| `/cart`        | CartPage         |
| `/checkout`    | CheckoutPage     |
| `/about`       | AboutPage        |
| `/faq`         | FaqPage          |
| `*`            | NotFoundPage     |

`ShopPage` reads `?category=` and `?q=` from the URL. Treat query params as the source of truth for category and search; filter UI state (price slider, color, in-stock) is local component state. `allColors` and `priceRange` are derived from the fetched `products` via `getAllColors(products)` / `getPriceRange(products)` in `data/handbags.js`.

## Forms

All write endpoints are wired:

- **Newsletter** (HomePage + Layout footer) → `api.newsletter.subscribe`
- **Promo validation** (CartPage + CheckoutPage) → `api.promo.validate` via `applyPromo`
- **Reviews** (ProductPage) → `api.reviews.create` — page also fetches `api.reviews.list` and refetches the product after submission so rating/reviewCount stay fresh
- **Order placement** (CheckoutPage) → `api.orders.create` — step 1 captures the shipping address via `FormData`, step 2 submits. Server returns the canonical order; the confirmation card uses `order.orderNumber`, `order.total`, `order.createdAt`
- **Contact** (FaqPage) → `api.contact.send`

## Imagery

There are **no product photos**. Every "image" is rendered by `BagIllustration` — an SVG component with six silhouettes (`tote`, `crossbody`, `shoulder`, `bucket`, `satchel`, `clutch`) tinted by the bag's primary color. When adding new bags or sections, reuse this component with a soft gradient `background` rather than introducing raster images.

## Design tokens

CSS variables in `:root` (`index.css`):

- `--bg`, `--bg-elev`, `--bg-soft`, `--bg-band` (cream / white / sand / near-black)
- `--text`, `--text-h`, `--muted`
- `--accent` (brown), `--gold`, `--danger`
- `--radius`, `--radius-sm`, `--radius-lg`
- `--sans` (Inter), `--serif` (Cormorant Garamond)
- `--shadow`, `--shadow-lg`

Headings use `--serif`; body and UI use `--sans`. Italic serif (`.italic`) is the brand accent — used sparingly (`PEARLbag`, hero "everyday").

## Conventions

- **No emojis in UI strings.** Use SVG icons or plain text instead.
- **No third-party logos / press mentions.** No "Visa / Mastercard / Apple Pay" badge rows, no "As seen in Vogue".
- **One badge per product card max.** Don't stack `New + Sale + Low stock`.
- **`formatCurrency(amount)`** for all prices (whole-dollar). Use `formatCurrencyExact` only when cents are needed.
- **Toast on add-to-cart / wishlist toggle** — already wired in App.jsx; reuse `showToast`/`onShowToast`.
- **Persist to `localStorage`** with the existing `pearlbag.*` key naming if you add new persisted state.
- **Layout is sticky on cart drawer / mobile menu**; both toggle `body.overflow` to lock scroll.
- **Build:** `npm run build`. **Dev:** `npm run dev`. **Lint:** `npm run lint`.
- **Backend field naming:** server uses `reviewCount` (not `reviews`); the API client already returns Decimal/BigInt as `Number`/`String`, so `bag.price * qty` is safe.
