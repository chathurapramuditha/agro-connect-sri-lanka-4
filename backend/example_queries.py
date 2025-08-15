"""
SQLite3 Database Schema and Example Queries
===========================================

This file contains comprehensive examples of how to use the SQLite3 database
with sample data insertion and various query patterns.

Database Schema Overview:
- users: Store user information (buyers, farmers, admins)
- profiles: Extended user profile information
- product_categories: Hierarchical product categories
- products: Marketplace products with details
- orders: Purchase orders and transactions
- conversations: Chat conversations between users
- messages: Individual chat messages
- reviews: Product and user reviews
"""

import asyncio
import json
from datetime import datetime, date
from database import db_manager

# Sample data for testing
SAMPLE_CATEGORIES = [
    {"name": "Vegetables", "description": "Fresh vegetables and greens"},
    {"name": "Fruits", "description": "Fresh seasonal fruits"},
    {"name": "Grains", "description": "Rice, wheat, and other grains"},
    {"name": "Dairy", "description": "Milk and dairy products"},
]

SAMPLE_USERS = [
    {
        "user_type": "farmer",
        "full_name": "John Smith",
        "email": "john.farmer@example.com",
        "phone_number": "+1234567890",
        "location": "Iowa, USA"
    },
    {
        "user_type": "buyer",
        "full_name": "Alice Johnson",
        "email": "alice.buyer@example.com",
        "phone_number": "+1234567891",
        "location": "California, USA"
    },
    {
        "user_type": "admin",
        "full_name": "Admin User",
        "email": "admin@example.com",
        "phone_number": "+1234567892",
        "location": "New York, USA"
    }
]

async def insert_sample_data():
    """Insert sample data for testing purposes"""
    async with await db_manager.get_connection() as db:
        try:
            # Insert sample categories
            category_ids = {}
            for i, category in enumerate(SAMPLE_CATEGORIES):
                category_id = f"cat_{i+1}"
                await db.execute("""
                    INSERT OR IGNORE INTO product_categories (category_id, name, description, created_at, is_active)
                    VALUES (?, ?, ?, ?, ?)
                """, (category_id, category["name"], category["description"], datetime.utcnow(), True))
                category_ids[category["name"]] = category_id
            
            # Insert sample users
            user_ids = {}
            for i, user in enumerate(SAMPLE_USERS):
                user_id = f"user_{i+1}"
                await db.execute("""
                    INSERT OR IGNORE INTO users (
                        user_id, user_type, full_name, email, phone_number, location, 
                        created_at, updated_at, is_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id, user["user_type"], user["full_name"], user["email"],
                    user["phone_number"], user["location"], datetime.utcnow(), 
                    datetime.utcnow(), True
                ))
                user_ids[user["user_type"]] = user_id
            
            # Insert sample profiles
            await db.execute("""
                INSERT OR IGNORE INTO profiles (
                    profile_id, user_id, bio, address, city, state, country,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "profile_1", user_ids["farmer"], "Organic farmer with 20 years experience",
                "123 Farm Road", "Des Moines", "Iowa", "USA", datetime.utcnow(), datetime.utcnow()
            ))
            
            # Insert sample products
            sample_products = [
                {
                    "product_id": "prod_1",
                    "seller_id": user_ids["farmer"],
                    "category_id": category_ids["Vegetables"],
                    "name": "Organic Tomatoes",
                    "description": "Fresh organic tomatoes, harvested this morning",
                    "price": 5.99,
                    "quantity_available": 100,
                    "unit": "kg",
                    "location": "Iowa Farm",
                    "harvest_date": date.today(),
                    "is_organic": True
                },
                {
                    "product_id": "prod_2",
                    "seller_id": user_ids["farmer"],
                    "category_id": category_ids["Fruits"],
                    "name": "Apple Orchard Special",
                    "description": "Sweet and crispy apples from our orchard",
                    "price": 3.50,
                    "quantity_available": 200,
                    "unit": "kg",
                    "location": "Iowa Farm",
                    "harvest_date": date.today(),
                    "is_organic": True
                }
            ]
            
            for product in sample_products:
                await db.execute("""
                    INSERT OR IGNORE INTO products (
                        product_id, seller_id, category_id, name, description, price,
                        quantity_available, unit, location, harvest_date, is_organic,
                        status, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    product["product_id"], product["seller_id"], product["category_id"],
                    product["name"], product["description"], product["price"],
                    product["quantity_available"], product["unit"], product["location"],
                    product["harvest_date"], product["is_organic"], "active",
                    datetime.utcnow(), datetime.utcnow()
                ))
            
            # Insert sample order
            await db.execute("""
                INSERT OR IGNORE INTO orders (
                    order_id, buyer_id, seller_id, product_id, quantity, unit_price, total_amount,
                    status, delivery_address, order_date, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "order_1", user_ids["buyer"], user_ids["farmer"], "prod_1",
                5, 5.99, 29.95, "pending", "456 Main St, California, USA",
                datetime.utcnow(), datetime.utcnow(), datetime.utcnow()
            ))
            
            # Insert sample conversation
            await db.execute("""
                INSERT OR IGNORE INTO conversations (
                    conversation_id, participant_1_id, participant_2_id, 
                    created_at, is_active
                ) VALUES (?, ?, ?, ?, ?)
            """, (
                "conv_1", user_ids["buyer"], user_ids["farmer"],
                datetime.utcnow(), True
            ))
            
            # Insert sample messages
            sample_messages = [
                {
                    "message_id": "msg_1",
                    "conversation_id": "conv_1",
                    "sender_id": user_ids["buyer"],
                    "content": "Hi! I'm interested in your organic tomatoes. Are they still available?",
                    "message_type": "text"
                },
                {
                    "message_id": "msg_2",
                    "conversation_id": "conv_1",
                    "sender_id": user_ids["farmer"],
                    "content": "Yes, they are! Just harvested this morning. How many kg do you need?",
                    "message_type": "text"
                }
            ]
            
            for msg in sample_messages:
                await db.execute("""
                    INSERT OR IGNORE INTO messages (
                        message_id, conversation_id, sender_id, content, message_type,
                        is_read, sent_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    msg["message_id"], msg["conversation_id"], msg["sender_id"],
                    msg["content"], msg["message_type"], False, datetime.utcnow()
                ))
            
            # Insert sample review
            await db.execute("""
                INSERT OR IGNORE INTO reviews (
                    review_id, reviewer_id, reviewed_user_id, product_id, rating, comment,
                    created_at, is_verified
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "review_1", user_ids["buyer"], user_ids["farmer"], "prod_1",
                5, "Excellent quality tomatoes! Very fresh and tasty.",
                datetime.utcnow(), True
            ))
            
            await db.commit()
            print("Sample data inserted successfully!")
            
        except Exception as e:
            print(f"Error inserting sample data: {e}")

