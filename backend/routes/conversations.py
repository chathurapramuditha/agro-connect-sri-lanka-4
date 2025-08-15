from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import Conversation, ConversationCreate, ConversationWithLastMessage

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.post("/", response_model=Conversation)
async def create_conversation(conversation: ConversationCreate):
    """Create a new conversation or get existing one"""
    async with await db_manager.get_connection() as db:
        # Check if conversation already exists between these participants
        cursor = await db.execute("""
            SELECT * FROM conversations 
            WHERE (participant_1_id = ? AND participant_2_id = ?) 
               OR (participant_1_id = ? AND participant_2_id = ?)
        """, (conversation.participant_1_id, conversation.participant_2_id,
              conversation.participant_2_id, conversation.participant_1_id))
        
        existing = await cursor.fetchone()
        if existing:
            return Conversation(
                conversation_id=existing[0], participant_1_id=existing[1], participant_2_id=existing[2],
                last_message=existing[3], last_message_at=existing[4], created_at=existing[5], is_active=bool(existing[6])
            )
        
        # Create new conversation
        conversation_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        try:
            await db.execute("""
                INSERT INTO conversations (conversation_id, participant_1_id, participant_2_id, created_at, is_active)
                VALUES (?, ?, ?, ?, ?)
            """, (conversation_id, conversation.participant_1_id, conversation.participant_2_id, now, True))
            await db.commit()
            
            return Conversation(
                conversation_id=conversation_id,
                participant_1_id=conversation.participant_1_id,
                participant_2_id=conversation.participant_2_id,
                created_at=now,
                is_active=True
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating conversation: {str(e)}")

@router.get("/", response_model=List[ConversationWithLastMessage])
async def get_conversations(
    user_id: str = Query(..., description="User ID to get conversations for"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """Get all conversations for a user"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT c.*, 
                   u1.full_name as participant_1_name,
                   u2.full_name as participant_2_name,
                   COALESCE(unread.count, 0) as unread_count
            FROM conversations c
            LEFT JOIN users u1 ON c.participant_1_id = u1.user_id
            LEFT JOIN users u2 ON c.participant_2_id = u2.user_id
            LEFT JOIN (
                SELECT conversation_id, COUNT(*) as count
                FROM messages 
                WHERE is_read = 0 AND sender_id != ?
                GROUP BY conversation_id
            ) unread ON c.conversation_id = unread.conversation_id
            WHERE (c.participant_1_id = ? OR c.participant_2_id = ?) AND c.is_active = 1
            ORDER BY c.last_message_at DESC NULLS LAST, c.created_at DESC
            LIMIT ? OFFSET ?
        """, (user_id, user_id, user_id, limit, skip))
        
        rows = await cursor.fetchall()
        
        return [
            ConversationWithLastMessage(
                conversation_id=row[0], participant_1_id=row[1], participant_2_id=row[2],
                last_message=row[3], last_message_at=row[4], created_at=row[5], is_active=bool(row[6]),
                participant_1_name=row[7], participant_2_name=row[8], unread_count=row[9] or 0
            ) for row in rows
        ]

@router.get("/{conversation_id}", response_model=ConversationWithLastMessage)
async def get_conversation(conversation_id: str):
    """Get a specific conversation by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT c.*, 
                   u1.full_name as participant_1_name,
                   u2.full_name as participant_2_name
            FROM conversations c
            LEFT JOIN users u1 ON c.participant_1_id = u1.user_id
            LEFT JOIN users u2 ON c.participant_2_id = u2.user_id
            WHERE c.conversation_id = ?
        """, (conversation_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return ConversationWithLastMessage(
            conversation_id=row[0], participant_1_id=row[1], participant_2_id=row[2],
            last_message=row[3], last_message_at=row[4], created_at=row[5], is_active=bool(row[6]),
            participant_1_name=row[7], participant_2_name=row[8], unread_count=0
        )

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation (soft delete)"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT conversation_id FROM conversations WHERE conversation_id = ?", (conversation_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        await db.execute("UPDATE conversations SET is_active = ? WHERE conversation_id = ?", 
                        (False, conversation_id))
        await db.commit()
        
        return {"message": "Conversation deleted successfully"}