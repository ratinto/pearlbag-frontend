# Pearlbag Frontend — Context

Boutique handbag ecommerce storefront. Aesthetic is **minimal, editorial, warm-neutral** — avoid visual noise (no emoji, no badge stacks, no marketing banners, no "as seen in" press strips). Keep additions restrained.

## Stack

- **React 19** + **Vite 8**
- **React Router 7** (data-router not used — plain `BrowserRouter` + `Routes`)
- **Plain CSS** in `src/index.css` (tokens/typography) and `src/App.css` (everything else). No Tailwind, no CSS-in-JS.
- **No TypeScript.** No state library — global state lives in `App.jsx` as React state + `localStorage`.
- **Fonts:** Cormorant Garamond (serif, headings) + Inter (sans, body), loaded via Google Fonts in `index.css`.

## Layout

```
src/
├── App.jsx                 # routes, cart/wishlist/recent/promo state, persistence
├── App.css                 # all component styles
├── index.css               # CSS variables, base typography, resets
├── main.jsx                # ReactDOM root
├── components/
│   ├── Layout.jsx          # header (search, wishlist, cart drawer), footer, mobile menu
│   ├── ProductCard.jsx     # grid card with wishlist heart + quick add
│   └── BagIllustration.jsx # SVG bag silhouettes used everywhere as imagery
├── data/
│   └── handbags.js         # product catalog + PROMO_CODES + helpers (formatCurrency, etc.)
└── pages/
    ├── HomePage.jsx        # hero, value row, categories, featured, story, reviews, newsletter
    ├── ShopPage.jsx        # filters (category/price/color/in-stock), search query, sort, grid/list
    ├── ProductPage.jsx     # gallery, color/qty options, stock pill, accordion, reviews
    ├── CartPage.jsx        # line items, promo code, free-shipping bar, summary
    ├── CheckoutPage.jsx    # multi-step form, shipping/payment methods, order confirmation
    ├── WishlistPage.jsx    # saved items
    ├── AboutPage.jsx       # brand story
    ├── FaqPage.jsx         # accordion FAQ + contact info
    └── NotFoundPage.jsx    # 404
```

## State model (in App.jsx)

All app state is hoisted into `App.jsx` and passed down as props:

- `cart` — `{ [bagId]: qty }`, persisted at `localStorage["pearlbag.cart"]`
- `wishlist` — array of bag IDs, persisted at `localStorage["pearlbag.wishlist"]`
- `recent` — last 8 viewed bag IDs (most recent first), persisted at `localStorage["pearlbag.recent"]`
- `promo` — `{ code, type, value, label, min? } | null`, in-memory only (cleared on order placement)
- `toast` — transient flash message, auto-clears after 2.2s

Totals (`subtotal`, `promoDiscount`, `shipping`, `tax`, `total`) are derived with `useMemo`. Tax is `subtotal * TAX_RATE` (`0.08`). Free shipping over `$250` or with the `FREESHIP` promo.

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

`ShopPage` reads `?category=` and `?q=` from the URL. Treat query params as the source of truth for category and search; filter UI state (price slider, color, in-stock) is local component state.

## Promo codes

Defined in `src/data/handbags.js` under `PROMO_CODES`:

- `WELCOME10` — 10% off
- `PEARL20` — 20% off
- `FREESHIP` — free shipping
- `GIFT25` — $25 off orders over $150

`applyPromo(code)` in App.jsx returns `{ ok, message }`.

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
- **Toast on add-to-cart / wishlist toggle** — already wired in App.jsx; reuse `showToast`.
- **Persist to `localStorage`** with the existing `pearlbag.*` key naming if you add new persisted state.
- **Layout is sticky on cart drawer / mobile menu**; both toggle `body.overflow` to lock scroll.
- **Build:** `npm run build`. **Dev:** `npm run dev`. **Lint:** `npm run lint`.

## Backend

A sibling Express server lives at `../pearlbag-backend`. The frontend does **not** currently call it — all data and order flow is local. If you wire real APIs, start there; do not pollute the frontend with mock fetch layers in the meantime.
