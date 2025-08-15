import aiosqlite
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

# Database configuration
ROOT_DIR = Path(__file__).parent
DATABASE_PATH = ROOT_DIR / "data" / "application.db"

# Ensure data directory exists
DATABASE_PATH.parent.mkdir(exist_ok=True)

class DatabaseManager:
    def __init__(self):
        self.db_path = str(DATABASE_PATH)
    
    async def get_connection(self):
        """Get database connection"""
        return await aiosqlite.connect(self.db_path)
    
    async def init_database(self):
        """Initialize database with all tables"""
        async with aiosqlite.connect(self.db_path) as db:
            # Enable foreign keys
            await db.execute("PRAGMA foreign_keys = ON")
            
            # Users table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    user_id TEXT PRIMARY KEY,
                    user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'farmer', 'admin')),
                    full_name TEXT NOT NULL,
                    email TEXT UNIQUE,
                    phone_number TEXT,
                    location TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1
                )
            """)
            
            # Profiles table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS profiles (
                    profile_id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    bio TEXT,
                    avatar_url TEXT,
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
                )
            """)
            
            # Product categories table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS product_categories (
                    category_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    description TEXT,
                    parent_category_id TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (parent_category_id) REFERENCES product_categories (category_id)
                )
            """)
            
            # Products table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    product_id TEXT PRIMARY KEY,
                    seller_id TEXT NOT NULL,
                    category_id TEXT NOT NULL,
                    name TEXT NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    quantity_available INTEGER DEFAULT 0,
                    unit TEXT DEFAULT 'kg',
                    images TEXT, -- JSON array of image URLs/base64
                    location TEXT,
                    harvest_date DATE,
                    expiry_date DATE,
                    is_organic BOOLEAN DEFAULT 0,
                    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES product_categories (category_id)
                )
            """)
            
            # Orders table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    order_id TEXT PRIMARY KEY,
                    buyer_id TEXT NOT NULL,
                    seller_id TEXT NOT NULL,
                    product_id TEXT NOT NULL,
                    quantity INTEGER NOT NULL,
                    unit_price DECIMAL(10, 2) NOT NULL,
                    total_amount DECIMAL(10, 2) NOT NULL,
                    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
                    delivery_address TEXT,
                    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    delivery_date DATETIME,
                    notes TEXT,
                    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (buyer_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE
                )
            """)
            
            # Conversations table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    conversation_id TEXT PRIMARY KEY,
                    participant_1_id TEXT NOT NULL,
                    participant_2_id TEXT NOT NULL,
                    last_message TEXT,
                    last_message_at DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1,
                    FOREIGN KEY (participant_1_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (participant_2_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    UNIQUE(participant_1_id, participant_2_id)
                )
            """)
            
            # Messages table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    message_id TEXT PRIMARY KEY,
                    conversation_id TEXT NOT NULL,
                    sender_id TEXT NOT NULL,
                    content TEXT NOT NULL,
                    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
                    is_read BOOLEAN DEFAULT 0,
                    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    read_at DATETIME,
                    FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE,
                    FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE
                )
            """)
            
            # Reviews table
            await db.execute("""
                CREATE TABLE IF NOT EXISTS reviews (
                    review_id TEXT PRIMARY KEY,
                    reviewer_id TEXT NOT NULL,
                    reviewed_user_id TEXT,
                    product_id TEXT,
                    order_id TEXT,
                    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                    comment TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_verified BOOLEAN DEFAULT 0,
                    FOREIGN KEY (reviewer_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (reviewed_user_id) REFERENCES users (user_id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE,
                    FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE
                )
            """)
            
            # Create indexes for better performance
            await db.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_users_type ON users (user_type)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_products_seller ON products (seller_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_products_status ON products (status)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders (buyer_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders (seller_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages (sender_id)")
            await db.execute("CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations (participant_1_id, participant_2_id)")
            
            await db.commit()
            logger.info("Database initialized successfully")

# Global database manager instance
db_manager = DatabaseManager()