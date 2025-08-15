from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import Product, ProductCreate, ProductUpdate, ProductWithDetails

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=Product)
async def create_product(product: ProductCreate):
    """Create a new product"""
    product_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO products (
                    product_id, seller_id, category_id, name, description, price, quantity_available,
                    unit, images, location, harvest_date, expiry_date, is_organic, status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                product_id, product.seller_id, product.category_id, product.name, product.description,
                product.price, product.quantity_available, product.unit, product.images,
                product.location, product.harvest_date, product.expiry_date, product.is_organic,
                'active', now, now
            ))
            await db.commit()
            
            # Return the created product
            cursor = await db.execute("SELECT * FROM products WHERE product_id = ?", (product_id,))
            row = await cursor.fetchone()
            if row:
                return Product(
                    product_id=row[0], seller_id=row[1], category_id=row[2], name=row[3],
                    description=row[4], price=row[5], quantity_available=row[6], unit=row[7],
                    images=row[8], location=row[9], harvest_date=row[10], expiry_date=row[11],
                    is_organic=bool(row[12]), status=row[13], created_at=row[14], updated_at=row[15]
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating product: {str(e)}")

@router.get("/", response_model=List[ProductWithDetails])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category_id: Optional[str] = None,
    seller_id: Optional[str] = None,
    status: Optional[str] = None,
    is_organic: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    """Get all products with optional filtering"""
    query = """
        SELECT p.*, u.full_name as seller_name, pc.name as category_name
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.user_id
        LEFT JOIN product_categories pc ON p.category_id = pc.category_id
        WHERE 1=1
    """
    params = []
    
    if category_id:
        query += " AND p.category_id = ?"
        params.append(category_id)
    
    if seller_id:
        query += " AND p.seller_id = ?"
        params.append(seller_id)
    
    if status:
        query += " AND p.status = ?"
        params.append(status)
    
    if is_organic is not None:
        query += " AND p.is_organic = ?"
        params.append(is_organic)
    
    if min_price is not None:
        query += " AND p.price >= ?"
        params.append(min_price)
    
    if max_price is not None:
        query += " AND p.price <= ?"
        params.append(max_price)
    
    query += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    async with await db_manager.get_connection() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        
        return [
            ProductWithDetails(
                product_id=row[0], seller_id=row[1], category_id=row[2], name=row[3],
                description=row[4], price=row[5], quantity_available=row[6], unit=row[7],
                images=row[8], location=row[9], harvest_date=row[10], expiry_date=row[11],
                is_organic=bool(row[12]), status=row[13], created_at=row[14], updated_at=row[15],
                seller_name=row[16], category_name=row[17]
            ) for row in rows
        ]

@router.get("/{product_id}", response_model=ProductWithDetails)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT p.*, u.full_name as seller_name, pc.name as category_name
            FROM products p
            LEFT JOIN users u ON p.seller_id = u.user_id
            LEFT JOIN product_categories pc ON p.category_id = pc.category_id
            WHERE p.product_id = ?
        """, (product_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        
        return ProductWithDetails(
            product_id=row[0], seller_id=row[1], category_id=row[2], name=row[3],
            description=row[4], price=row[5], quantity_available=row[6], unit=row[7],
            images=row[8], location=row[9], harvest_date=row[10], expiry_date=row[11],
            is_organic=bool(row[12]), status=row[13], created_at=row[14], updated_at=row[15],
            seller_name=row[16], category_name=row[17]
        )

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    """Update a product"""
    async with await db_manager.get_connection() as db:
        # Check if product exists
        cursor = await db.execute("SELECT product_id FROM products WHERE product_id = ?", (product_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Build update query
        update_fields = []
        params = []
        
        for field, value in product_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = ?")
                params.append(value)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_fields.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(product_id)
        
        query = f"UPDATE products SET {', '.join(update_fields)} WHERE product_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated product
            cursor = await db.execute("SELECT * FROM products WHERE product_id = ?", (product_id,))
            row = await cursor.fetchone()
            return Product(
                product_id=row[0], seller_id=row[1], category_id=row[2], name=row[3],
                description=row[4], price=row[5], quantity_available=row[6], unit=row[7],
                images=row[8], location=row[9], harvest_date=row[10], expiry_date=row[11],
                is_organic=bool(row[12]), status=row[13], created_at=row[14], updated_at=row[15]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating product: {str(e)}")

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product (soft delete by setting status to inactive)"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT product_id FROM products WHERE product_id = ?", (product_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Product not found")
        
        await db.execute("UPDATE products SET status = ?, updated_at = ? WHERE product_id = ?", 
                        ('inactive', datetime.utcnow(), product_id))
        await db.commit()
        
        return {"message": "Product deleted successfully"}