from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import Profile, ProfileCreate, ProfileUpdate

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.post("/", response_model=Profile)
async def create_profile(profile: ProfileCreate):
    """Create a new user profile"""
    profile_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO profiles (
                    profile_id, user_id, bio, avatar_url, address, city, state, country,
                    postal_code, date_of_birth, gender, occupation, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                profile_id, profile.user_id, profile.bio, profile.avatar_url, profile.address,
                profile.city, profile.state, profile.country, profile.postal_code,
                profile.date_of_birth, profile.gender, profile.occupation, now, now
            ))
            await db.commit()
            
            # Return the created profile
            cursor = await db.execute("SELECT * FROM profiles WHERE profile_id = ?", (profile_id,))
            row = await cursor.fetchone()
            if row:
                return Profile(
                    profile_id=row[0], user_id=row[1], bio=row[2], avatar_url=row[3],
                    address=row[4], city=row[5], state=row[6], country=row[7],
                    postal_code=row[8], date_of_birth=row[9], gender=row[10],
                    occupation=row[11], created_at=row[12], updated_at=row[13]
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating profile: {str(e)}")

@router.get("/{user_id}", response_model=Profile)
async def get_profile_by_user_id(user_id: str):
    """Get user profile by user ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return Profile(
            profile_id=row[0], user_id=row[1], bio=row[2], avatar_url=row[3],
            address=row[4], city=row[5], state=row[6], country=row[7],
            postal_code=row[8], date_of_birth=row[9], gender=row[10],
            occupation=row[11], created_at=row[12], updated_at=row[13]
        )

@router.get("/profile/{profile_id}", response_model=Profile)
async def get_profile_by_profile_id(profile_id: str):
    """Get profile by profile ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT * FROM profiles WHERE profile_id = ?", (profile_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return Profile(
            profile_id=row[0], user_id=row[1], bio=row[2], avatar_url=row[3],
            address=row[4], city=row[5], state=row[6], country=row[7],
            postal_code=row[8], date_of_birth=row[9], gender=row[10],
            occupation=row[11], created_at=row[12], updated_at=row[13]
        )

@router.put("/{user_id}", response_model=Profile)
async def update_profile(user_id: str, profile_update: ProfileUpdate):
    """Update a user profile"""
    async with await db_manager.get_connection() as db:
        # Check if profile exists
        cursor = await db.execute("SELECT profile_id FROM profiles WHERE user_id = ?", (user_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Build update query
        update_fields = []
        params = []
        
        for field, value in profile_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = ?")
                params.append(value)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_fields.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(user_id)
        
        query = f"UPDATE profiles SET {', '.join(update_fields)} WHERE user_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated profile
            cursor = await db.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
            row = await cursor.fetchone()
            return Profile(
                profile_id=row[0], user_id=row[1], bio=row[2], avatar_url=row[3],
                address=row[4], city=row[5], state=row[6], country=row[7],
                postal_code=row[8], date_of_birth=row[9], gender=row[10],
                occupation=row[11], created_at=row[12], updated_at=row[13]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating profile: {str(e)}")

@router.delete("/{user_id}")
async def delete_profile(user_id: str):
    """Delete a user profile"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT profile_id FROM profiles WHERE user_id = ?", (user_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Profile not found")
        
        await db.execute("DELETE FROM profiles WHERE user_id = ?", (user_id,))
        await db.commit()
        
        return {"message": "Profile deleted successfully"}