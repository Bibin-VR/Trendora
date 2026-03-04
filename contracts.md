# Trendora API Contracts

## Authentication (JWT Custom Auth)
### POST /api/auth/register
- Body: `{ name, email, password, gender_preference? }`
- Response: `{ user, token }`

### POST /api/auth/login
- Body: `{ email, password }`
- Response: `{ user, token }`

### GET /api/auth/me
- Headers: `Authorization: Bearer <token>`
- Response: `{ user }`

## Products
### GET /api/products
- Query: `?gender=&category=&brand=&sort=price_asc|price_desc|discount&page=&limit=`
- Response: `{ products[], total, page, pages }`

### GET /api/products/:id
- Response: `{ product }`

### GET /api/products/best-deals
- Query: `?gender=&limit=8`
- Response: `{ products[] }`

## Collections
### GET /api/collections
- Query: `?gender=`
- Response: `{ collections[] }`

### GET /api/collections/:slug
- Response: `{ collection, products[] }`

## Brands
### GET /api/brands
- Response: `{ brands[] }`

## Favorites
### GET /api/favorites (auth required)
- Response: `{ favorites[] }`

### POST /api/favorites/:product_id (auth required)
- Response: `{ message }`

### DELETE /api/favorites/:product_id (auth required)
- Response: `{ message }`

---

## Mock Data to Replace
- `heroData` → static (keep in frontend)
- `aboutData` → static (keep in frontend)
- `collections` → GET /api/collections
- `featuredProducts` → GET /api/products/best-deals
- `brands` → GET /api/brands
- `brandShowcase` → GET /api/brands (with images)

## Frontend Integration
- Add AuthContext for JWT token management
- Add Login/Register pages
- Protected route wrapper — redirect to login if not authenticated
- Replace mockData imports with API calls using axios
- Add favorites (heart icon) on product cards
