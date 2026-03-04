"""
Trendora Seed Data - Curated fashion products from multiple online sources.
All products represent real-world fashion items with competitive pricing.
"""
import uuid

async def seed_all(db):
    """Seed collections, products, and brands into MongoDB"""

    # Clear existing
    await db.products.delete_many({})
    await db.collections.delete_many({})
    await db.brands.delete_many({})

    # ======================== COLLECTIONS ========================
    collections = [
        {
            "id": str(uuid.uuid4()),
            "name": "Streetwear Culture",
            "slug": "streetwear",
            "number": "001",
            "subtitle": "Urban Expression",
            "gender": "unisex",
            "image": "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Formal Elegance",
            "slug": "formal",
            "number": "002",
            "subtitle": "Refined Sophistication",
            "gender": "men",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Luxury Redefined",
            "slug": "luxury",
            "number": "003",
            "subtitle": "Premium for Less",
            "gender": "women",
            "image": "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?w=800&q=80"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Athleisure Fusion",
            "slug": "athleisure",
            "number": "004",
            "subtitle": "Move in Style",
            "gender": "unisex",
            "image": "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Casual Essentials",
            "slug": "casual",
            "number": "005",
            "subtitle": "Everyday Elevated",
            "gender": "unisex",
            "image": "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?w=800&q=80"
        }
    ]
    await db.collections.insert_many(collections)

    # ======================== BRANDS ========================
    brands = [
        {"id": str(uuid.uuid4()), "name": "ZARA", "logo": "Z", "image": "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80", "platform": "zara.com"},
        {"id": str(uuid.uuid4()), "name": "H&M", "logo": "H", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", "platform": "hm.com"},
        {"id": str(uuid.uuid4()), "name": "NIKE", "logo": "N", "image": "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&q=80", "platform": "nike.com"},
        {"id": str(uuid.uuid4()), "name": "ADIDAS", "logo": "A", "image": "https://images.pexels.com/photos/7741187/pexels-photo-7741187.jpeg?auto=compress&cs=tinysrgb&w=400", "platform": "adidas.com"},
        {"id": str(uuid.uuid4()), "name": "UNIQLO", "logo": "U", "image": "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?w=400&q=80", "platform": "uniqlo.com"},
        {"id": str(uuid.uuid4()), "name": "MANGO", "logo": "M", "image": "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?w=400&q=80", "platform": "mango.com"},
        {"id": str(uuid.uuid4()), "name": "COS", "logo": "C", "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", "platform": "cos.com"},
        {"id": str(uuid.uuid4()), "name": "ASOS", "logo": "AS", "image": "https://images.pexels.com/photos/28994265/pexels-photo-28994265.jpeg?auto=compress&cs=tinysrgb&w=400", "platform": "asos.com"},
        {"id": str(uuid.uuid4()), "name": "& OTHER STORIES", "logo": "&", "image": "https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=400&q=80", "platform": "stories.com"},
        {"id": str(uuid.uuid4()), "name": "MASSIMO DUTTI", "logo": "MD", "image": "https://images.unsplash.com/photo-1618355281911-84e6ec751d84?w=400&q=80", "platform": "massimodutti.com"},
    ]
    await db.brands.insert_many(brands)

    # ======================== PRODUCTS ========================
    products = [
        # STREETWEAR - UNISEX
        {"id": str(uuid.uuid4()), "name": "Oversized Graphic Tee", "brand": "ZARA", "category": "streetwear", "gender": "unisex",
         "original_price": 45.99, "sale_price": 29.99, "discount": 35,
         "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80",
         "source": "zara.com", "description": "Bold oversized graphic t-shirt with urban-inspired print. Premium cotton blend.",
         "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black", "White", "Charcoal"]},

        {"id": str(uuid.uuid4()), "name": "Cargo Jogger Pants", "brand": "H&M", "category": "streetwear", "gender": "unisex",
         "original_price": 59.99, "sale_price": 34.99, "discount": 42,
         "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80",
         "source": "hm.com", "description": "Relaxed fit cargo joggers with multiple utility pockets. Elastic waistband.",
         "sizes": ["S", "M", "L", "XL"], "colors": ["Olive", "Black", "Khaki"]},

        {"id": str(uuid.uuid4()), "name": "Vintage Denim Jacket", "brand": "ASOS", "category": "streetwear", "gender": "unisex",
         "original_price": 89.00, "sale_price": 52.00, "discount": 42,
         "image": "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80",
         "source": "asos.com", "description": "Washed denim jacket with classic collar. Button-front closure.",
         "sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["Light Wash", "Medium Wash"]},

        {"id": str(uuid.uuid4()), "name": "Streetwear Hoodie", "brand": "ZARA", "category": "streetwear", "gender": "unisex",
         "original_price": 69.90, "sale_price": 44.90, "discount": 36,
         "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80",
         "source": "zara.com", "description": "Heavy-weight cotton hoodie with kangaroo pocket. Oversized drop shoulder fit.",
         "sizes": ["S", "M", "L", "XL"], "colors": ["Black", "Grey", "Cream"]},

        # FORMAL - MEN
        {"id": str(uuid.uuid4()), "name": "Tailored Slim Blazer", "brand": "H&M", "category": "formal", "gender": "men",
         "original_price": 89.99, "sale_price": 54.99, "discount": 39,
         "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
         "source": "hm.com", "description": "Slim-fit single-breasted blazer in premium wool blend. Notch lapels.",
         "sizes": ["36", "38", "40", "42", "44"], "colors": ["Navy", "Charcoal", "Black"]},

        {"id": str(uuid.uuid4()), "name": "Oxford Dress Shirt", "brand": "MASSIMO DUTTI", "category": "formal", "gender": "men",
         "original_price": 79.95, "sale_price": 49.95, "discount": 38,
         "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
         "source": "massimodutti.com", "description": "Slim-fit Oxford cotton shirt with button-down collar. Easy iron finish.",
         "sizes": ["S", "M", "L", "XL"], "colors": ["White", "Light Blue", "Pink"]},

        {"id": str(uuid.uuid4()), "name": "Wool Blend Trousers", "brand": "COS", "category": "formal", "gender": "men",
         "original_price": 115.00, "sale_price": 69.00, "discount": 40,
         "image": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
         "source": "cos.com", "description": "Straight-leg wool blend trousers with pressed crease. Elasticated back waist.",
         "sizes": ["28", "30", "32", "34", "36"], "colors": ["Black", "Grey", "Navy"]},

        {"id": str(uuid.uuid4()), "name": "Silk Blend Tie", "brand": "MASSIMO DUTTI", "category": "formal", "gender": "men",
         "original_price": 49.95, "sale_price": 29.95, "discount": 40,
         "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&q=80",
         "source": "massimodutti.com", "description": "7cm width silk blend tie in classic pattern. Handcrafted finish.",
         "sizes": ["One Size"], "colors": ["Burgundy", "Navy", "Black"]},

        # LUXURY - WOMEN
        {"id": str(uuid.uuid4()), "name": "Minimalist Leather Bag", "brand": "MANGO", "category": "luxury", "gender": "women",
         "original_price": 129.99, "sale_price": 79.99, "discount": 38,
         "image": "https://images.unsplash.com/photo-1613909671501-f9678ffc1d33?w=400&q=80",
         "source": "mango.com", "description": "Structured leather tote bag with magnetic closure. Interior zip pocket.",
         "sizes": ["One Size"], "colors": ["Black", "Tan", "Cream"]},

        {"id": str(uuid.uuid4()), "name": "Cashmere Blend Sweater", "brand": "COS", "category": "luxury", "gender": "women",
         "original_price": 175.00, "sale_price": 99.00, "discount": 43,
         "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80",
         "source": "cos.com", "description": "Relaxed-fit cashmere blend sweater with ribbed trims. Luxuriously soft hand-feel.",
         "sizes": ["XS", "S", "M", "L"], "colors": ["Camel", "Black", "Ivory"]},

        {"id": str(uuid.uuid4()), "name": "Wool Blend Coat", "brand": "& OTHER STORIES", "category": "luxury", "gender": "women",
         "original_price": 249.00, "sale_price": 149.00, "discount": 40,
         "image": "https://images.unsplash.com/photo-1589363358751-ab05797e5629?w=400&q=80",
         "source": "stories.com", "description": "Double-breasted wool blend coat with wide lapels. Belted waist for a tailored silhouette.",
         "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Camel", "Black", "Grey"]},

        {"id": str(uuid.uuid4()), "name": "Satin Midi Skirt", "brand": "MANGO", "category": "luxury", "gender": "women",
         "original_price": 89.99, "sale_price": 54.99, "discount": 39,
         "image": "https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=400&q=80",
         "source": "mango.com", "description": "Flowing satin midi skirt with elastic waistband. Bias cut for elegant draping.",
         "sizes": ["XS", "S", "M", "L"], "colors": ["Champagne", "Black", "Forest Green"]},

        {"id": str(uuid.uuid4()), "name": "Leather Ankle Boots", "brand": "& OTHER STORIES", "category": "luxury", "gender": "women",
         "original_price": 199.00, "sale_price": 119.00, "discount": 40,
         "image": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
         "source": "stories.com", "description": "Square-toe leather ankle boots with block heel. Zip closure at inner side.",
         "sizes": ["36", "37", "38", "39", "40", "41"], "colors": ["Black", "Brown"]},

        # ATHLEISURE - UNISEX
        {"id": str(uuid.uuid4()), "name": "Performance Joggers", "brand": "NIKE", "category": "athleisure", "gender": "unisex",
         "original_price": 75.00, "sale_price": 49.99, "discount": 33,
         "image": "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=400&q=80",
         "source": "nike.com", "description": "Dri-FIT technology joggers with tapered leg. Zip pockets for secure storage.",
         "sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["Black", "Grey", "Navy"]},

        {"id": str(uuid.uuid4()), "name": "Tech Fleece Hoodie", "brand": "ADIDAS", "category": "athleisure", "gender": "men",
         "original_price": 85.00, "sale_price": 59.99, "discount": 29,
         "image": "https://images.pexels.com/photos/7741187/pexels-photo-7741187.jpeg?auto=compress&cs=tinysrgb&w=400",
         "source": "adidas.com", "description": "Lightweight tech fleece hoodie with moisture-wicking fabric. Full-zip front.",
         "sizes": ["S", "M", "L", "XL"], "colors": ["Black", "Grey Heather", "Navy"]},

        {"id": str(uuid.uuid4()), "name": "Running Sneakers Pro", "brand": "NIKE", "category": "athleisure", "gender": "unisex",
         "original_price": 130.00, "sale_price": 84.99, "discount": 35,
         "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
         "source": "nike.com", "description": "React foam cushioning for responsive comfort. Lightweight breathable upper.",
         "sizes": ["7", "8", "9", "10", "11", "12"], "colors": ["White/Red", "Black/White", "Grey"]},

        {"id": str(uuid.uuid4()), "name": "Sports Bra - High Support", "brand": "ADIDAS", "category": "athleisure", "gender": "women",
         "original_price": 55.00, "sale_price": 34.99, "discount": 36,
         "image": "https://images.unsplash.com/photo-1618355281911-84e6ec751d84?w=400&q=80",
         "source": "adidas.com", "description": "High-support sports bra with AEROREADY technology. Adjustable straps and hook-and-eye closure.",
         "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black", "White", "Coral"]},

        {"id": str(uuid.uuid4()), "name": "Compression Leggings", "brand": "NIKE", "category": "athleisure", "gender": "women",
         "original_price": 70.00, "sale_price": 45.99, "discount": 34,
         "image": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
         "source": "nike.com", "description": "High-waisted compression leggings with Dri-FIT. Hidden waistband pocket.",
         "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black", "Dark Grey", "Navy"]},

        # CASUAL - MIXED
        {"id": str(uuid.uuid4()), "name": "Relaxed Fit Denim", "brand": "UNIQLO", "category": "casual", "gender": "men",
         "original_price": 59.90, "sale_price": 39.90, "discount": 33,
         "image": "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?w=400&q=80",
         "source": "uniqlo.com", "description": "Relaxed straight-fit jeans in stretch denim. Ultra comfortable for all-day wear.",
         "sizes": ["28", "30", "32", "34", "36"], "colors": ["Blue", "Dark Wash", "Black"]},

        {"id": str(uuid.uuid4()), "name": "Linen Summer Shirt", "brand": "ASOS", "category": "casual", "gender": "women",
         "original_price": 42.00, "sale_price": 28.00, "discount": 33,
         "image": "https://images.pexels.com/photos/28994265/pexels-photo-28994265.jpeg?auto=compress&cs=tinysrgb&w=400",
         "source": "asos.com", "description": "Lightweight linen blend shirt in relaxed fit. Button-through front, patch chest pocket.",
         "sizes": ["XS", "S", "M", "L"], "colors": ["White", "Sage", "Sand"]},

        {"id": str(uuid.uuid4()), "name": "Essential Crew Neck Tee", "brand": "UNIQLO", "category": "casual", "gender": "unisex",
         "original_price": 19.90, "sale_price": 12.90, "discount": 35,
         "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
         "source": "uniqlo.com", "description": "Supima cotton crew neck t-shirt. Perfectly weighted for everyday comfort.",
         "sizes": ["XS", "S", "M", "L", "XL", "XXL"], "colors": ["White", "Black", "Navy", "Grey", "Olive"]},

        {"id": str(uuid.uuid4()), "name": "Chino Shorts", "brand": "H&M", "category": "casual", "gender": "men",
         "original_price": 34.99, "sale_price": 22.99, "discount": 34,
         "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80",
         "source": "hm.com", "description": "Regular fit chino shorts in cotton twill. Side pockets and back welt pockets.",
         "sizes": ["28", "30", "32", "34", "36"], "colors": ["Beige", "Navy", "Olive"]},

        {"id": str(uuid.uuid4()), "name": "Wrap Midi Dress", "brand": "MANGO", "category": "casual", "gender": "women",
         "original_price": 79.99, "sale_price": 49.99, "discount": 38,
         "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
         "source": "mango.com", "description": "Flowing wrap midi dress in printed viscose. Self-tie belt at waist.",
         "sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Floral Print", "Black", "Blue"]},

        {"id": str(uuid.uuid4()), "name": "Canvas Sneakers", "brand": "ASOS", "category": "casual", "gender": "unisex",
         "original_price": 45.00, "sale_price": 27.00, "discount": 40,
         "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
         "source": "asos.com", "description": "Classic low-top canvas sneakers with rubber sole. Timeless minimal design.",
         "sizes": ["6", "7", "8", "9", "10", "11", "12"], "colors": ["White", "Black", "Navy"]},

        {"id": str(uuid.uuid4()), "name": "Ribbed Knit Cardigan", "brand": "COS", "category": "casual", "gender": "women",
         "original_price": 99.00, "sale_price": 62.00, "discount": 37,
         "image": "https://images.unsplash.com/photo-1434389677669-e08b4cda3a0a?w=400&q=80",
         "source": "cos.com", "description": "Oversized ribbed knit cardigan with V-neck. Button-through front in organic cotton.",
         "sizes": ["XS", "S", "M", "L"], "colors": ["Cream", "Black", "Dusty Rose"]},

        {"id": str(uuid.uuid4()), "name": "Polo Shirt Classic", "brand": "UNIQLO", "category": "casual", "gender": "men",
         "original_price": 39.90, "sale_price": 24.90, "discount": 38,
         "image": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80",
         "source": "uniqlo.com", "description": "DRY Pique polo shirt with moisture-wicking. Classic fit with ribbed collar.",
         "sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["White", "Navy", "Red", "Green"]},

        # EXTRA HIGH-DISCOUNT ITEMS
        {"id": str(uuid.uuid4()), "name": "Leather Belt", "brand": "MASSIMO DUTTI", "category": "formal", "gender": "men",
         "original_price": 59.95, "sale_price": 29.95, "discount": 50,
         "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
         "source": "massimodutti.com", "description": "Italian leather belt with brushed metal buckle. 3cm width.",
         "sizes": ["85", "90", "95", "100", "105"], "colors": ["Black", "Brown"]},

        {"id": str(uuid.uuid4()), "name": "Statement Earrings", "brand": "& OTHER STORIES", "category": "luxury", "gender": "women",
         "original_price": 35.00, "sale_price": 17.50, "discount": 50,
         "image": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
         "source": "stories.com", "description": "Gold-plated drop earrings with geometric design. Post back closure.",
         "sizes": ["One Size"], "colors": ["Gold", "Silver"]},

        {"id": str(uuid.uuid4()), "name": "Windbreaker Jacket", "brand": "ADIDAS", "category": "athleisure", "gender": "unisex",
         "original_price": 95.00, "sale_price": 52.00, "discount": 45,
         "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
         "source": "adidas.com", "description": "Lightweight windbreaker with hood. Water-resistant fabric with mesh lining.",
         "sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["Black", "Navy/White", "Olive"]},
    ]

    await db.products.insert_many(products)

    return {
        "message": "Database seeded successfully",
        "collections": len(collections),
        "brands": len(brands),
        "products": len(products)
    }
