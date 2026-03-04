from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import bcrypt
from jose import jwt, JWTError
import math
import hmac
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'trendora')]

# JWT config
SECRET_KEY = os.environ.get('JWT_SECRET', 'trendora-secret-key-2025-fashion-aggregator')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 72

# Razorpay config
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_test_REPLACE_ME')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'REPLACE_ME_WITH_SECRET')

razorpay_client = None
try:
    if RAZORPAY_KEY_ID and 'REPLACE_ME' not in RAZORPAY_KEY_ID:
        import razorpay
        razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logging.warning(f"Razorpay not configured: {e}")

# Create the main app
app = FastAPI(title="Trendora API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ======================== IMAGE POOLS ========================
IMAGE_POOLS = {
    "streetwear": [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
    ],
    "formal": [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
        "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    ],
    "luxury": [
        "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?w=400&q=80",
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
        "https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=400&q=80",
        "https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=400&q=80",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    ],
    "athleisure": [
        "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        "https://images.unsplash.com/photo-1618355281911-84e6ec751d84?w=400&q=80",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    ],
    "casual": [
        "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?w=400&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cda3a0a?w=400&q=80",
        "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80",
    ]
}

def randomize_product_images(products):
    """Shuffle product images from category pool on each request"""
    for p in products:
        cat = p.get("category", "casual")
        pool = IMAGE_POOLS.get(cat, IMAGE_POOLS["casual"])
        p["image"] = random.choice(pool)
    return products

# ======================== MODELS ========================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    gender_preference: Optional[str] = "all"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CartItemAdd(BaseModel):
    product_id: str
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None

class CartItemUpdate(BaseModel):
    quantity: int

class CreateOrder(BaseModel):
    shipping_method: str
    shipping_address: dict

class VerifyPayment(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

# ======================== SHIPPING METHODS ========================

SHIPPING_METHODS = [
    {"id": "standard", "name": "Standard Shipping", "description": "5-7 business days", "price": 4.99, "free_above": 50.0, "estimated_days": "5-7"},
    {"id": "express", "name": "Express Shipping", "description": "2-3 business days", "price": 9.99, "free_above": None, "estimated_days": "2-3"},
    {"id": "overnight", "name": "Overnight Delivery", "description": "Next business day", "price": 19.99, "free_above": None, "estimated_days": "1"},
    {"id": "pickup", "name": "Store Pickup", "description": "Ready in 2 hours", "price": 0.0, "free_above": None, "estimated_days": "Same day"},
]

# ======================== AUTH HELPERS ========================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": user_id, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ======================== AUTH ROUTES ========================

@api_router.post("/auth/register")
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id, "name": data.name, "email": data.email,
        "password_hash": hash_password(data.password),
        "gender_preference": data.gender_preference or "all",
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user_doc)
    token = create_token(user_id)
    return {
        "user": {"id": user_id, "name": data.name, "email": data.email,
                 "gender_preference": user_doc["gender_preference"], "created_at": user_doc["created_at"]},
        "token": token
    }

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"])
    return {
        "user": {"id": user["id"], "name": user["name"], "email": user["email"],
                 "gender_preference": user.get("gender_preference", "all"),
                 "created_at": user["created_at"]},
        "token": token
    }

@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)):
    return {
        "user": {"id": user["id"], "name": user["name"], "email": user["email"],
                 "gender_preference": user.get("gender_preference", "all"),
                 "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]}
    }

# ======================== PRODUCTS ROUTES ========================

@api_router.get("/products")
async def get_products(
    gender: Optional[str] = Query(None), category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None), sort: Optional[str] = Query(None),
    page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=50)
):
    query = {}
    if gender and gender != "all":
        query["gender"] = {"$in": [gender, "unisex"]}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = {"$regex": brand, "$options": "i"}

    sort_field = [("discount", -1)]
    if sort == "price_asc": sort_field = [("sale_price", 1)]
    elif sort == "price_desc": sort_field = [("sale_price", -1)]
    elif sort == "discount": sort_field = [("discount", -1)]

    total = await db.products.count_documents(query)
    skip = (page - 1) * limit
    products = await db.products.find(query, {"_id": 0}).skip(skip).limit(limit).sort(sort_field).to_list(limit)
    products = randomize_product_images(products)
    return {"products": products, "total": total, "page": page, "pages": math.ceil(total / limit) if total > 0 else 1}

@api_router.get("/products/best-deals")
async def get_best_deals(gender: Optional[str] = Query(None), limit: int = Query(8, ge=1, le=20)):
    query = {}
    if gender and gender != "all":
        query["gender"] = {"$in": [gender, "unisex"]}
    products = await db.products.find(query, {"_id": 0}).sort("discount", -1).limit(limit).to_list(limit)
    products = randomize_product_images(products)
    return {"products": products}

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": product}

# ======================== COLLECTIONS ROUTES ========================

