from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import ProductCategory, ProductCategoryCreate, ProductCategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=ProductCategory)
async def create_category(category: ProductCategoryCreate):
    """Create a new product category"""
    category_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO product_categories (category_id, name, description, parent_category_id, created_at, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (category_id, category.name, category.description, category.parent_category_id, now, True))
            await db.commit()
            
            # Return the created category
            cursor = await db.execute("SELECT * FROM product_categories WHERE category_id = ?", (category_id,))
            row = await cursor.fetchone()
            if row:
                return ProductCategory(
                    category_id=row[0], name=row[1], description=row[2],
                    parent_category_id=row[3], created_at=row[4], is_active=bool(row[5])
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating category: {str(e)}")

@router.get("/", response_model=List[ProductCategory])
async def get_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    parent_category_id: Optional[str] = None,
    is_active: Optional[bool] = None
):
    """Get all product categories with optional filtering"""
    query = "SELECT * FROM product_categories WHERE 1=1"
    params = []
    
    if parent_category_id is not None:
        if parent_category_id == "":
            query += " AND parent_category_id IS NULL"
        else:
            query += " AND parent_category_id = ?"
            params.append(parent_category_id)
    
    if is_active is not None:
        query += " AND is_active = ?"
        params.append(is_active)
    
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    async with await db_manager.get_connection() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        
        return [
            ProductCategory(
                category_id=row[0], name=row[1], description=row[2],
                parent_category_id=row[3], created_at=row[4], is_active=bool(row[5])
            ) for row in rows
        ]

@router.get("/{category_id}", response_model=ProductCategory)
async def get_category(category_id: str):
    """Get a specific category by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT * FROM product_categories WHERE category_id = ?", (category_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Category not found")
        
        return ProductCategory(
            category_id=row[0], name=row[1], description=row[2],
            parent_category_id=row[3], created_at=row[4], is_active=bool(row[5])
        )

@router.put("/{category_id}", response_model=ProductCategory)
async def update_category(category_id: str, category_update: ProductCategoryUpdate):
    """Update a category"""
    async with await db_manager.get_connection() as db:
        # Check if category exists
        cursor = await db.execute("SELECT category_id FROM product_categories WHERE category_id = ?", (category_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Build update query
        update_fields = []
        params = []
        
        for field, value in category_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = ?")
                params.append(value)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        params.append(category_id)
        query = f"UPDATE product_categories SET {', '.join(update_fields)} WHERE category_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated category
            cursor = await db.execute("SELECT * FROM product_categories WHERE category_id = ?", (category_id,))
            row = await cursor.fetchone()
            return ProductCategory(
                category_id=row[0], name=row[1], description=row[2],
                parent_category_id=row[3], created_at=row[4], is_active=bool(row[5])
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating category: {str(e)}")

@router.delete("/{category_id}")
async def delete_category(category_id: str):
    """Delete a category (soft delete)"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT category_id FROM product_categories WHERE category_id = ?", (category_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Category not found")
        
        await db.execute("UPDATE product_categories SET is_active = ? WHERE category_id = ?", 
                        (False, category_id))
        await db.commit()
        
        return {"message": "Category deleted successfully"}