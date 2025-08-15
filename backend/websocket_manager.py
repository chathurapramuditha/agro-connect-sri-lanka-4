import json
import logging
from typing import Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect
import asyncio

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Store conversation participants
        self.conversation_participants: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect a user's websocket"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        
        self.active_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected via WebSocket")
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Disconnect a user's websocket"""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"User {user_id} disconnected from WebSocket")
    
    async def send_personal_message(self, message: dict, user_id: str):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            disconnected_websockets = set()
            for websocket in self.active_connections[user_id]:
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception:
                    disconnected_websockets.add(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected_websockets:
                self.active_connections[user_id].discard(ws)
            
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_to_conversation(self, message: dict, conversation_id: str, sender_id: str = None):
        """Send a message to all participants in a conversation"""
        if conversation_id in self.conversation_participants:
            for participant_id in self.conversation_participants[conversation_id]:
                if sender_id and participant_id == sender_id:
                    continue  # Don't send to sender
                await self.send_personal_message(message, participant_id)
    
    async def broadcast_to_all(self, message: dict):
        """Broadcast a message to all connected users"""
        disconnected_users = set()
        for user_id, websockets in self.active_connections.items():
            disconnected_websockets = set()
            for websocket in websockets:
                try:
                    await websocket.send_text(json.dumps(message))
                except Exception:
                    disconnected_websockets.add(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected_websockets:
                websockets.discard(ws)
            
            if not websockets:
                disconnected_users.add(user_id)
        
        # Remove users with no active connections
        for user_id in disconnected_users:
            del self.active_connections[user_id]
    
    def add_to_conversation(self, conversation_id: str, user_ids: List[str]):
        """Add users to a conversation for notifications"""
        if conversation_id not in self.conversation_participants:
            self.conversation_participants[conversation_id] = set()
        
        for user_id in user_ids:
            self.conversation_participants[conversation_id].add(user_id)
    
    def remove_from_conversation(self, conversation_id: str, user_id: str = None):
        """Remove a user from conversation or remove the entire conversation"""
        if conversation_id in self.conversation_participants:
            if user_id:
                self.conversation_participants[conversation_id].discard(user_id)
            else:
                del self.conversation_participants[conversation_id]
    
    def get_online_users(self) -> List[str]:
        """Get list of currently online users"""
        return list(self.active_connections.keys())
    
    def is_user_online(self, user_id: str) -> bool:
        """Check if a user is currently online"""
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0

# Global connection manager instance
manager = ConnectionManager()

class WebSocketEventTypes:
    # Message events
    NEW_MESSAGE = "new_message"
    MESSAGE_READ = "message_read"
    CONVERSATION_UPDATED = "conversation_updated"
    
    # Order events
    ORDER_CREATED = "order_created"
    ORDER_UPDATED = "order_updated"
    ORDER_STATUS_CHANGED = "order_status_changed"
    
    # Product events
    PRODUCT_CREATED = "product_created"
    PRODUCT_UPDATED = "product_updated"
    PRODUCT_SOLD_OUT = "product_sold_out"
    
    # User events
    USER_ONLINE = "user_online"
    USER_OFFLINE = "user_offline"
    
    # System events
    NOTIFICATION = "notification"
    SYSTEM_UPDATE = "system_update"

async def notify_new_message(conversation_id: str, message_data: dict, sender_id: str):
    """Notify participants about a new message"""
    event = {
        "type": WebSocketEventTypes.NEW_MESSAGE,
        "conversation_id": conversation_id,
        "message": message_data,
        "timestamp": message_data.get("sent_at")
    }
    await manager.send_to_conversation(event, conversation_id, sender_id)

async def notify_order_update(order_data: dict, user_ids: List[str]):
    """Notify users about order updates"""
    event = {
        "type": WebSocketEventTypes.ORDER_UPDATED,
        "order": order_data,
        "timestamp": order_data.get("updated_at")
    }
    for user_id in user_ids:
        await manager.send_personal_message(event, user_id)

async def notify_product_update(product_data: dict, interested_users: List[str] = None):
    """Notify about product updates"""
    event = {
        "type": WebSocketEventTypes.PRODUCT_UPDATED,
        "product": product_data,
        "timestamp": product_data.get("updated_at")
    }
    
    if interested_users:
        for user_id in interested_users:
            await manager.send_personal_message(event, user_id)
    else:
        await manager.broadcast_to_all(event)

async def send_notification(user_id: str, title: str, message: str, data: dict = None):
    """Send a notification to a specific user"""
    event = {
        "type": WebSocketEventTypes.NOTIFICATION,
        "title": title,
        "message": message,
        "data": data or {},
        "timestamp": str(asyncio.get_event_loop().time())
    }
    await manager.send_personal_message(event, user_id)