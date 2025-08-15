from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from database import db_manager
from models import User, UserCreate, UserUpdate, UserWithProfile, Profile

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=User)
async def create_user(user: UserCreate):
    """Create a new user"""
    user_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO users (user_id, user_type, full_name, email, phone_number, location, created_at, updated_at, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (user_id, user.user_type, user.full_name, user.email, user.phone_number, user.location, now, now, True))
            await db.commit()
            
            # Return the created user
            cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            row = await cursor.fetchone()
            if row:
                return User(
                    user_id=row[0], user_type=row[1], full_name=row[2], email=row[3],
                    phone_number=row[4], location=row[5], created_at=row[6], updated_at=row[7], is_active=bool(row[8])
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating user: {str(e)}")

@router.get("/", response_model=List[User])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_type: Optional[str] = None,
    is_active: Optional[bool] = None
):
    """Get all users with optional filtering"""
    query = "SELECT * FROM users WHERE 1=1"
    params = []
    
    if user_type:
        query += " AND user_type = ?"
        params.append(user_type)
    
    if is_active is not None:
        query += " AND is_active = ?"
        params.append(is_active)
    
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    async with await db_manager.get_connection() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        
        return [
            User(
                user_id=row[0], user_type=row[1], full_name=row[2], email=row[3],
                phone_number=row[4], location=row[5], created_at=row[6], updated_at=row[7], is_active=bool(row[8])
            ) for row in rows
        ]

@router.get("/{user_id}", response_model=UserWithProfile)
async def get_user(user_id: str):
    """Get a specific user by ID with profile"""
    async with await db_manager.get_connection() as db:
        # Get user
        cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
        user_row = await cursor.fetchone()
        
        if not user_row:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get profile
        cursor = await db.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
        profile_row = await cursor.fetchone()
        
        user = User(
            user_id=user_row[0], user_type=user_row[1], full_name=user_row[2], email=user_row[3],
            phone_number=user_row[4], location=user_row[5], created_at=user_row[6], updated_at=user_row[7], is_active=bool(user_row[8])
        )
        
        profile = None
        if profile_row:
            profile = Profile(
                profile_id=profile_row[0], user_id=profile_row[1], bio=profile_row[2],
                avatar_url=profile_row[3], address=profile_row[4], city=profile_row[5],
                state=profile_row[6], country=profile_row[7], postal_code=profile_row[8],
                date_of_birth=profile_row[9], gender=profile_row[10], occupation=profile_row[11],
                created_at=profile_row[12], updated_at=profile_row[13]
            )
        
        return UserWithProfile(**user.dict(), profile=profile)

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user_update: UserUpdate):
    """Update a user"""
    async with await db_manager.get_connection() as db:
        # Check if user exists
        cursor = await db.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        # Build update query
        update_fields = []
        params = []
        
        if user_update.full_name is not None:
            update_fields.append("full_name = ?")
            params.append(user_update.full_name)
        if user_update.email is not None:
            update_fields.append("email = ?")
            params.append(user_update.email)
        if user_update.phone_number is not None:
            update_fields.append("phone_number = ?")
            params.append(user_update.phone_number)
        if user_update.location is not None:
            update_fields.append("location = ?")
            params.append(user_update.location)
        if user_update.is_active is not None:
            update_fields.append("is_active = ?")
            params.append(user_update.is_active)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_fields.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(user_id)
        
        query = f"UPDATE users SET {', '.join(update_fields)} WHERE user_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated user
            cursor = await db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,))
            row = await cursor.fetchone()
            return User(
                user_id=row[0], user_type=row[1], full_name=row[2], email=row[3],
                phone_number=row[4], location=row[5], created_at=row[6], updated_at=row[7], is_active=bool(row[8])
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating user: {str(e)}")

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    """Delete a user (soft delete by setting is_active to False)"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="User not found")
        
        await db.execute("UPDATE users SET is_active = ?, updated_at = ? WHERE user_id = ?", 
                        (False, datetime.utcnow(), user_id))
        await db.commit()
        
        return {"message": "User deleted successfully"}