# Example query functions
async def example_queries():
    """Demonstrate various query patterns"""
    async with await db_manager.get_connection() as db:
        
        print("\n=== EXAMPLE QUERIES ===\n")
        
        # 1. Get all active products with seller information
        print("1. Active products with seller details:")
        cursor = await db.execute("""
            SELECT p.name, p.price, p.quantity_available, u.full_name as seller_name, pc.name as category
            FROM products p
            JOIN users u ON p.seller_id = u.user_id
            JOIN product_categories pc ON p.category_id = pc.category_id
            WHERE p.status = 'active'
            ORDER BY p.created_at DESC
        """)
        
        products = await cursor.fetchall()
        for product in products:
            print(f"  - {product[0]} (${product[1]}) - {product[2]} available - Seller: {product[3]} - Category: {product[4]}")
        
        # 2. Get conversation with message count
        print("\n2. Conversations with message counts:")
        cursor = await db.execute("""
            SELECT c.conversation_id, u1.full_name as participant1, u2.full_name as participant2,
                   COUNT(m.message_id) as message_count
            FROM conversations c
            JOIN users u1 ON c.participant_1_id = u1.user_id
            JOIN users u2 ON c.participant_2_id = u2.user_id
            LEFT JOIN messages m ON c.conversation_id = m.conversation_id
            WHERE c.is_active = 1
            GROUP BY c.conversation_id
        """)
        
        conversations = await cursor.fetchall()
        for conv in conversations:
            print(f"  - {conv[1]} <-> {conv[2]}: {conv[3]} messages")
        
        # 3. Get orders with full details
        print("\n3. Orders with complete information:")
        cursor = await db.execute("""
            SELECT o.order_id, b.full_name as buyer, s.full_name as seller,
                   p.name as product, o.quantity, o.total_amount, o.status
            FROM orders o
            JOIN users b ON o.buyer_id = b.user_id
            JOIN users s ON o.seller_id = s.user_id
            JOIN products p ON o.product_id = p.product_id
            ORDER BY o.created_at DESC
        """)
        
        orders = await cursor.fetchall()
        for order in orders:
            print(f"  - Order {order[0]}: {order[1]} bought {order[4]} of {order[3]} from {order[2]} for ${order[5]} - Status: {order[6]}")
        
        # 4. Get user statistics
        print("\n4. User statistics by type:")
        cursor = await db.execute("""
            SELECT user_type, COUNT(*) as count
            FROM users
            WHERE is_active = 1
            GROUP BY user_type
        """)
        
        stats = await cursor.fetchall()
        for stat in stats:
            print(f"  - {stat[0].capitalize()}s: {stat[1]}")
        
        # 5. Get product reviews with ratings
        print("\n5. Product reviews:")
        cursor = await db.execute("""
            SELECT p.name, r.rating, r.comment, u.full_name as reviewer
            FROM reviews r
            JOIN products p ON r.product_id = p.product_id
            JOIN users u ON r.reviewer_id = u.user_id
            ORDER BY r.created_at DESC
        """)
        
        reviews = await cursor.fetchall()
        for review in reviews:
            print(f"  - {review[0]}: {review[1]}/5 stars by {review[3]} - '{review[2]}'")

