#!/usr/bin/env python3
"""
Comprehensive Backend Testing for SQLite3 Agriculture Marketplace API
Tests all endpoints including orders, conversations, messages, profiles, and reviews
"""

import requests
import json
import uuid
import time
import asyncio
import websockets
from datetime import datetime, date

# Configuration
BASE_URL = "https://frontend-test-6.preview.emergentagent.com/api"
WS_URL = "wss://frontend-test-6.preview.emergentagent.com/ws"

class ComprehensiveBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.ws_url = WS_URL
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
    
    def setup_test_data(self):
        """Create test data for comprehensive testing"""
        print("\n=== Setting Up Test Data ===")
        
        timestamp = str(int(time.time()))
        
        # Create test users
        users_data = [
            {
                "full_name": f"Farmer User {timestamp}",
                "email": f"farmer{timestamp}@example.com",
                "phone_number": f"+1-555-{timestamp[-4:]}",
                "location": "Farm Location, USA",
                "user_type": "farmer"
            },
            {
                "full_name": f"Buyer User {timestamp}",
                "email": f"buyer{timestamp}@example.com",
                "phone_number": f"+1-555-{timestamp[-3:]}0",
                "location": "City Location, USA",
                "user_type": "buyer"
            }
        ]
        
        for i, user_data in enumerate(users_data):
            result = self.make_request("POST", "/users/", user_data)
            if result["success"] and isinstance(result["data"], dict):
                user_type = "farmer" if user_data["user_type"] == "farmer" else "buyer"
                self.test_data[f"{user_type}_user"] = result["data"]
                self.log_result(f"Create {user_type} user", True, f"Created {user_type} user")
            else:
                self.log_result(f"Create {user_data['user_type']} user", False, f"Failed: {result['data']}")
                return False
        
        # Create test category
        category_data = {
            "name": f"Test Category {timestamp}",
            "description": f"Test category for comprehensive testing"
        }
        
        result = self.make_request("POST", "/categories/", category_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_category"] = result["data"]
            self.log_result("Create test category", True, "Created test category")
        else:
            self.log_result("Create test category", False, f"Failed: {result['data']}")
            return False
        
        # Create test product
        product_data = {
            "seller_id": self.test_data["farmer_user"]["user_id"],
            "category_id": self.test_data["test_category"]["category_id"],
            "name": f"Test Product {timestamp}",
            "description": f"Test product for comprehensive testing",
            "price": 15.99,
            "quantity_available": 20,
            "unit": "kg",
            "location": "Test Farm",
            "harvest_date": "2024-01-15",
            "expiry_date": "2024-02-15",
            "is_organic": True
        }
        
        result = self.make_request("POST", "/products/", product_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_product"] = result["data"]
            self.log_result("Create test product", True, "Created test product")
        else:
            self.log_result("Create test product", False, f"Failed: {result['data']}")
            return False
        
        return True
    
    def test_orders_api(self):
        """Test Orders API"""
        print("\n=== Testing Orders API ===")
        
        # Create test order
        order_data = {
            "buyer_id": self.test_data["buyer_user"]["user_id"],
            "seller_id": self.test_data["farmer_user"]["user_id"],
            "product_id": self.test_data["test_product"]["product_id"],
            "quantity": 5,
            "unit_price": 15.99,
            "total_amount": 79.95,
            "delivery_address": "123 Test Street, Test City, TC 12345",
            "notes": "Please deliver in the morning"
        }
        
        result = self.make_request("POST", "/orders/", order_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_order"] = result["data"]
            self.log_result("Create order", True, f"Created order: {result['data']['order_id']}")
            
            # Test get order by ID
            order_id = result["data"]["order_id"]
            result = self.make_request("GET", f"/orders/{order_id}")
            self.log_result(
                "Get order by ID",
                result["success"],
                "Retrieved order details" if result["success"] else f"Failed: {result['data']}"
            )
            
            # Test update order
            update_data = {"status": "confirmed", "payment_status": "paid"}
            result = self.make_request("PUT", f"/orders/{order_id}", update_data)
            self.log_result(
                "Update order",
                result["success"],
                "Order updated successfully" if result["success"] else f"Failed: {result['data']}"
            )
        else:
            self.log_result("Create order", False, f"Failed: {result['data']}")
        
        # Test get all orders
        result = self.make_request("GET", "/orders/")
        self.log_result(
            "Get all orders",
            result["success"] and isinstance(result["data"], list),
            f"Retrieved {len(result['data']) if result['success'] else 0} orders"
        )
    
    def test_profiles_api(self):
        """Test Profiles API"""
        print("\n=== Testing Profiles API ===")
        
        # Create profiles for test users
        profiles_data = [
            {
                "user_id": self.test_data["farmer_user"]["user_id"],
                "bio": "Experienced organic farmer with 10 years in sustainable agriculture",
                "address": "123 Farm Road",
                "city": "Farmville",
                "state": "California",
                "country": "USA",
                "postal_code": "90210",
                "date_of_birth": "1985-05-15",
                "gender": "Male",
                "occupation": "Organic Farmer"
            },
            {
                "user_id": self.test_data["buyer_user"]["user_id"],
                "bio": "Health-conscious consumer who loves fresh, local produce",
                "address": "456 City Avenue",
                "city": "Cityville",
                "state": "Texas",
                "country": "USA",
                "postal_code": "78701",
                "date_of_birth": "1990-08-22",
                "gender": "Female",
                "occupation": "Nutritionist"
            }
        ]
        
        for profile_data in profiles_data:
            result = self.make_request("POST", "/profiles/", profile_data)
            user_type = "farmer" if profile_data["user_id"] == self.test_data["farmer_user"]["user_id"] else "buyer"
            if result["success"] and isinstance(result["data"], dict):
                self.test_data[f"{user_type}_profile"] = result["data"]
                self.log_result(f"Create {user_type} profile", True, f"Created {user_type} profile")
            else:
                self.log_result(f"Create {user_type} profile", False, f"Failed: {result['data']}")
        
        # Test get profile by user ID
        if "farmer_profile" in self.test_data:
            user_id = self.test_data["farmer_user"]["user_id"]
            result = self.make_request("GET", f"/profiles/{user_id}")
            self.log_result(
                "Get profile by user ID",
                result["success"],
                "Retrieved profile details" if result["success"] else f"Failed: {result['data']}"
            )
            
            # Test update profile
            update_data = {"bio": "Updated: Experienced organic farmer with 11 years in sustainable agriculture"}
            result = self.make_request("PUT", f"/profiles/{user_id}", update_data)
            self.log_result(
                "Update profile",
                result["success"],
                "Profile updated successfully" if result["success"] else f"Failed: {result['data']}"
            )
    
    def test_conversations_api(self):
        """Test Conversations API"""
        print("\n=== Testing Conversations API ===")
        
        # Create conversation
        conversation_data = {
            "participant_1_id": self.test_data["buyer_user"]["user_id"],
            "participant_2_id": self.test_data["farmer_user"]["user_id"]
        }
        
        result = self.make_request("POST", "/conversations/", conversation_data)
        if result["success"] and isinstance(result["data"], dict):
            self.test_data["test_conversation"] = result["data"]
            self.log_result("Create conversation", True, f"Created conversation: {result['data']['conversation_id']}")
            
            # Test get conversation by ID
            conversation_id = result["data"]["conversation_id"]
            result = self.make_request("GET", f"/conversations/{conversation_id}")
            self.log_result(
                "Get conversation by ID",
                result["success"],
                "Retrieved conversation details" if result["success"] else f"Failed: {result['data']}"
            )
        else:
            self.log_result("Create conversation", False, f"Failed: {result['data']}")
        
        # Test get conversations for user
        if "test_conversation" in self.test_data:
            result = self.make_request("GET", "/conversations/", params={"user_id": self.test_data["buyer_user"]["user_id"]})
            self.log_result(
                "Get user conversations",
                result["success"] and isinstance(result["data"], list),
                f"Retrieved {len(result['data']) if result['success'] else 0} conversations"
            )
    
    def test_messages_api(self):
        """Test Messages API"""
        print("\n=== Testing Messages API ===")
        
        if "test_conversation" not in self.test_data:
            self.log_result("Messages API Setup", False, "Missing test conversation")
            return
        
        # Create test messages
        messages_data = [
            {
                "conversation_id": self.test_data["test_conversation"]["conversation_id"],
                "sender_id": self.test_data["buyer_user"]["user_id"],
                "content": "Hi! I'm interested in your organic products. Are they still available?",
                "message_type": "text"
            },
            {
                "conversation_id": self.test_data["test_conversation"]["conversation_id"],
                "sender_id": self.test_data["farmer_user"]["user_id"],
                "content": "Hello! Yes, we have fresh organic products available. How much do you need?",
                "message_type": "text"
            }
        ]
        
        created_messages = []
        for i, message_data in enumerate(messages_data):
            result = self.make_request("POST", "/messages/", message_data)
            if result["success"] and isinstance(result["data"], dict):
                created_messages.append(result["data"])
                self.log_result(f"Create message {i+1}", True, f"Created message: {result['data']['message_id'][:8]}...")
            else:
                self.log_result(f"Create message {i+1}", False, f"Failed: {result['data']}")
        
        # Test get messages for conversation
        if created_messages:
            result = self.make_request("GET", "/messages/", params={"conversation_id": self.test_data["test_conversation"]["conversation_id"]})
            self.log_result(
                "Get conversation messages",
                result["success"] and isinstance(result["data"], list) and len(result["data"]) >= len(created_messages),
                f"Retrieved {len(result['data']) if result['success'] else 0} messages"
            )
            
            # Test get message by ID
            message_id = created_messages[0]["message_id"]
            result = self.make_request("GET", f"/messages/{message_id}")
            self.log_result(
                "Get message by ID",
                result["success"],
                "Retrieved message details" if result["success"] else f"Failed: {result['data']}"
            )
            
            # Test mark message as read
            update_data = {"is_read": True}
            result = self.make_request("PUT", f"/messages/{message_id}", update_data)
            self.log_result(
                "Mark message as read",
                result["success"],
                "Message marked as read" if result["success"] else f"Failed: {result['data']}"
            )
    
    def test_reviews_api(self):
        """Test Reviews API"""
        print("\n=== Testing Reviews API ===")
        
        if "test_order" not in self.test_data:
            self.log_result("Reviews API Setup", False, "Missing test order")
            return
        
        # Create test reviews
        reviews_data = [
            {
                "reviewer_id": self.test_data["buyer_user"]["user_id"],
                "reviewed_user_id": self.test_data["farmer_user"]["user_id"],
                "product_id": self.test_data["test_product"]["product_id"],
                "order_id": self.test_data["test_order"]["order_id"],
                "rating": 5,
                "comment": "Excellent quality products! Very fresh and tasty. Will definitely order again."
            },
            {
                "reviewer_id": self.test_data["buyer_user"]["user_id"],
                "product_id": self.test_data["test_product"]["product_id"],
                "rating": 4,
                "comment": "Good quality product, delivered on time."
            }
        ]
        
        created_reviews = []
        for i, review_data in enumerate(reviews_data):
            result = self.make_request("POST", "/reviews/", review_data)
            if result["success"] and isinstance(result["data"], dict):
                created_reviews.append(result["data"])
                self.log_result(f"Create review {i+1}", True, f"Created review with {review_data['rating']} stars")
            else:
                self.log_result(f"Create review {i+1}", False, f"Failed: {result['data']}")
        
        # Test get all reviews
        result = self.make_request("GET", "/reviews/")
        self.log_result(
            "Get all reviews",
            result["success"] and isinstance(result["data"], list),
            f"Retrieved {len(result['data']) if result['success'] else 0} reviews"
        )
        
        # Test filter reviews by product
        if created_reviews:
            result = self.make_request("GET", "/reviews/", params={"product_id": self.test_data["test_product"]["product_id"]})
            self.log_result(
                "Filter reviews by product",
                result["success"] and isinstance(result["data"], list),
                f"Retrieved {len(result['data']) if result['success'] else 0} product reviews"
            )
            
            # Test get review statistics
            result = self.make_request("GET", f"/reviews/stats/product/{self.test_data['test_product']['product_id']}")
            self.log_result(
                "Get product review statistics",
                result["success"] and "total_reviews" in result["data"],
                f"Retrieved stats: {result['data']['total_reviews']} reviews, avg {result['data']['average_rating']}" if result["success"] else f"Failed: {result['data']}"
            )
    
    async def test_websocket_connection(self):
        """Test WebSocket functionality"""
        print("\n=== Testing WebSocket Connection ===")
        
        try:
            user_id = self.test_data["farmer_user"]["user_id"]
            ws_url = f"{self.ws_url}/{user_id}"
            
            # Test WebSocket connection
            async with websockets.connect(ws_url, timeout=10) as websocket:
                self.log_result(
                    "WebSocket Connection",
                    True,
                    f"Successfully connected to WebSocket for user {user_id[:8]}..."
                )
                
                # Test ping message
                ping_message = json.dumps({"type": "ping"})
                await websocket.send(ping_message)
                
                # Wait for pong response
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=5)
                    response_data = json.loads(response)
                    
                    self.log_result(
                        "WebSocket Ping/Pong",
                        response_data.get("type") == "pong",
                        f"Received pong response" if response_data.get("type") == "pong" else f"Unexpected response: {response_data}"
                    )
                except asyncio.TimeoutError:
                    self.log_result(
                        "WebSocket Ping/Pong",
                        False,
                        "Timeout waiting for pong response"
                    )
                
        except Exception as e:
            self.log_result(
                "WebSocket Connection",
                False,
                f"WebSocket connection failed: {str(e)}"
            )
    
    def test_user_status_endpoint(self):
        """Test user status endpoint"""
        print("\n=== Testing User Status Endpoint ===")
        
        user_id = self.test_data["farmer_user"]["user_id"]
        result = self.make_request("GET", f"/system/user-status/{user_id}")
        self.log_result(
            "Get user status",
            result["success"] and "is_online" in result["data"],
            f"User online status: {result['data']['is_online']}" if result["success"] else f"Failed: {result['data']}"
        )
    
    def run_all_tests(self):
        """Run all comprehensive tests"""
        print("🚀 Starting Comprehensive Backend Testing")
        print("=" * 60)
        
        start_time = time.time()
        
        # Initialize database
        result = self.make_request("POST", "/init-database")
        self.log_result(
            "Database Initialization",
            result["success"],
            "Database initialized successfully" if result["success"] else f"Failed: {result['data']}"
        )
        
        # Setup test data
        if not self.setup_test_data():
            print("❌ Failed to setup test data. Aborting comprehensive tests.")
            return
        
        # Run comprehensive test suites
        self.test_orders_api()
        self.test_profiles_api()
        self.test_conversations_api()
        self.test_messages_api()
        self.test_reviews_api()
        self.test_user_status_endpoint()
        
        # Run WebSocket tests
        try:
            asyncio.run(self.test_websocket_connection())
        except Exception as e:
            self.log_result("WebSocket Tests", False, f"WebSocket test suite failed: {str(e)}")
        
        # Generate summary
        end_time = time.time()
        duration = end_time - start_time
        
        total_tests = len(self.results)
        passed_tests = sum(1 for result in self.results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("\n" + "=" * 60)
        print("🏁 COMPREHENSIVE TEST SUMMARY")
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
    tester = ComprehensiveBackendTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if summary["failed_tests"] == 0 else 1)