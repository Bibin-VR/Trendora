#!/usr/bin/env python3
"""
Backend API Testing for NEW Trendora Features
Tests the new cart, order, shipping, and payment endpoints
"""
import requests
import json
import sys
import time
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BASE_URL = "https://threads-store-54.preview.emergentagent.com/api"

# Global variables for test state
auth_token = None
product_ids = []
first_product_id = None
second_product_id = None

def log_test(test_name: str, success: bool, details: str = ""):
    """Log test results with clear formatting"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    return success

def make_request(method: str, endpoint: str, headers: Optional[Dict] = None, json_data: Optional[Dict] = None) -> tuple:
    """Make HTTP request and return (success, response, details)"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method.upper() == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method.upper() == "POST":
            response = requests.post(url, headers=headers, json=json_data, timeout=10)
        elif method.upper() == "PUT":
            response = requests.put(url, headers=headers, json=json_data, timeout=10)
        elif method.upper() == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            return False, None, f"Unsupported HTTP method: {method}"
        
        # Check if response is successful
        if 200 <= response.status_code < 300:
            try:
                json_resp = response.json()
                return True, json_resp, f"Status: {response.status_code}"
            except:
                return True, response.text, f"Status: {response.status_code} (non-JSON response)"
        else:
            try:
                error_detail = response.json().get('detail', 'Unknown error')
                return False, None, f"Status: {response.status_code}, Error: {error_detail}"
            except:
                return False, None, f"Status: {response.status_code}, Response: {response.text[:200]}"
                
    except requests.RequestException as e:
        return False, None, f"Request failed: {str(e)}"

def test_shipping_methods():
    """Test 1: GET /api/shipping-methods - Should return 4 shipping methods"""
    success, response, details = make_request("GET", "/shipping-methods")
    
    if success and response:
        if isinstance(response, dict) and "methods" in response:
            methods = response["methods"]
            if len(methods) == 4:
                method_names = [m["name"] for m in methods]
                expected = ["Standard Shipping", "Express Shipping", "Overnight Delivery", "Store Pickup"]
                if all(name in str(method_names) for name in expected):
                    return log_test("Shipping Methods", True, 
                                   f"{details} - Found all 4 methods: {[m['id'] for m in methods]}")
                else:
                    return log_test("Shipping Methods", False, f"Missing expected methods: {method_names}")
            else:
                return log_test("Shipping Methods", False, f"Expected 4 methods, got {len(methods)}")
        else:
            return log_test("Shipping Methods", False, f"Invalid response format: {response}")
    else:
        return log_test("Shipping Methods", False, details)

def test_razorpay_config():
    """Test 2: GET /api/config/razorpay - Should return configured: false (test mode)"""
    success, response, details = make_request("GET", "/config/razorpay")
    
    if success and response:
        if isinstance(response, dict):
            configured = response.get("configured", True)
            test_mode = response.get("test_mode", False)
            return log_test("Razorpay Config", True, 
                           f"{details} - Configured: {configured}, Test Mode: {test_mode}")
        else:
            return log_test("Razorpay Config", False, f"Invalid response format: {response}")
    else:
        return log_test("Razorpay Config", False, details)

def test_register_user():
    """Test 3: Register a test user and save token"""
    global auth_token
    
    user_data = {
        "name": "Cart Tester",
        "email": "carttest@trendora.com",
        "password": "test1234",
        "gender_preference": "all"
    }
    
    success, response, details = make_request("POST", "/auth/register", json_data=user_data)
    
    if success and response:
        if isinstance(response, dict) and "token" in response and "user" in response:
            auth_token = response["token"]
            user_name = response["user"]["name"]
            user_email = response["user"]["email"]
            return log_test("Register Test User", True, 
                           f"{details} - Registered: {user_name} ({user_email}), Token saved")
        else:
            return log_test("Register Test User", False, f"Invalid response format: {response}")
    else:
        return log_test("Register Test User", False, details)

def test_get_best_deals():
    """Test 4: GET /api/products/best-deals?limit=2 - Get 2 products, save their IDs"""
    global product_ids, first_product_id, second_product_id
    
    success, response, details = make_request("GET", "/products/best-deals?limit=2")
    
    if success and response:
        if isinstance(response, dict) and "products" in response:
            products = response["products"]
            if len(products) >= 2:
                product_ids = [p["id"] for p in products]
                first_product_id = product_ids[0]
                second_product_id = product_ids[1]
                
                # Check for randomized images
                first_image = products[0].get("image", "")
                second_image = products[1].get("image", "")
                images_different = first_image != second_image
                
                return log_test("Get Best Deals (2 products)", True, 
                               f"{details} - Got {len(products)} products, IDs saved: {product_ids[:2]}, Images randomized: {images_different}")
            else:
                return log_test("Get Best Deals (2 products)", False, f"Expected at least 2 products, got {len(products)}")
        else:
            return log_test("Get Best Deals (2 products)", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Best Deals (2 products)", False, details)

def test_add_first_product_to_cart():
    """Test 5: POST /api/cart/add - Add first product to cart"""
    if not auth_token or not first_product_id:
        return log_test("Add First Product to Cart", False, "Missing auth token or product ID")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    cart_data = {"product_id": first_product_id, "quantity": 1}
    
    success, response, details = make_request("POST", "/cart/add", headers=headers, json_data=cart_data)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Add First Product to Cart", True, 
                           f"{details} - {response['message']} (Product: {first_product_id})")
        else:
            return log_test("Add First Product to Cart", False, f"Invalid response format: {response}")
    else:
        return log_test("Add First Product to Cart", False, details)

