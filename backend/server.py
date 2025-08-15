from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# SQLite3 imports
from database import db_manager
from websocket_manager import manager, WebSocketEventTypes
from routes import users, products, orders, conversations, messages, categories, reviews, profiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (keeping existing functionality)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="Agriculture Marketplace API",
    description="A comprehensive API for agricultural marketplace with real-time chat and SQLite3 data storage",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Include SQLite3 route modules
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(conversations.router)
api_router.include_router(messages.router)
api_router.include_router(categories.router)
api_router.include_router(reviews.router)
api_router.include_router(profiles.router)

# MongoDB Models (keeping existing)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# MongoDB routes (keeping existing functionality)
@api_router.get("/")
async def root():
    return {"message": "Agriculture Marketplace API - Now with SQLite3 Support!"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Database initialization endpoint
@api_router.post("/init-database")
async def initialize_database():
    """Initialize SQLite3 database with all tables"""
    try:
        await db_manager.init_database()
        return {"message": "Database initialized successfully"}
    except Exception as e:
        return {"error": f"Failed to initialize database: {str(e)}"}

# WebSocket endpoint for real-time communication
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    
    # Notify others that user is online
    await manager.broadcast_to_all({
        "type": WebSocketEventTypes.USER_ONLINE,
        "user_id": user_id,
        "timestamp": str(datetime.utcnow())
    })
    
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            
            # Parse and handle incoming WebSocket messages
            try:
                message_data = eval(data)  # In production, use json.loads with proper validation
                
                # Handle different message types
                if message_data.get("type") == "ping":
                    await websocket.send_text('{"type": "pong"}')
                elif message_data.get("type") == "join_conversation":
                    conversation_id = message_data.get("conversation_id")
                    if conversation_id:
                        # Add user to conversation for notifications
                        manager.add_to_conversation(conversation_id, [user_id])
                
            except Exception as e:
                logger.error(f"Error processing WebSocket message: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        
        # Notify others that user is offline
        await manager.broadcast_to_all({
            "type": WebSocketEventTypes.USER_OFFLINE,
            "user_id": user_id,
            "timestamp": str(datetime.utcnow())
        })

# System status endpoints
@api_router.get("/system/online-users")
async def get_online_users():
    """Get list of currently online users"""
    return {"online_users": manager.get_online_users()}

@api_router.get("/system/user-status/{user_id}")
async def get_user_status(user_id: str):
    """Check if a specific user is online"""
    return {"user_id": user_id, "is_online": manager.is_user_online(user_id)}

# Analytics endpoints
@api_router.get("/analytics/summary")
async def get_analytics_summary():
    """Get system analytics summary"""
    async with await db_manager.get_connection() as db:
        try:
            # Count totals
            cursor = await db.execute("SELECT COUNT(*) FROM users")
            total_users = (await cursor.fetchone())[0]
            
            cursor = await db.execute("SELECT COUNT(*) FROM products WHERE status = 'active'")
            active_products = (await cursor.fetchone())[0]
            
            cursor = await db.execute("SELECT COUNT(*) FROM orders")
            total_orders = (await cursor.fetchone())[0]
            
            cursor = await db.execute("SELECT COUNT(*) FROM conversations WHERE is_active = 1")
            active_conversations = (await cursor.fetchone())[0]
            
            cursor = await db.execute("SELECT COUNT(*) FROM messages WHERE sent_at >= datetime('now', '-24 hours')")
            messages_24h = (await cursor.fetchone())[0]
            
            return {
                "total_users": total_users,
                "active_products": active_products,
                "total_orders": total_orders,
                "active_conversations": active_conversations,
                "messages_last_24h": messages_24h,
                "online_users": len(manager.get_online_users())
            }
        except Exception as e:
            return {"error": f"Failed to get analytics: {str(e)}"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        await db_manager.init_database()
        logger.info("SQLite3 database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
