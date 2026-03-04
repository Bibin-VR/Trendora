#!/usr/bin/env python3
"""
Backend API Testing for Trendora Fashion eCommerce App
Tests all backend endpoints to verify proper functionality
"""
import requests
import json
import sys
from typing import Dict, Any, Optional

# Backend URL from frontend/.env
BASE_URL = "https://threads-store-54.preview.emergentagent.com/api"

# Global variables for test state
auth_token = None
test_user_data = {
    "name": "Sophia Martinez",
    "email": "sophia@trendora.com", 
    "password": "fashion2025",
    "gender_preference": "women"
}
test_product_id = None

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

def test_health_check():
    """Test 1: GET /api/ - Health check"""
    success, response, details = make_request("GET", "/")
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Health Check", True, f"{details} - {response['message']}")
        else:
            return log_test("Health Check", False, f"Invalid response format: {response}")
    else:
        return log_test("Health Check", False, details)

def test_best_deals():
    """Test 2: GET /api/products/best-deals - Should return products (DB auto-seeded)"""
    global test_product_id
    
    success, response, details = make_request("GET", "/products/best-deals")
    
    if success and response:
        if isinstance(response, dict) and "products" in response:
            products = response["products"]
            if len(products) > 0:
                # Store first product ID for favorites testing
                test_product_id = products[0].get("id")
                product_count = len(products)
                sample_product = products[0]["name"] if products else "None"
                return log_test("Get Best Deals", True, 
                               f"{details} - Found {product_count} products, Sample: {sample_product}")
            else:
                return log_test("Get Best Deals", False, "No products returned from seeded database")
        else:
            return log_test("Get Best Deals", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Best Deals", False, details)

def test_products_gender_filter():
    """Test 3: GET /api/products?gender=women - Filter by gender"""
    success, response, details = make_request("GET", "/products?gender=women")
    
    if success and response:
        if isinstance(response, dict) and "products" in response:
            products = response["products"]
            total = response.get("total", 0)
            return log_test("Products Gender Filter (Women)", True, 
                           f"{details} - Found {len(products)} products, Total: {total}")
        else:
            return log_test("Products Gender Filter (Women)", False, f"Invalid response format: {response}")
    else:
        return log_test("Products Gender Filter (Women)", False, details)

def test_products_category_filter():
    """Test 4: GET /api/products?category=streetwear - Filter by category"""
    success, response, details = make_request("GET", "/products?category=streetwear")
    
    if success and response:
        if isinstance(response, dict) and "products" in response:
            products = response["products"]
            total = response.get("total", 0)
            return log_test("Products Category Filter (Streetwear)", True, 
                           f"{details} - Found {len(products)} products, Total: {total}")
        else:
            return log_test("Products Category Filter (Streetwear)", False, f"Invalid response format: {response}")
    else:
        return log_test("Products Category Filter (Streetwear)", False, details)

def test_collections():
    """Test 5: GET /api/collections - List all collections"""
    success, response, details = make_request("GET", "/collections")
    
    if success and response:
        if isinstance(response, dict) and "collections" in response:
            collections = response["collections"]
            collection_count = len(collections)
            sample_collection = collections[0]["name"] if collections else "None"
            return log_test("Get Collections", True, 
                           f"{details} - Found {collection_count} collections, Sample: {sample_collection}")
        else:
            return log_test("Get Collections", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Collections", False, details)

def test_collections_gender_filter():
    """Test 6: GET /api/collections?gender=men - Filter collections by gender"""
    success, response, details = make_request("GET", "/collections?gender=men")
    
    if success and response:
        if isinstance(response, dict) and "collections" in response:
            collections = response["collections"]
            return log_test("Collections Gender Filter (Men)", True, 
                           f"{details} - Found {len(collections)} collections")
        else:
            return log_test("Collections Gender Filter (Men)", False, f"Invalid response format: {response}")
    else:
        return log_test("Collections Gender Filter (Men)", False, details)

def test_brands():
    """Test 7: GET /api/brands - List all brands"""
    success, response, details = make_request("GET", "/brands")
    
    if success and response:
        if isinstance(response, dict) and "brands" in response:
            brands = response["brands"]
            brand_count = len(brands)
            sample_brand = brands[0]["name"] if brands else "None"
            return log_test("Get Brands", True, 
                           f"{details} - Found {brand_count} brands, Sample: {sample_brand}")
        else:
            return log_test("Get Brands", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Brands", False, details)

def test_user_registration():
    """Test 8: POST /api/auth/register - Register new user"""
    success, response, details = make_request("POST", "/auth/register", json_data=test_user_data)
    
    if success and response:
        if isinstance(response, dict) and "token" in response and "user" in response:
            global auth_token
            auth_token = response["token"]
            user_name = response["user"]["name"]
            user_email = response["user"]["email"]
            return log_test("User Registration", True, 
                           f"{details} - Registered: {user_name} ({user_email})")
        else:
            return log_test("User Registration", False, f"Invalid response format: {response}")
    else:
        return log_test("User Registration", False, details)

def test_user_login():
    """Test 9: POST /api/auth/login - Login with credentials"""
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    
    success, response, details = make_request("POST", "/auth/login", json_data=login_data)
    
    if success and response:
        if isinstance(response, dict) and "token" in response and "user" in response:
            global auth_token
            auth_token = response["token"]
            user_name = response["user"]["name"]
            return log_test("User Login", True, 
                           f"{details} - Logged in: {user_name}")
        else:
            return log_test("User Login", False, f"Invalid response format: {response}")
    else:
        return log_test("User Login", False, details)

def test_get_current_user():
    """Test 10: GET /api/auth/me - Get current user with Bearer token"""
    if not auth_token:
        return log_test("Get Current User", False, "No auth token available")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/auth/me", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "user" in response:
            user = response["user"]
            user_name = user.get("name", "Unknown")
            user_email = user.get("email", "Unknown")
            return log_test("Get Current User", True, 
                           f"{details} - User: {user_name} ({user_email})")
        else:
            return log_test("Get Current User", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Current User", False, details)

def test_add_favorite():
    """Test 11: POST /api/favorites/{product_id} - Add product to favorites"""
    if not auth_token:
        return log_test("Add to Favorites", False, "No auth token available")
    
    if not test_product_id:
        return log_test("Add to Favorites", False, "No product ID available")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("POST", f"/favorites/{test_product_id}", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Add to Favorites", True, 
                           f"{details} - {response['message']}")
        else:
            return log_test("Add to Favorites", False, f"Invalid response format: {response}")
    else:
        return log_test("Add to Favorites", False, details)

def test_get_favorites():
    """Test 12: GET /api/favorites - Get user favorites"""
    if not auth_token:
        return log_test("Get Favorites", False, "No auth token available")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("GET", "/favorites", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "favorites" in response:
            favorites = response["favorites"]
            favorite_count = len(favorites)
            return log_test("Get Favorites", True, 
                           f"{details} - Found {favorite_count} favorites")
        else:
            return log_test("Get Favorites", False, f"Invalid response format: {response}")
    else:
        return log_test("Get Favorites", False, details)

def test_remove_favorite():
    """Test 13: DELETE /api/favorites/{product_id} - Remove from favorites"""
    if not auth_token:
        return log_test("Remove from Favorites", False, "No auth token available")
    
    if not test_product_id:
        return log_test("Remove from Favorites", False, "No product ID available")
    
    headers = {"Authorization": f"Bearer {auth_token}"}
    success, response, details = make_request("DELETE", f"/favorites/{test_product_id}", headers=headers)
    
    if success and response:
        if isinstance(response, dict) and "message" in response:
            return log_test("Remove from Favorites", True, 
                           f"{details} - {response['message']}")
        else:
            return log_test("Remove from Favorites", False, f"Invalid response format: {response}")
    else:
        return log_test("Remove from Favorites", False, details)

def main():
    """Run all backend tests in sequence"""
    print("=" * 60)
    print("TRENDORA BACKEND API TESTING")
    print("=" * 60)
    print(f"Testing backend at: {BASE_URL}")
    
    # Test results tracking
    test_results = []
    
    # Run all tests in specified order
    test_results.append(test_health_check())
    test_results.append(test_best_deals())
    test_results.append(test_products_gender_filter())
    test_results.append(test_products_category_filter())
    test_results.append(test_collections())
    test_results.append(test_collections_gender_filter())
    test_results.append(test_brands())
    test_results.append(test_user_registration())
    test_results.append(test_user_login())
    test_results.append(test_get_current_user())
    test_results.append(test_add_favorite())
    test_results.append(test_get_favorites())
    test_results.append(test_remove_favorite())
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
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
        print("\n✅ All tests passed successfully!")
        return 0

if __name__ == "__main__":
    sys.exit(main())