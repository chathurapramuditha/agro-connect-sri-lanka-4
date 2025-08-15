from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import Message, MessageCreate, MessageUpdate

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/", response_model=Message)
async def create_message(message: MessageCreate):
    """Create a new message"""
    message_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            # Insert message
            await db.execute("""
                INSERT INTO messages (message_id, conversation_id, sender_id, content, message_type, is_read, sent_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (message_id, message.conversation_id, message.sender_id, message.content, 
                  message.message_type, False, now))
            
            # Update conversation's last message
            await db.execute("""
                UPDATE conversations 
                SET last_message = ?, last_message_at = ?
                WHERE conversation_id = ?
            """, (message.content[:100] + ('...' if len(message.content) > 100 else ''), now, message.conversation_id))
            
            await db.commit()
            
            return Message(
                message_id=message_id,
                conversation_id=message.conversation_id,
                sender_id=message.sender_id,
                content=message.content,
                message_type=message.message_type,
                is_read=False,
                sent_at=now
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating message: {str(e)}")

@router.get("/", response_model=List[Message])
async def get_messages(
    conversation_id: str = Query(..., description="Conversation ID to get messages for"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """Get all messages in a conversation"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT * FROM messages 
            WHERE conversation_id = ?
            ORDER BY sent_at ASC
            LIMIT ? OFFSET ?
        """, (conversation_id, limit, skip))
        
        rows = await cursor.fetchall()
        
        return [
            Message(
                message_id=row[0], conversation_id=row[1], sender_id=row[2], content=row[3],
                message_type=row[4], is_read=bool(row[5]), sent_at=row[6], read_at=row[7]
            ) for row in rows
        ]

@router.get("/{message_id}", response_model=Message)
async def get_message(message_id: str):
    """Get a specific message by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT * FROM messages WHERE message_id = ?", (message_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return Message(
            message_id=row[0], conversation_id=row[1], sender_id=row[2], content=row[3],
            message_type=row[4], is_read=bool(row[5]), sent_at=row[6], read_at=row[7]
        )

@router.put("/{message_id}", response_model=Message)
async def update_message(message_id: str, message_update: MessageUpdate):
    """Update a message (mainly for marking as read)"""
    async with await db_manager.get_connection() as db:
        # Check if message exists
        cursor = await db.execute("SELECT * FROM messages WHERE message_id = ?", (message_id,))
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Message not found")
        
        try:
            read_at = datetime.utcnow() if message_update.is_read else None
            await db.execute("UPDATE messages SET is_read = ?, read_at = ? WHERE message_id = ?", 
                           (message_update.is_read, read_at, message_id))
            await db.commit()
            
            # Return updated message
            cursor = await db.execute("SELECT * FROM messages WHERE message_id = ?", (message_id,))
            row = await cursor.fetchone()
            return Message(
                message_id=row[0], conversation_id=row[1], sender_id=row[2], content=row[3],
                message_type=row[4], is_read=bool(row[5]), sent_at=row[6], read_at=row[7]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating message: {str(e)}")

@router.put("/conversation/{conversation_id}/mark-read")
async def mark_conversation_messages_read(conversation_id: str, user_id: str = Query(...)):
    """Mark all messages in a conversation as read for a user"""
    async with await db_manager.get_connection() as db:
        now = datetime.utcnow()
        await db.execute("""
            UPDATE messages 
            SET is_read = 1, read_at = ?
            WHERE conversation_id = ? AND sender_id != ? AND is_read = 0
        """, (now, conversation_id, user_id))
        await db.commit()
        
        return {"message": "Messages marked as read"}

@router.delete("/{message_id}")
async def delete_message(message_id: str):
    """Delete a message"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT message_id FROM messages WHERE message_id = ?", (message_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Message not found")
        
        await db.execute("DELETE FROM messages WHERE message_id = ?", (message_id,))
        await db.commit()
        
        return {"message": "Message deleted successfully"}