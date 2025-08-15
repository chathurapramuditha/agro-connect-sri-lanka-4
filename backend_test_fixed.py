#!/usr/bin/env python3
"""
Comprehensive Backend Testing for SQLite3 Agriculture Marketplace API
Tests all endpoints, database operations, and WebSocket functionality
"""

import asyncio
import json
import requests
import websockets
import uuid
from datetime import datetime, date
from typing import Dict, List, Any
import time

# Configuration
BASE_URL = "https://sqlite-schema-live.preview.emergentagent.com/api"
WS_URL = "wss://sqlite-schema-live.preview.emergentagent.com/ws"

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.ws_url = WS_URL
        self.test_data = {}
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
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
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> Dict:
        """Make HTTP request to API"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method.upper() == "GET":
                response = requests.get(url, params=params, timeout=30, allow_redirects=True)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, timeout=30, allow_redirects=True)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, timeout=30, allow_redirects=True)
            elif method.upper() == "DELETE":
                response = requests.delete(url, timeout=30, allow_redirects=True)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            try:
                data = response.json() if response.content else {}
            except:
                data = {"raw_response": response.text if hasattr(response, 'text') else str(response.content)}
            
            return {
                "status_code": response.status_code,
                "data": data,
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
        
        # Test database init endpoint
        result = self.make_request("POST", "/init-database")
        self.log_result(
            "Database Initialization",
            result["success"],
            "Database initialized successfully" if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
    
    def test_users_api(self):
        """Test Users API endpoints"""
        print("\n=== Testing Users API ===")
        
        # Create test users
        users_data = [
            {
                "full_name": "John Smith",
                "email": "john.smith@farmmarket.com",
                "phone_number": "+1-555-0101",
                "location": "California, USA",
                "user_type": "farmer"
            },
            {
                "full_name": "Sarah Johnson",
                "email": "sarah.johnson@farmmarket.com", 
                "phone_number": "+1-555-0102",
                "location": "Texas, USA",
                "user_type": "buyer"
            },
            {
                "full_name": "Admin User",
                "email": "admin@farmmarket.com",
                "phone_number": "+1-555-0100",
                "location": "New York, USA",
                "user_type": "admin"
            }
        ]
        
        created_users = []
        for user_data in users_data:
            result = self.make_request("POST", "/users/", user_data)
            if result["success"] and isinstance(result["data"], dict) and "user_id" in result["data"]:
                created_users.append(result["data"])
                self.test_data[f"{user_data['user_type']}_user"] = result["data"]
                self.log_result(
                    f"Create {user_data['user_type']} user",
                    True,
                    f"Created user: {result['data'].get('full_name', 'Unknown')}"
                )
            else:
                self.log_result(
                    f"Create {user_data['user_type']} user",
                    False,
                    f"Failed to create user: {result['data']}",
                    result["data"]
                )
        
        # Test get all users
        result = self.make_request("GET", "/users/")
        self.log_result(
            "Get all users",
            result["success"] and len(result["data"]) >= len(created_users),
            f"Retrieved {len(result['data']) if result['success'] else 0} users",
            result["data"] if not result["success"] else None
        )
        
        # Test get user by ID with profile
        if created_users:
            user_id = created_users[0]["user_id"]
            result = self.make_request("GET", f"/users/{user_id}")
            self.log_result(
                "Get user by ID",
                result["success"],
                f"Retrieved user details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        
        # Test user filtering
        result = self.make_request("GET", "/users/", params={"user_type": "farmer"})
        self.log_result(
            "Filter users by type",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} farmers",
            result["data"] if not result["success"] else None
        )
        
        # Test update user
        if created_users:
            user_id = created_users[0]["user_id"]
            update_data = {"location": "Updated California, USA"}
            result = self.make_request("PUT", f"/users/{user_id}", update_data)
            self.log_result(
                "Update user",
                result["success"],
                "User updated successfully" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
    
    def test_categories_api(self):
        """Test Categories API endpoints"""
        print("\n=== Testing Categories API ===")
        
        # Create main categories
        categories_data = [
            {"name": "Vegetables", "description": "Fresh vegetables and greens"},
            {"name": "Fruits", "description": "Fresh seasonal fruits"},
            {"name": "Grains", "description": "Cereals and grain products"},
            {"name": "Dairy", "description": "Milk and dairy products"}
        ]
        
        created_categories = []
        for category_data in categories_data:
            result = self.make_request("POST", "/categories/", category_data)
            if result["success"]:
                created_categories.append(result["data"])
                self.test_data[f"category_{category_data['name'].lower()}"] = result["data"]
                self.log_result(
                    f"Create category: {category_data['name']}",
                    True,
                    f"Created category: {result['data']['name']}"
                )
            else:
                self.log_result(
                    f"Create category: {category_data['name']}",
                    False,
                    f"Failed: {result['data']}",
                    result["data"]
                )
        
        # Test get all categories
        result = self.make_request("GET", "/categories/")
        self.log_result(
            "Get all categories",
            result["success"] and len(result["data"]) >= len(created_categories),
            f"Retrieved {len(result['data']) if result['success'] else 0} categories",
            result["data"] if not result["success"] else None
        )
        
        # Test get category by ID
        if created_categories:
            category_id = created_categories[0]["category_id"]
            result = self.make_request("GET", f"/categories/{category_id}")
            self.log_result(
                "Get category by ID",
                result["success"],
                "Retrieved category details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
    
    def test_products_api(self):
        """Test Products API endpoints"""
        print("\n=== Testing Products API ===")
        
        farmer_user = self.test_data.get("farmer_user")
        vegetables_category = self.test_data.get("category_vegetables")
        
        if not farmer_user or not vegetables_category:
            self.log_result("Products API Setup", False, "Missing farmer user or vegetables category")
            return
        
        # Create test products
        products_data = [
            {
                "seller_id": farmer_user["user_id"],
                "category_id": vegetables_category["category_id"],
                "name": "Organic Tomatoes",
                "description": "Fresh organic tomatoes from local farm",
                "price": 4.99,
                "quantity_available": 50,
                "unit": "lb",
                "location": "California Farm",
                "harvest_date": "2024-01-15",
                "expiry_date": "2024-01-25",
                "is_organic": True
            },
            {
                "seller_id": farmer_user["user_id"],
                "category_id": vegetables_category["category_id"],
                "name": "Fresh Carrots",
                "description": "Crunchy orange carrots",
                "price": 2.99,
                "quantity_available": 30,
                "unit": "lb",
                "location": "California Farm",
                "harvest_date": "2024-01-10",
                "expiry_date": "2024-02-10",
                "is_organic": False
            }
        ]
        
        created_products = []
        for product_data in products_data:
            result = self.make_request("POST", "/products/", product_data)
            if result["success"]:
                created_products.append(result["data"])
                self.test_data[f"product_{product_data['name'].lower().replace(' ', '_')}"] = result["data"]
                self.log_result(
                    f"Create product: {product_data['name']}",
                    True,
                    f"Created product: {result['data']['name']}"
                )
            else:
                self.log_result(
                    f"Create product: {product_data['name']}",
                    False,
                    f"Failed: {result['data']}",
                    result["data"]
                )
        
        # Test get all products
        result = self.make_request("GET", "/products/")
        self.log_result(
            "Get all products",
            result["success"] and len(result["data"]) >= len(created_products),
            f"Retrieved {len(result['data']) if result['success'] else 0} products",
            result["data"] if not result["success"] else None
        )
        
        # Test product filtering
        result = self.make_request("GET", "/products/", params={"is_organic": True})
        self.log_result(
            "Filter organic products",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} organic products",
            result["data"] if not result["success"] else None
        )
        
        # Test get product by ID
        if created_products:
            product_id = created_products[0]["product_id"]
            result = self.make_request("GET", f"/products/{product_id}")
            self.log_result(
                "Get product by ID",
                result["success"],
                "Retrieved product details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
    
    def test_orders_api(self):
        """Test Orders API endpoints"""
        print("\n=== Testing Orders API ===")
        
        buyer_user = self.test_data.get("buyer_user")
        farmer_user = self.test_data.get("farmer_user")
        product = self.test_data.get("product_organic_tomatoes")
        
        if not all([buyer_user, farmer_user, product]):
            self.log_result("Orders API Setup", False, "Missing required test data")
            return
        
        # Create test order
        order_data = {
            "buyer_id": buyer_user["user_id"],
            "seller_id": farmer_user["user_id"],
            "product_id": product["product_id"],
            "quantity": 5,
            "unit_price": 4.99,
            "total_amount": 24.95,
            "delivery_address": "123 Main St, Austin, TX 78701",
            "notes": "Please deliver in the morning"
        }
        
        result = self.make_request("POST", "/orders/", order_data)
        if result["success"]:
            order = result["data"]
            self.test_data["order_1"] = order
            self.log_result(
                "Create order",
                True,
                f"Created order: {order['order_id'][:8]}..."
            )
            
            # Test get order by ID
            result = self.make_request("GET", f"/orders/{order['order_id']}")
            self.log_result(
                "Get order by ID",
                result["success"],
                "Retrieved order details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
            
            # Test update order status
            update_data = {"status": "confirmed", "payment_status": "paid"}
            result = self.make_request("PUT", f"/orders/{order['order_id']}", update_data)
            self.log_result(
                "Update order status",
                result["success"],
                "Order updated successfully" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create order",
                False,
                f"Failed: {result['data']}",
                result["data"]
            )
        
        # Test get all orders
        result = self.make_request("GET", "/orders/")
        self.log_result(
            "Get all orders",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} orders",
            result["data"] if not result["success"] else None
        )
    
    def test_conversations_api(self):
        """Test Conversations API endpoints"""
        print("\n=== Testing Conversations API ===")
        
        buyer_user = self.test_data.get("buyer_user")
        farmer_user = self.test_data.get("farmer_user")
        
        if not all([buyer_user, farmer_user]):
            self.log_result("Conversations API Setup", False, "Missing required users")
            return
        
        # Create conversation
        conversation_data = {
            "participant_1_id": buyer_user["user_id"],
            "participant_2_id": farmer_user["user_id"]
        }
        
        result = self.make_request("POST", "/conversations/", conversation_data)
        if result["success"]:
            conversation = result["data"]
            self.test_data["conversation"] = conversation
            self.log_result(
                "Create conversation",
                True,
                f"Created conversation: {conversation['conversation_id'][:8]}..."
            )
            
            # Test get conversation by ID
            result = self.make_request("GET", f"/conversations/{conversation['conversation_id']}")
            self.log_result(
                "Get conversation by ID",
                result["success"],
                "Retrieved conversation details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create conversation",
                False,
                f"Failed: {result['data']}",
                result["data"]
            )
        
        # Test get conversations for user
        result = self.make_request("GET", "/conversations/", params={"user_id": buyer_user["user_id"]})
        self.log_result(
            "Get user conversations",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} conversations",
            result["data"] if not result["success"] else None
        )
    
    def test_messages_api(self):
        """Test Messages API endpoints"""
        print("\n=== Testing Messages API ===")
        
        conversation = self.test_data.get("conversation")
        buyer_user = self.test_data.get("buyer_user")
        farmer_user = self.test_data.get("farmer_user")
        
        if not all([conversation, buyer_user, farmer_user]):
            self.log_result("Messages API Setup", False, "Missing required conversation or users")
            return
        
        # Create test message
        message_data = {
            "conversation_id": conversation["conversation_id"],
            "sender_id": buyer_user["user_id"],
            "content": "Hi! I'm interested in your organic tomatoes. Are they still available?",
            "message_type": "text"
        }
        
        result = self.make_request("POST", "/messages/", message_data)
        if result["success"]:
            message = result["data"]
            self.test_data["message_1"] = message
            self.log_result(
                "Create message",
                True,
                f"Created message: {message['message_id'][:8]}..."
            )
            
            # Test get message by ID
            result = self.make_request("GET", f"/messages/{message['message_id']}")
            self.log_result(
                "Get message by ID",
                result["success"],
                "Retrieved message details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
            
            # Test mark message as read
            update_data = {"is_read": True}
            result = self.make_request("PUT", f"/messages/{message['message_id']}", update_data)
            self.log_result(
                "Mark message as read",
                result["success"],
                "Message marked as read" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create message",
                False,
                f"Failed: {result['data']}",
                result["data"]
            )
        
        # Test get messages for conversation
        result = self.make_request("GET", "/messages/", params={"conversation_id": conversation["conversation_id"]})
        self.log_result(
            "Get conversation messages",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} messages",
            result["data"] if not result["success"] else None
        )
    
    def test_profiles_api(self):
        """Test Profiles API endpoints"""
        print("\n=== Testing Profiles API ===")
        
        farmer_user = self.test_data.get("farmer_user")
        
        if not farmer_user:
            self.log_result("Profiles API Setup", False, "Missing required users")
            return
        
        # Create profile
        profile_data = {
            "user_id": farmer_user["user_id"],
            "bio": "Organic farmer with 15 years of experience growing fresh vegetables",
            "address": "123 Farm Road",
            "city": "Fresno",
            "state": "California",
            "country": "USA",
            "postal_code": "93701",
            "date_of_birth": "1980-05-15",
            "gender": "Male",
            "occupation": "Organic Farmer"
        }
        
        result = self.make_request("POST", "/profiles/", profile_data)
        if result["success"]:
            profile = result["data"]
            self.test_data["profile_farmer"] = profile
            self.log_result(
                "Create farmer profile",
                True,
                "Created profile for farmer"
            )
            
            # Test get profile by user ID
            result = self.make_request("GET", f"/profiles/{farmer_user['user_id']}")
            self.log_result(
                "Get profile by user ID",
                result["success"],
                "Retrieved profile details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
            
            # Test update profile
            update_data = {"bio": "Updated: Organic farmer with 16 years of experience"}
            result = self.make_request("PUT", f"/profiles/{farmer_user['user_id']}", update_data)
            self.log_result(
                "Update profile",
                result["success"],
                "Profile updated successfully" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create farmer profile",
                False,
                f"Failed: {result['data']}",
                result["data"]
            )
    
    def test_reviews_api(self):
        """Test Reviews API endpoints"""
        print("\n=== Testing Reviews API ===")
        
        buyer_user = self.test_data.get("buyer_user")
        farmer_user = self.test_data.get("farmer_user")
        product = self.test_data.get("product_organic_tomatoes")
        order = self.test_data.get("order_1")
        
        if not all([buyer_user, farmer_user, product]):
            self.log_result("Reviews API Setup", False, "Missing required test data")
            return
        
        # Create test review
        review_data = {
            "reviewer_id": buyer_user["user_id"],
            "reviewed_user_id": farmer_user["user_id"],
            "product_id": product["product_id"],
            "order_id": order["order_id"] if order else None,
            "rating": 5,
            "comment": "Excellent quality tomatoes! Very fresh and tasty. Will definitely order again."
        }
        
        result = self.make_request("POST", "/reviews/", review_data)
        if result["success"]:
            review = result["data"]
            self.test_data["review_1"] = review
            self.log_result(
                "Create review",
                True,
                f"Created review with {review_data['rating']} stars"
            )
            
            # Test get review by ID
            result = self.make_request("GET", f"/reviews/{review['review_id']}")
            self.log_result(
                "Get review by ID",
                result["success"],
                "Retrieved review details" if result["success"] else f"Failed: {result['data']}",
                result["data"] if not result["success"] else None
            )
        else:
            self.log_result(
                "Create review",
                False,
                f"Failed: {result['data']}",
                result["data"]
            )
        
        # Test get all reviews
        result = self.make_request("GET", "/reviews/")
        self.log_result(
            "Get all reviews",
            result["success"],
            f"Retrieved {len(result['data']) if result['success'] else 0} reviews",
            result["data"] if not result["success"] else None
        )
        
        # Test get product review statistics
        result = self.make_request("GET", f"/reviews/stats/product/{product['product_id']}")
        self.log_result(
            "Get product review statistics",
            result["success"] and "total_reviews" in result["data"],
            f"Retrieved stats: {result['data']['total_reviews']} reviews, avg {result['data']['average_rating']}" if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
    
    def test_analytics_api(self):
        """Test Analytics API endpoints"""
        print("\n=== Testing Analytics API ===")
        
        # Test analytics summary
        result = self.make_request("GET", "/analytics/summary")
        expected_keys = ["total_users", "active_products", "total_orders", "active_conversations", "messages_last_24h", "online_users"]
        
        success = result["success"] and all(key in result["data"] for key in expected_keys)
        self.log_result(
            "Get analytics summary",
            success,
            f"Retrieved analytics: {result['data']}" if success else f"Failed: {result['data']}",
            result["data"] if not success else None
        )
    
    def test_system_endpoints(self):
        """Test System endpoints"""
        print("\n=== Testing System Endpoints ===")
        
        # Test root endpoint
        result = self.make_request("GET", "/")
        self.log_result(
            "Root endpoint",
            result["success"] and "message" in result["data"],
            result["data"].get("message", "No message") if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
        
        # Test online users endpoint
        result = self.make_request("GET", "/system/online-users")
        self.log_result(
            "Get online users",
            result["success"] and "online_users" in result["data"],
            f"Online users: {len(result['data']['online_users'])}" if result["success"] else f"Failed: {result['data']}",
            result["data"] if not result["success"] else None
        )
    
    async def test_websocket_connection(self):
        """Test WebSocket functionality"""
        print("\n=== Testing WebSocket Connection ===")
        
        farmer_user = self.test_data.get("farmer_user")
        if not farmer_user:
            self.log_result("WebSocket Setup", False, "Missing farmer user for WebSocket test")
            return
        
        try:
            user_id = farmer_user["user_id"]
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
                        f"Received pong response" if response_data.get("type") == "pong" else f"Unexpected response: {response_data}",
                        response_data if response_data.get("type") != "pong" else None
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
                f"WebSocket connection failed: {str(e)}",
                str(e)
            )
    
    def test_data_relationships(self):
        """Test data relationships and foreign key constraints"""
        print("\n=== Testing Data Relationships ===")
        
        # Test user-profile relationship
        farmer_user = self.test_data.get("farmer_user")
        if farmer_user:
            result = self.make_request("GET", f"/users/{farmer_user['user_id']}")
            has_profile = result["success"] and result["data"].get("profile") is not None
            self.log_result(
                "User-Profile Relationship",
                has_profile,
                "User has associated profile" if has_profile else "User profile relationship not found",
                result["data"] if not has_profile else None
            )
        
        # Test product-category relationship
        product = self.test_data.get("product_organic_tomatoes")
        if product:
            result = self.make_request("GET", f"/products/{product['product_id']}")
            has_category = result["success"] and result["data"].get("category_name") is not None
            self.log_result(
                "Product-Category Relationship",
                has_category,
                f"Product has category: {result['data'].get('category_name')}" if has_category else "Product category relationship not found",
                result["data"] if not has_category else None
            )
        
        # Test order relationships
        order = self.test_data.get("order_1")
        if order:
            result = self.make_request("GET", f"/orders/{order['order_id']}")
            has_relationships = (result["success"] and 
                               result["data"].get("buyer_name") and 
                               result["data"].get("seller_name") and 
                               result["data"].get("product_name"))
            self.log_result(
                "Order Relationships",
                has_relationships,
                f"Order has all relationships: buyer, seller, product" if has_relationships else "Order relationships incomplete",
                result["data"] if not has_relationships else None
            )
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Comprehensive Backend Testing")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run all test suites
        self.test_database_initialization()
        self.test_users_api()
        self.test_categories_api()
        self.test_products_api()
        self.test_orders_api()
        self.test_conversations_api()
        self.test_messages_api()
        self.test_profiles_api()
        self.test_reviews_api()
        self.test_analytics_api()
        self.test_system_endpoints()
        self.test_data_relationships()
        
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
    tester = BackendTester()
    summary = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if summary["failed_tests"] == 0 else 1)