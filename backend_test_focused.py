#!/usr/bin/env python3
"""
Focused Backend Testing for SQLite3 Agriculture Marketplace API
Tests all endpoints with fresh data and proper error handling
"""

import requests
import json
import uuid
import time
from datetime import datetime, date

# Configuration
BASE_URL = "https://frontend-test-6.preview.emergentagent.com/api"

class FocusedBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.test_data = {}
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data=None, params=None):
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, params=params, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            try:
                response_data = response.json() if response.content else {}
            except:
                response_data = {"raw_response": response.text}
            
            return {
                "status_code": response.status_code,
                "data": response_data,
                "success": 200 <= response.status_code < 300
            }
        except Exception as e:
            return {
                "status_code": 0,
                "data": {"error": str(e)},
                "success": False
            }
    
    def test_database_initialization(self):
        """Test database initialization"""
        print("\n=== Testing Database Initialization ===")
        
        result = self.make_request("POST", "/init-database")
        self.log_result(
            "Database Initialization",
            result["success"],
            "Database initialized successfully" if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
    
    def test_system_endpoints(self):
        """Test system endpoints"""
        print("\n=== Testing System Endpoints ===")
        
        # Test root endpoint
        result = self.make_request("GET", "/")
        self.log_result(
            "Root endpoint",
            result["success"] and "message" in result["data"],
            result["data"].get("message", "No message") if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
        
        # Test analytics summary
        result = self.make_request("GET", "/analytics/summary")
        expected_keys = ["total_users", "active_products", "total_orders", "active_conversations", "messages_last_24h", "online_users"]
        success = result["success"] and all(key in result["data"] for key in expected_keys)
        self.log_result(
            "Analytics summary",
            success,
            f"Retrieved analytics with all required fields" if success else f"Failed: {result['data']}",
            result["data"] if not success else None
        )
        
        # Test online users
        result = self.make_request("GET", "/system/online-users")
        self.log_result(
            "Online users endpoint",
            result["success"] and "online_users" in result["data"],
            f"Online users: {len(result['data']['online_users'])}" if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
    
    def test_users_api(self):
        """Test Users API with unique data"""
        print("\n=== Testing Users API ===")
        
        # Generate unique timestamp for test data
        timestamp = str(int(time.time()))
        
        # Create a unique test user
        user_data = {
            "full_name": f"Test User {timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "phone_number": f"+1-555-{timestamp[-4:]}",
            "location": "Test Location, USA",
            "user_type": "farmer"
        }
        
        result = self.make_request("POST", "/users/", user_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_user"] = result["data"]
            self.log_result(
                "Create user",
                True,
                f"Created user: {result['data']['full_name']}"
            )
            
            # Test get user by ID
            user_id = result["data"]["user_id"]
            result = self.make_request("GET", f"/users/{user_id}")
            self.log_result(
                "Get user by ID",
                result["success"],
                "Retrieved user details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
            
            # Test update user
            update_data = {"location": "Updated Location, USA"}
            result = self.make_request("PUT", f"/users/{user_id}", update_data)
            self.log_result(
                "Update user",
                result["success"],
                "User updated successfully" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create user",
                False,
                f"Failed to create user: {result['data']}",
                result["data"]
            )
        
        # Test get all users
        result = self.make_request("GET", "/users/")
        self.log_result(
            "Get all users",
            result["success"] and isinstance(result["data"], list),
            f"Retrieved {len(result['data']) if result['success'] else 0} users",
            result["data"] if not result["success"] else None
        )
    
    def test_categories_api(self):
        """Test Categories API with unique data"""
        print("\n=== Testing Categories API ===")
        
        timestamp = str(int(time.time()))
        
        # Create a unique test category
        category_data = {
            "name": f"Test Category {timestamp}",
            "description": f"Test category created at {timestamp}"
        }
        
        result = self.make_request("POST", "/categories/", category_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_category"] = result["data"]
            self.log_result(
                "Create category",
                True,
                f"Created category: {result['data']['name']}"
            )
            
            # Test get category by ID
            category_id = result["data"]["category_id"]
            result = self.make_request("GET", f"/categories/{category_id}")
            self.log_result(
                "Get category by ID",
                result["success"],
                "Retrieved category details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create category",
                False,
                f"Failed to create category: {result['data']}",
                result["data"]
            )
        
        # Test get all categories
        result = self.make_request("GET", "/categories/")
        self.log_result(
            "Get all categories",
            result["success"] and isinstance(result["data"], list),
            f"Retrieved {len(result['data']) if result['success'] else 0} categories",
            result["data"] if not result["success"] else None
        )
    
    def test_products_api(self):
        """Test Products API"""
        print("\n=== Testing Products API ===")
        
        user = self.test_data.get("test_user")
        category = self.test_data.get("test_category")
        
        if not user or not category:
            self.log_result("Products API Setup", False, "Missing test user or category")
            return
        
        timestamp = str(int(time.time()))
        
        # Create a test product
        product_data = {
            "seller_id": user["user_id"],
            "category_id": category["category_id"],
            "name": f"Test Product {timestamp}",
            "description": f"Test product created at {timestamp}",
            "price": 9.99,
            "quantity_available": 10,
            "unit": "kg",
            "location": "Test Farm",
            "harvest_date": "2024-01-15",
            "expiry_date": "2024-02-15",
            "is_organic": True
        }
        
        result = self.make_request("POST", "/products/", product_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_product"] = result["data"]
            self.log_result(
                "Create product",
                True,
                f"Created product: {result['data']['name']}"
            )
            
            # Test get product by ID
            product_id = result["data"]["product_id"]
            result = self.make_request("GET", f"/products/{product_id}")
            self.log_result(
                "Get product by ID",
                result["success"],
                "Retrieved product details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
            
            # Test update product
            update_data = {"price": 12.99, "quantity_available": 8}
            result = self.make_request("PUT", f"/products/{product_id}", update_data)
            self.log_result(
                "Update product",
                result["success"],
                "Product updated successfully" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create product",
                False,
                f"Failed to create product: {result['data']}",
                result["data"]
            )
        
        # Test get all products
        result = self.make_request("GET", "/products/")
        self.log_result(
            "Get all products",
            result["success"] and isinstance(result["data"], list),
            f"Retrieved {len(result['data']) if result['success'] else 0} products",
            result["data"] if not result["success"] else None
        )
    
    def test_error_handling(self):
        """Test error handling"""
        print("\n=== Testing Error Handling ===")
        
        # Test get non-existent user
        fake_id = str(uuid.uuid4())
        result = self.make_request("GET", f"/users/{fake_id}")
        self.log_result(
            "Get non-existent user",
            result["status_code"] == 404,
            "Correctly returned 404 for non-existent user" if result["status_code"] == 404 else f"Unexpected status: {result['status_code']}",
            result["data"] if result["status_code"] != 404 else None
        )
        
        # Test get non-existent product
        result = self.make_request("GET", f"/products/{fake_id}")
        self.log_result(
            "Get non-existent product",
            result["status_code"] == 404,
            "Correctly returned 404 for non-existent product" if result["status_code"] == 404 else f"Unexpected status: {result['status_code']}",
            result["data"] if result["status_code"] != 404 else None
        )
        
        # Test get non-existent category
        result = self.make_request("GET", f"/categories/{fake_id}")
        self.log_result(
            "Get non-existent category",
            result["status_code"] == 404,
            "Correctly returned 404 for non-existent category" if result["status_code"] == 404 else f"Unexpected status: {result['status_code']}",
            result["data"] if result["status_code"] != 404 else None
        )
    
    def test_data_relationships(self):
        """Test data relationships"""
        print("\n=== Testing Data Relationships ===")
        
        # Test product-category-seller relationship
        product = self.test_data.get("test_product")
        if product:
            result = self.make_request("GET", f"/products/{product['product_id']}")
            has_relationships = (result["success"] and 
                               result["data"].get("seller_name") and 
                               result["data"].get("category_name"))
            self.log_result(
                "Product relationships",
                has_relationships,
                f"Product has seller and category relationships" if has_relationships else "Product relationships incomplete",
                result["data"] if not has_relationships else None
            )
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Focused Backend Testing")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run test suites in order
        self.test_database_initialization()
        self.test_system_endpoints()
        self.test_users_api()
        self.test_categories_api()
        self.test_products_api()
        self.test_error_handling()
        self.test_data_relationships()
        
        # Generate summary
        end_time = time.time()
        duration = end_time - start_time
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⏱️  Duration: {duration:.2f} seconds")
        print(f"📊 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "duration": duration,
            "results": self.results
        }

if __name__ == "__main__":
    tester = FocusedBackendTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if summary["failed_tests"] == 0 else 1)