def test_add_second_product_to_cart():
    """Test 6: POST /api/cart/add - Add second product to cart with quantity 2"""
    if not auth_token or not second_product_id:
        return log_test("Add Second Product to Cart", False, "Missing auth token or product ID")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    cart_data = {"product_id": second_product_id, "quantity": 2}
    
    success, response, details = make_request("POST", "/cart/add", headers=headers, json_data=cart_data)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Add Second Product to Cart", True, 
                           f"{details} - {response['message']} (Product: {second_product_id}, Qty: 2)")
        else:
            return log_test("Add Second Product to Cart", False, f"Invalid response format: {response}")
    else:
        return log_test("Add Second Product to Cart", False, details)

def test_get_cart_with_items():
    """Test 7: GET /api/cart - Should show 2 items with enriched product data"""
    if not auth_token:
        return log_test("Get Cart with Items", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/cart", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "items" in response:
            items = response["items"]
            total = response.get("total", 0)
            item_count = response.get("item_count", 0)
            
            if len(items) == 2:
                # Check enriched product data
                enriched = all("product" in item and "name" in item["product"] for item in items)
                quantities = [item["quantity"] for item in items]
                expected_quantities = [1, 2] # first product qty 1, second product qty 2
                
                return log_test("Get Cart with Items", True, 
                               f"{details} - Items: {len(items)}, Total: ${total}, Count: {item_count}, Enriched: {enriched}, Quantities: {quantities}")
            else:
                return log_test("Get Cart with Items", False, f"Expected 2 items, got {len(items)}")
        else:
            return log_test("Get Cart with Items", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Cart with Items", False, details)

def test_update_first_item_quantity():
    """Test 8: PUT /api/cart/<product_id> - Update first item quantity to 3"""
    if not auth_token or not first_product_id:
        return log_test("Update First Item Quantity", False, "Missing auth token or product ID")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    update_data = {"quantity": 3}
    
    success, response, details = make_request("PUT", f"/cart/{first_product_id}", headers=headers, json_data=update_data)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Update First Item Quantity", True, 
                           f"{details} - {response['message']} (Product: {first_product_id}, New Qty: 3)")
        else:
            return log_test("Update First Item Quantity", False, f"Invalid response format: {response}")
    else:
        return log_test("Update First Item Quantity", False, details)

def test_remove_second_item():
    """Test 9: DELETE /api/cart/<product_id> - Remove second item"""
    if not auth_token or not second_product_id:
        return log_test("Remove Second Item", False, "Missing auth token or product ID")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("DELETE", f"/cart/{second_product_id}", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Remove Second Item", True, 
                           f"{details} - {response['message']} (Product: {second_product_id})")
        else:
            return log_test("Remove Second Item", False, f"Invalid response format: {response}")
    else:
        return log_test("Remove Second Item", False, details)

def test_verify_cart_changes():
    """Test 10: GET /api/cart - Verify changes (should have 1 item with quantity 3)"""
    if not auth_token:
        return log_test("Verify Cart Changes", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/cart", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "items" in response:
            items = response["items"]
            item_count = response.get("item_count", 0)
            
            if len(items) == 1 and items[0]["quantity"] == 3:
                remaining_product = items[0]["product_id"]
                return log_test("Verify Cart Changes", True, 
                               f"{details} - Remaining: 1 item, Quantity: 3, Product: {remaining_product}, Total count: {item_count}")
            else:
                quantities = [item["quantity"] for item in items]
                return log_test("Verify Cart Changes", False, f"Expected 1 item with qty 3, got {len(items)} items with quantities: {quantities}")
        else:
            return log_test("Verify Cart Changes", False, f"Invalid response format: {response}")
    else:
        return log_test("Verify Cart Changes", False, details)

def test_create_order():
    """Test 11: POST /api/orders/create - Create order with express shipping"""
    if not auth_token:
        return log_test("Create Order", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    order_data = {
        "shipping_method": "express",
        "shipping_address": {
            "name": "Test",
            "street": "123 Main St",
            "city": "NYC", 
            "state": "NY",
            "zip": "10001",
            "phone": "555-1234"
        }
    }
    
    success, response, details = make_request("POST", "/orders/create", headers=headers, json_data=order_data)
    
    if success and response:
        if isinstance(response, dict) and "order" in response:
            order = response["order"]
            order_id = order.get("id")
            total = order.get("total")
            status = order.get("status")
            return log_test("Create Order", True, 
                           f"{details} - Order ID: {order_id}, Total: ${total}, Status: {status}")
        else:
            return log_test("Create Order", False, f"Invalid response format: {response}")
    else:
        return log_test("Create Order", False, details)

def test_demo_payment():
    """Test 12: POST /api/orders/demo-payment - Complete demo payment"""
    if not auth_token:
        return log_test("Complete Demo Payment", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("POST", "/orders/demo-payment", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            order_id = response.get("order_id")
            status = response.get("status")
            return log_test("Complete Demo Payment", True, 
                           f"{details} - {response['message']}, Order: {order_id}, Status: {status}")
        else:
            return log_test("Complete Demo Payment", False, f"Invalid response format: {response}")
    else:
        return log_test("Complete Demo Payment", False, details)

def test_get_orders():
    """Test 13: GET /api/orders - Verify order is 'paid'"""
    if not auth_token:
        return log_test("Get Orders", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/orders", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "orders" in response:
            orders = response["orders"]
            if len(orders) > 0:
                latest_order = orders[0]  # Orders should be sorted by created_at desc
                status = latest_order.get("status")
                order_id = latest_order.get("id")
                total = latest_order.get("total")
                return log_test("Get Orders", True, 
                               f"{details} - Found {len(orders)} orders, Latest: {order_id}, Status: {status}, Total: ${total}")
            else:
                return log_test("Get Orders", False, "No orders found")
        else:
            return log_test("Get Orders", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Orders", False, details)

def test_cart_empty_after_payment():
    """Test 14: GET /api/cart - Cart should be empty after payment"""
    if not auth_token:
        return log_test("Verify Cart Empty", False, "Missing auth token")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/cart", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "items" in response:
            items = response["items"]
            total = response.get("total", 0)
            item_count = response.get("item_count", 0)
            
            if len(items) == 0 and total == 0 and item_count == 0:
                return log_test("Verify Cart Empty", True, 
                               f"{details} - Cart cleared: Items: {len(items)}, Total: ${total}, Count: {item_count}")
            else:
                return log_test("Verify Cart Empty", False, f"Cart not empty: Items: {len(items)}, Total: ${total}")
        else:
            return log_test("Verify Cart Empty", False, f"Invalid response format: {response}")
    else:
        return log_test("Verify Cart Empty", False, details)

def test_image_randomization():
    """Test 15: Verify products have randomized images (different between requests)"""
    success1, response1, _ = make_request("GET", "/products/best-deals?limit=5")
    time.sleep(0.5)  # Small delay
    success2, response2, _ = make_request("GET", "/products/best-deals?limit=5")
    
    if success1 and success2 and response1 and response2:
        products1 = response1.get("products", [])
        products2 = response2.get("products", [])
        
        if len(products1) >= 2 and len(products2) >= 2:
            # Compare images from same product across requests
            images1 = [p.get("image", "") for p in products1[:2]]
            images2 = [p.get("image", "") for p in products2[:2]]
            
            # Check if images are different (randomized)
            different_images = any(img1 != img2 for img1, img2 in zip(images1, images2))
            
            return log_test("Image Randomization", True, 
                           f"Images randomized between requests: {different_images}, Sample images: {images1[:1]}")
        else:
            return log_test("Image Randomization", False, "Not enough products to test randomization")
    else:
        return log_test("Image Randomization", False, "Failed to fetch products for comparison")

def main():
    """Run all new feature tests in sequence"""
    print("=" * 60)
    print("TRENDORA NEW FEATURES TESTING")
    print("=" * 60)
    print(f"Testing backend at: {BASE_URL}")
    
    # Test results tracking
    test_results = []
    
    # Run all tests in specified order
    test_results.append(test_shipping_methods())
    test_results.append(test_razorpay_config())
    test_results.append(test_register_user())
    test_results.append(test_get_best_deals())
    test_results.append(test_add_first_product_to_cart())
    test_results.append(test_add_second_product_to_cart())
    test_results.append(test_get_cart_with_items())
    test_results.append(test_update_first_item_quantity())
    test_results.append(test_remove_second_item())
    test_results.append(test_verify_cart_changes())
    test_results.append(test_create_order())
    test_results.append(test_demo_payment())
    test_results.append(test_get_orders())
    test_results.append(test_cart_empty_after_payment())
    test_results.append(test_image_randomization())
    
    # Summary
    print("\n" + "=" * 60)
    print("NEW FEATURES TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results)
    total = len(test_results)
    failed = total - passed
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if failed > 0:
        print("\n❌ Some tests failed - check details above")
        return 1
    else:
        print("\n✅ All new feature tests passed successfully!")
        return 0

if __name__ == "__main__":
    sys.exit(main())