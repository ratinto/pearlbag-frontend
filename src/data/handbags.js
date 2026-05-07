export const SHIPPING_COST = 12

export const handbags = [
  {
    id: 1,
    name: 'Pearl Mini Tote',
    description: 'Compact structured tote with pearl hardware.',
    price: 129,
    category: 'Tote',
  },
  {
    id: 2,
    name: 'City Crossbody',
    description: 'Everyday crossbody with soft vegan leather.',
    price: 99,
    category: 'Crossbody',
  },
  {
    id: 3,
    name: 'Luna Shoulder Bag',
    description: 'Classic shoulder silhouette with magnetic flap.',
    price: 149,
    category: 'Shoulder',
  },
  {
    id: 4,
    name: 'Weekend Bucket',
    description: 'Spacious bucket bag designed for travel days.',
    price: 139,
    category: 'Bucket',
  },
  {
    id: 5,
    name: 'Aurora Satchel',
    description: 'Polished satchel with adjustable strap and zip top.',
    price: 159,
    category: 'Satchel',
  },
  {
    id: 6,
    name: 'Evening Clutch',
    description: 'Elegant compact clutch for nights out.',
    price: 89,
    category: 'Clutch',
  },
]

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    amount,
  )