# Advanced query examples
ADVANCED_QUERIES = {
    "top_selling_products": """
        SELECT p.name, SUM(o.quantity) as total_sold, COUNT(o.order_id) as order_count
        FROM products p
        JOIN orders o ON p.product_id = o.product_id
        WHERE o.status IN ('delivered', 'shipped')
        GROUP BY p.product_id
        ORDER BY total_sold DESC
        LIMIT 10;
    """,
    
    "farmer_performance": """
        SELECT u.full_name, 
               COUNT(DISTINCT p.product_id) as products_listed,
               COUNT(DISTINCT o.order_id) as orders_received,
               AVG(r.rating) as avg_rating,
               SUM(o.total_amount) as total_revenue
        FROM users u
        LEFT JOIN products p ON u.user_id = p.seller_id
        LEFT JOIN orders o ON p.product_id = o.product_id
        LEFT JOIN reviews r ON u.user_id = r.reviewed_user_id
        WHERE u.user_type = 'farmer'
        GROUP BY u.user_id
        ORDER BY total_revenue DESC;
    """,
    
    "monthly_sales_trend": """
        SELECT strftime('%Y-%m', o.order_date) as month,
               COUNT(*) as order_count,
               SUM(o.total_amount) as total_sales
        FROM orders o
        WHERE o.status != 'cancelled'
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12;
    """,
    
    "active_conversations_today": """
        SELECT COUNT(DISTINCT c.conversation_id) as active_conversations,
               COUNT(m.message_id) as messages_sent
        FROM conversations c
        LEFT JOIN messages m ON c.conversation_id = m.conversation_id
        WHERE m.sent_at >= date('now')
        AND c.is_active = 1;
    """,
    
    "product_category_distribution": """
        SELECT pc.name as category,
               COUNT(p.product_id) as product_count,
               AVG(p.price) as avg_price,
               SUM(p.quantity_available) as total_quantity
        FROM product_categories pc
        LEFT JOIN products p ON pc.category_id = p.category_id
        WHERE p.status = 'active'
        GROUP BY pc.category_id
        ORDER BY product_count DESC;
    """
}

# Data manipulation examples
async def example_data_operations():
    """Examples of INSERT, UPDATE, DELETE operations"""
    async with await db_manager.get_connection() as db:
        
        print("\n=== DATA MANIPULATION EXAMPLES ===\n")
        
        # INSERT example - Add a new product
        product_id = "example_prod_1"
        await db.execute("""
            INSERT INTO products (
                product_id, seller_id, category_id, name, description, price,
                quantity_available, unit, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id, "user_1", "cat_1", "Example Carrots", 
            "Fresh organic carrots", 2.99, 50, "kg", "active",
            datetime.utcnow(), datetime.utcnow()
        ))
        print("✓ Inserted new product: Example Carrots")
        
        # UPDATE example - Update product quantity
        await db.execute("""
            UPDATE products 
            SET quantity_available = ?, updated_at = ?
            WHERE product_id = ?
        """, (45, datetime.utcnow(), product_id))
        print("✓ Updated product quantity")
        
        # SELECT with JOIN example
        cursor = await db.execute("""
            SELECT p.name, p.quantity_available, u.full_name as seller
            FROM products p
            JOIN users u ON p.seller_id = u.user_id
            WHERE p.product_id = ?
        """, (product_id,))
        
        result = await cursor.fetchone()
        if result:
            print(f"✓ Product details: {result[0]} - {result[1]} available - Seller: {result[2]}")
        
        # DELETE example (soft delete by updating status)
        await db.execute("""
            UPDATE products 
            SET status = 'inactive', updated_at = ?
            WHERE product_id = ?
        """, (datetime.utcnow(), product_id))
        print("✓ Soft deleted product (set status to inactive)")
        
        await db.commit()

if __name__ == "__main__":
    async def main():
        # Initialize database
        await db_manager.init_database()
        
        # Insert sample data
        await insert_sample_data()
        
        # Run example queries
        await example_queries()
        
        # Run data manipulation examples
        await example_data_operations()
        
        print("\n=== ADVANCED QUERIES (for reference) ===")
        for query_name, query in ADVANCED_QUERIES.items():
            print(f"\n{query_name.replace('_', ' ').title()}:")
            print(query)
    
    asyncio.run(main())