# SQLite3 Database Schema Documentation

## Overview
This document describes the complete SQLite3 database schema for the Agriculture Marketplace application. The database supports a comprehensive e-commerce platform with real-time chat functionality.

## Database Tables

### 1. Users Table
Primary table for all system users (buyers, farmers, admins).

```sql
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,           -- UUID v4
    user_type TEXT NOT NULL,            -- 'buyer', 'farmer', 'admin'
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    CHECK (user_type IN ('buyer', 'farmer', 'admin'))
);
```

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_type` on `user_type`

### 2. Profiles Table
Extended user profile information.

```sql
CREATE TABLE profiles (
    profile_id TEXT PRIMARY KEY,        -- UUID v4
    user_id TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,                    -- Base64 encoded image
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    postal_code TEXT,
    date_of_birth DATE,
    gender TEXT,
    occupation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);
```

### 3. Product Categories Table
Hierarchical product categorization system.

```sql
CREATE TABLE product_categories (
    category_id TEXT PRIMARY KEY,       -- UUID v4
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_category_id TEXT,            -- Self-referencing for hierarchy
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (parent_category_id) REFERENCES product_categories (category_id)
);
```

### 4. Products Table
Core marketplace products with detailed information.

```sql
CREATE TABLE products (
    product_id TEXT PRIMARY KEY,        -- UUID v4
    seller_id TEXT NOT NULL,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity_available INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    images TEXT,                        -- JSON array of base64 images
    location TEXT,
    harvest_date DATE,
    expiry_date DATE,
    is_organic BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'active',       -- 'active', 'inactive', 'sold_out'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES product_categories (category_id),
    CHECK (status IN ('active', 'inactive', 'sold_out'))
);
```

**Indexes:**
- `idx_products_seller` on `seller_id`
- `idx_products_category` on `category_id`
- `idx_products_status` on `status`

### 5. Orders Table
Purchase orders and transaction records.

```sql
CREATE TABLE orders (
    order_id TEXT PRIMARY KEY,          -- UUID v4
    buyer_id TEXT NOT NULL,
    seller_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',      -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
    delivery_address TEXT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATETIME,
    notes TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (buyer_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'))
);
```

**Indexes:**
- `idx_orders_buyer` on `buyer_id`
- `idx_orders_seller` on `seller_id`
- `idx_orders_status` on `status`

### 6. Conversations Table
Chat conversations between users.

```sql
CREATE TABLE conversations (
    conversation_id TEXT PRIMARY KEY,   -- UUID v4
    participant_1_id TEXT NOT NULL,
    participant_2_id TEXT NOT NULL,
    last_message TEXT,
    last_message_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    
    FOREIGN KEY (participant_1_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (participant_2_id) REFERENCES users (user_id) ON DELETE CASCADE,
    UNIQUE(participant_1_id, participant_2_id)
);
```

**Indexes:**
- `idx_conversations_participants` on `(participant_1_id, participant_2_id)`

### 7. Messages Table
Individual chat messages within conversations.

```sql
CREATE TABLE messages (
    message_id TEXT PRIMARY KEY,        -- UUID v4
    conversation_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',   -- 'text', 'image', 'file', 'system'
    is_read BOOLEAN DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    
    FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CHECK (message_type IN ('text', 'image', 'file', 'system'))
);
```

**Indexes:**
- `idx_messages_conversation` on `conversation_id`
- `idx_messages_sender` on `sender_id`

### 8. Reviews Table
Product and user reviews with ratings.

```sql
CREATE TABLE reviews (
    review_id TEXT PRIMARY KEY,         -- UUID v4
    reviewer_id TEXT NOT NULL,
    reviewed_user_id TEXT,              -- Can review users or products
    product_id TEXT,
    order_id TEXT,
    rating INTEGER NOT NULL,            -- 1-5 stars
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT 0,
    
    FOREIGN KEY (reviewer_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
    CHECK (rating >= 1 AND rating <= 5)
);
```

## API Endpoints

### Users API (`/api/users`)
- `POST /` - Create new user
- `GET /` - List users with filtering
- `GET /{user_id}` - Get user with profile
- `PUT /{user_id}` - Update user
- `DELETE /{user_id}` - Soft delete user

### Products API (`/api/products`)
- `POST /` - Create new product
- `GET /` - List products with filtering
- `GET /{product_id}` - Get product details
- `PUT /{product_id}` - Update product
- `DELETE /{product_id}` - Soft delete product

### Orders API (`/api/orders`)
- `POST /` - Create new order
- `GET /` - List orders with filtering
- `GET /{order_id}` - Get order details
- `PUT /{order_id}` - Update order status
- `DELETE /{order_id}` - Cancel order

### Conversations API (`/api/conversations`)
- `POST /` - Create/get conversation
- `GET /` - List user conversations
- `GET /{conversation_id}` - Get conversation details
- `DELETE /{conversation_id}` - Delete conversation

### Messages API (`/api/messages`)
- `POST /` - Send new message
- `GET /` - Get conversation messages
- `PUT /{message_id}` - Mark message as read
- `PUT /conversation/{conversation_id}/mark-read` - Mark all messages read
- `DELETE /{message_id}` - Delete message

### Categories API (`/api/categories`)
- `POST /` - Create category
- `GET /` - List categories
- `GET /{category_id}` - Get category
- `PUT /{category_id}` - Update category
- `DELETE /{category_id}` - Delete category

### Reviews API (`/api/reviews`)
- `POST /` - Create review
- `GET /` - List reviews with filtering
- `GET /{review_id}` - Get review
- `PUT /{review_id}` - Update review
- `GET /stats/product/{product_id}` - Get product review stats
- `DELETE /{review_id}` - Delete review

### Profiles API (`/api/profiles`)
- `POST /` - Create profile
- `GET /{user_id}` - Get profile by user ID
- `PUT /{user_id}` - Update profile
- `DELETE /{user_id}` - Delete profile

## Real-time WebSocket Events

### Connection
- Endpoint: `/ws/{user_id}`
- Handles real-time communication and live updates

### Event Types
- `new_message` - New chat message received
- `message_read` - Message marked as read
- `conversation_updated` - Conversation metadata updated
- `order_created` - New order placed
- `order_updated` - Order status changed
- `product_updated` - Product information updated
- `user_online` - User came online
- `user_offline` - User went offline
- `notification` - System notification

## Data Types and Constraints

### UUIDs
All primary keys use UUID v4 format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Timestamps
- All timestamps stored in UTC
- Format: `YYYY-MM-DD HH:MM:SS.SSS`

### Images
- Stored as base64 encoded strings
- Products can have multiple images stored as JSON array
- Profile avatars stored as single base64 string

### Prices
- Stored as DECIMAL(10, 2) for precise currency handling
- Always in USD (can be extended for multi-currency)

### Status Fields
- Uses string enums with CHECK constraints
- Consistent naming across tables

## Performance Considerations

### Indexing Strategy
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Frequently queried fields have dedicated indexes
- Composite indexes for complex queries

### Query Optimization
- Use prepared statements for security and performance
- Implement pagination for large result sets
- Use LIMIT and OFFSET for data retrieval
- Aggregate queries for statistics and analytics

### Connection Management
- Uses connection pooling via aiosqlite
- Proper connection cleanup and error handling
- Transaction management for data consistency

## Security Features

### Data Validation
- Pydantic models for request/response validation
- SQL injection prevention through parameterized queries
- Input sanitization and type checking

### Foreign Key Constraints
- Referential integrity maintained
- Cascade deletes where appropriate
- Prevents orphaned records

### Soft Deletes
- Users and products use soft deletion (is_active flag)
- Preserves historical data for analytics
- Hard deletes only for messages and reviews

## Sample Queries

### Get Top Selling Products
```sql
SELECT p.name, SUM(o.quantity) as total_sold
FROM products p
JOIN orders o ON p.product_id = o.product_id
WHERE o.status = 'delivered'
GROUP BY p.product_id
ORDER BY total_sold DESC
LIMIT 10;
```

### Get User Conversation History
```sql
SELECT c.conversation_id, u.full_name, c.last_message, c.last_message_at
FROM conversations c
JOIN users u ON (c.participant_1_id = u.user_id OR c.participant_2_id = u.user_id)
WHERE (c.participant_1_id = ? OR c.participant_2_id = ?) 
AND u.user_id != ?
ORDER BY c.last_message_at DESC;
```

### Get Product Reviews Summary
```sql
SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
FROM reviews 
WHERE product_id = ?;
```

## Migration and Maintenance

### Database Initialization
```python
from database import db_manager
await db_manager.init_database()
```

### Sample Data Loading
```python
from example_queries import insert_sample_data
await insert_sample_data()
```

### Backup and Recovery
- SQLite database file located at `/app/backend/data/application.db`
- Regular backups recommended
- Point-in-time recovery available through WAL mode

This schema provides a robust foundation for a comprehensive agriculture marketplace with real-time communication capabilities.