@api_router.get("/collections")
async def get_collections(gender: Optional[str] = Query(None)):
    query = {}
    if gender and gender != "all":
        query["gender"] = {"$in": [gender, "unisex"]}
    collections = await db.collections.find(query, {"_id": 0}).to_list(20)
    return {"collections": collections}

@api_router.get("/collections/{slug}")
async def get_collection(slug: str, gender: Optional[str] = Query(None)):
    collection = await db.collections.find_one({"slug": slug}, {"_id": 0})
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    pq = {"category": slug}
    if gender and gender != "all":
        pq["gender"] = {"$in": [gender, "unisex"]}
    products = await db.products.find(pq, {"_id": 0}).sort("discount", -1).to_list(50)
    products = randomize_product_images(products)
    return {"collection": collection, "products": products}

# ======================== BRANDS ROUTES ========================

@api_router.get("/brands")
async def get_brands():
    brands = await db.brands.find({}, {"_id": 0}).to_list(50)
    return {"brands": brands}

# ======================== SHIPPING ROUTES ========================

@api_router.get("/shipping-methods")
async def get_shipping_methods():
    return {"methods": SHIPPING_METHODS}

# ======================== CART ROUTES ========================

@api_router.get("/cart")
async def get_cart(user=Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    if not cart:
        return {"items": [], "total": 0, "item_count": 0}
    # Enrich with product data
    items = []
    total = 0
    for item in cart.get("items", []):
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            enriched = {**item, "product": product}
            items.append(enriched)
            total += product["sale_price"] * item["quantity"]
    return {"items": items, "total": round(total, 2), "item_count": sum(i["quantity"] for i in items)}

@api_router.post("/cart/add")
async def add_to_cart(data: CartItemAdd, user=Depends(get_current_user)):
    product = await db.products.find_one({"id": data.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = await db.carts.find_one({"user_id": user["id"]})
    if not cart:
        await db.carts.insert_one({
            "user_id": user["id"],
            "items": [{"product_id": data.product_id, "quantity": data.quantity,
                       "size": data.size or (product.get("sizes", ["M"])[0]),
                       "color": data.color or (product.get("colors", ["Black"])[0])}],
            "updated_at": datetime.utcnow()
        })
    else:
        existing = next((i for i in cart["items"] if i["product_id"] == data.product_id), None)
        if existing:
            await db.carts.update_one(
                {"user_id": user["id"], "items.product_id": data.product_id},
                {"$inc": {"items.$.quantity": data.quantity}, "$set": {"updated_at": datetime.utcnow()}}
            )
        else:
            await db.carts.update_one(
                {"user_id": user["id"]},
                {"$push": {"items": {"product_id": data.product_id, "quantity": data.quantity,
                                     "size": data.size or (product.get("sizes", ["M"])[0]),
                                     "color": data.color or (product.get("colors", ["Black"])[0])}},
                 "$set": {"updated_at": datetime.utcnow()}}
            )
    return {"message": "Added to cart"}

@api_router.put("/cart/{product_id}")
async def update_cart_item(product_id: str, data: CartItemUpdate, user=Depends(get_current_user)):
    if data.quantity <= 0:
        await db.carts.update_one(
            {"user_id": user["id"]},
            {"$pull": {"items": {"product_id": product_id}}, "$set": {"updated_at": datetime.utcnow()}}
        )
    else:
        await db.carts.update_one(
            {"user_id": user["id"], "items.product_id": product_id},
            {"$set": {"items.$.quantity": data.quantity, "updated_at": datetime.utcnow()}}
        )
    return {"message": "Cart updated"}

@api_router.delete("/cart/{product_id}")
async def remove_from_cart(product_id: str, user=Depends(get_current_user)):
    await db.carts.update_one(
        {"user_id": user["id"]},
        {"$pull": {"items": {"product_id": product_id}}, "$set": {"updated_at": datetime.utcnow()}}
    )
    return {"message": "Removed from cart"}

@api_router.delete("/cart")
async def clear_cart(user=Depends(get_current_user)):
    await db.carts.delete_one({"user_id": user["id"]})
    return {"message": "Cart cleared"}

# ======================== ORDER & PAYMENT ROUTES ========================

@api_router.post("/orders/create")
async def create_order(data: CreateOrder, user=Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": user["id"]})
    if not cart or not cart.get("items"):
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Calculate totals
    subtotal = 0
    order_items = []
    for item in cart["items"]:
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            order_items.append({**item, "price": product["sale_price"], "name": product["name"], "brand": product["brand"]})
            subtotal += product["sale_price"] * item["quantity"]

    # Shipping cost
    shipping = next((m for m in SHIPPING_METHODS if m["id"] == data.shipping_method), SHIPPING_METHODS[0])
    shipping_cost = shipping["price"]
    if shipping.get("free_above") and subtotal >= shipping["free_above"]:
        shipping_cost = 0.0

    total = round(subtotal + shipping_cost, 2)
    amount_paise = int(total * 100)

    order_id = str(uuid.uuid4())[:12].upper()

    # Create Razorpay order if configured
    razorpay_order = None
    if razorpay_client:
        try:
            razorpay_order = razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt": order_id,
                "payment_capture": 1
            })
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}")

    order_doc = {
        "id": order_id,
        "user_id": user["id"],
        "items": order_items,
        "subtotal": round(subtotal, 2),
        "shipping_method": data.shipping_method,
        "shipping_cost": shipping_cost,
        "shipping_address": data.shipping_address,
        "total": total,
        "currency": "INR",
        "status": "pending",
        "razorpay_order_id": razorpay_order["id"] if razorpay_order else None,
        "created_at": datetime.utcnow()
    }
    await db.orders.insert_one(order_doc)

    return {
        "order": {
            "id": order_id,
            "total": total,
            "currency": "INR",
            "razorpay_order_id": razorpay_order["id"] if razorpay_order else None,
            "razorpay_key": RAZORPAY_KEY_ID if razorpay_client else None,
            "status": "pending"
        }
    }

@api_router.post("/orders/verify-payment")
async def verify_payment(data: VerifyPayment, user=Depends(get_current_user)):
    # Verify signature
    if razorpay_client:
        try:
            generated_signature = hmac.new(
                RAZORPAY_KEY_SECRET.encode('utf-8'),
                f"{data.razorpay_order_id}|{data.razorpay_payment_id}".encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            if generated_signature != data.razorpay_signature:
                raise HTTPException(status_code=400, detail="Payment verification failed")
        except Exception as e:
            logger.error(f"Payment verification error: {e}")

    # Update order
    await db.orders.update_one(
        {"razorpay_order_id": data.razorpay_order_id},
        {"$set": {
            "status": "paid",
            "razorpay_payment_id": data.razorpay_payment_id,
            "paid_at": datetime.utcnow()
        }}
    )
    # Clear cart
    await db.carts.delete_one({"user_id": user["id"]})
    return {"message": "Payment verified", "status": "paid"}

# Demo payment for test mode without real Razorpay key
@api_router.post("/orders/demo-payment")
async def demo_payment(user=Depends(get_current_user)):
    """Complete order with demo payment when Razorpay is not configured"""
    order = await db.orders.find_one({"user_id": user["id"], "status": "pending"}, sort=[("created_at", -1)])
    if not order:
        raise HTTPException(status_code=404, detail="No pending order found")
    await db.orders.update_one(
        {"id": order["id"]},
        {"$set": {"status": "paid", "payment_method": "demo", "paid_at": datetime.utcnow()}}
    )
    await db.carts.delete_one({"user_id": user["id"]})
    return {"message": "Demo payment completed", "order_id": order["id"], "status": "paid"}

@api_router.get("/orders")
async def get_orders(user=Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {"orders": orders}

@api_router.get("/config/razorpay")
async def get_razorpay_config():
    """Check if Razorpay is configured"""
    is_configured = razorpay_client is not None
    return {
        "configured": is_configured,
        "key_id": RAZORPAY_KEY_ID if is_configured else None,
        "test_mode": "test" in RAZORPAY_KEY_ID if is_configured else True
    }

# ======================== FAVORITES ROUTES ========================

@api_router.get("/favorites")
async def get_favorites(user=Depends(get_current_user)):
    favs = await db.favorites.find({"user_id": user["id"]}, {"_id": 0}).to_list(100)
    product_ids = [f["product_id"] for f in favs]
    products = await db.products.find({"id": {"$in": product_ids}}, {"_id": 0}).to_list(100)
    return {"favorites": products}

@api_router.post("/favorites/{product_id}")
async def add_favorite(product_id: str, user=Depends(get_current_user)):
    existing = await db.favorites.find_one({"user_id": user["id"], "product_id": product_id})
    if existing:
        return {"message": "Already in favorites"}
    await db.favorites.insert_one({"id": str(uuid.uuid4()), "user_id": user["id"], "product_id": product_id, "created_at": datetime.utcnow()})
    return {"message": "Added to favorites"}

@api_router.delete("/favorites/{product_id}")
async def remove_favorite(product_id: str, user=Depends(get_current_user)):
    result = await db.favorites.delete_one({"user_id": user["id"], "product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}

# ======================== SEED ========================

@api_router.post("/seed")
async def seed_database():
    from seed_data import seed_all
    result = await seed_all(db)
    return result

@api_router.get("/")
async def root():
    return {"message": "Trendora API is running", "version": "2.0"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware, allow_credentials=True, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.products.create_index("gender")
    await db.products.create_index("category")
    await db.products.create_index("discount")
    await db.collections.create_index("slug", unique=True)
    await db.favorites.create_index([("user_id", 1), ("product_id", 1)], unique=True)
    await db.carts.create_index("user_id", unique=True)
    await db.orders.create_index("user_id")
    await db.orders.create_index("id", unique=True)

    count = await db.products.count_documents({})
    if count == 0:
        logger.info("Database empty, seeding...")
        from seed_data import seed_all
        await seed_all(db)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
