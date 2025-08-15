from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from database import db_manager
from models import Review, ReviewCreate, ReviewUpdate

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=Review)
async def create_review(review: ReviewCreate):
    """Create a new review"""
    review_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO reviews (
                    review_id, reviewer_id, reviewed_user_id, product_id, order_id, 
                    rating, comment, created_at, is_verified
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                review_id, review.reviewer_id, review.reviewed_user_id, review.product_id,
                review.order_id, review.rating, review.comment, now, False
            ))
            await db.commit()
            
            # Return the created review
            cursor = await db.execute("SELECT * FROM reviews WHERE review_id = ?", (review_id,))
            row = await cursor.fetchone()
            if row:
                return Review(
                    review_id=row[0], reviewer_id=row[1], reviewed_user_id=row[2],
                    product_id=row[3], order_id=row[4], rating=row[5],
                    comment=row[6], created_at=row[7], is_verified=bool(row[8])
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating review: {str(e)}")

@router.get("/", response_model=List[Review])
async def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    reviewer_id: Optional[str] = None,
    reviewed_user_id: Optional[str] = None,
    product_id: Optional[str] = None,
    order_id: Optional[str] = None,
    min_rating: Optional[int] = Query(None, ge=1, le=5),
    max_rating: Optional[int] = Query(None, ge=1, le=5),
    is_verified: Optional[bool] = None
):
    """Get all reviews with optional filtering"""
    query = "SELECT * FROM reviews WHERE 1=1"
    params = []
    
    if reviewer_id:
        query += " AND reviewer_id = ?"
        params.append(reviewer_id)
    
    if reviewed_user_id:
        query += " AND reviewed_user_id = ?"
        params.append(reviewed_user_id)
    
    if product_id:
        query += " AND product_id = ?"
        params.append(product_id)
    
    if order_id:
        query += " AND order_id = ?"
        params.append(order_id)
    
    if min_rating is not None:
        query += " AND rating >= ?"
        params.append(min_rating)
    
    if max_rating is not None:
        query += " AND rating <= ?"
        params.append(max_rating)
    
    if is_verified is not None:
        query += " AND is_verified = ?"
        params.append(is_verified)
    
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    async with await db_manager.get_connection() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        
        return [
            Review(
                review_id=row[0], reviewer_id=row[1], reviewed_user_id=row[2],
                product_id=row[3], order_id=row[4], rating=row[5],
                comment=row[6], created_at=row[7], is_verified=bool(row[8])
            ) for row in rows
        ]

@router.get("/{review_id}", response_model=Review)
async def get_review(review_id: str):
    """Get a specific review by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT * FROM reviews WHERE review_id = ?", (review_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Review not found")
        
        return Review(
            review_id=row[0], reviewer_id=row[1], reviewed_user_id=row[2],
            product_id=row[3], order_id=row[4], rating=row[5],
            comment=row[6], created_at=row[7], is_verified=bool(row[8])
        )

@router.put("/{review_id}", response_model=Review)
async def update_review(review_id: str, review_update: ReviewUpdate):
    """Update a review"""
    async with await db_manager.get_connection() as db:
        # Check if review exists
        cursor = await db.execute("SELECT review_id FROM reviews WHERE review_id = ?", (review_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Build update query
        update_fields = []
        params = []
        
        for field, value in review_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = ?")
                params.append(value)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        params.append(review_id)
        query = f"UPDATE reviews SET {', '.join(update_fields)} WHERE review_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated review
            cursor = await db.execute("SELECT * FROM reviews WHERE review_id = ?", (review_id,))
            row = await cursor.fetchone()
            return Review(
                review_id=row[0], reviewer_id=row[1], reviewed_user_id=row[2],
                product_id=row[3], order_id=row[4], rating=row[5],
                comment=row[6], created_at=row[7], is_verified=bool(row[8])
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating review: {str(e)}")

@router.delete("/{review_id}")
async def delete_review(review_id: str):
    """Delete a review"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT review_id FROM reviews WHERE review_id = ?", (review_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Review not found")
        
        await db.execute("DELETE FROM reviews WHERE review_id = ?", (review_id,))
        await db.commit()
        
        return {"message": "Review deleted successfully"}

@router.get("/stats/product/{product_id}")
async def get_product_review_stats(product_id: str):
    """Get review statistics for a product"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT 
                COUNT(*) as total_reviews,
                AVG(rating) as average_rating,
                COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
                COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
                COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
                COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
                COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
            FROM reviews 
            WHERE product_id = ?
        """, (product_id,))
        row = await cursor.fetchone()
        
        if not row or row[0] == 0:
            return {
                "total_reviews": 0,
                "average_rating": 0,
                "five_star": 0,
                "four_star": 0,
                "three_star": 0,
                "two_star": 0,
                "one_star": 0
            }
        
        return {
            "total_reviews": row[0],
            "average_rating": round(row[1], 2) if row[1] else 0,
            "five_star": row[2],
            "four_star": row[3],
            "three_star": row[4],
            "two_star": row[5],
            "one_star": row[6]
        }