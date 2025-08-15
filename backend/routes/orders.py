from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime

from ..database import db_manager
from ..models import Order, OrderCreate, OrderUpdate, OrderWithDetails

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=Order)
async def create_order(order: OrderCreate):
    """Create a new order"""
    order_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    async with await db_manager.get_connection() as db:
        try:
            await db.execute("""
                INSERT INTO orders (
                    order_id, buyer_id, seller_id, product_id, quantity, unit_price, total_amount,
                    status, delivery_address, order_date, delivery_date, notes, payment_status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, order.buyer_id, order.seller_id, order.product_id, order.quantity,
                order.unit_price, order.total_amount, 'pending', order.delivery_address,
                now, order.delivery_date, order.notes, 'pending', now, now
            ))
            await db.commit()
            
            # Return the created order
            cursor = await db.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
            row = await cursor.fetchone()
            if row:
                return Order(
                    order_id=row[0], buyer_id=row[1], seller_id=row[2], product_id=row[3],
                    quantity=row[4], unit_price=row[5], total_amount=row[6], status=row[7],
                    delivery_address=row[8], order_date=row[9], delivery_date=row[10],
                    notes=row[11], payment_status=row[12], created_at=row[13], updated_at=row[14]
                )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating order: {str(e)}")

@router.get("/", response_model=List[OrderWithDetails])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    buyer_id: Optional[str] = None,
    seller_id: Optional[str] = None,
    status: Optional[str] = None,
    payment_status: Optional[str] = None
):
    """Get all orders with optional filtering"""
    query = """
        SELECT o.*, 
               b.full_name as buyer_name,
               s.full_name as seller_name,
               p.name as product_name
        FROM orders o
        LEFT JOIN users b ON o.buyer_id = b.user_id
        LEFT JOIN users s ON o.seller_id = s.user_id
        LEFT JOIN products p ON o.product_id = p.product_id
        WHERE 1=1
    """
    params = []
    
    if buyer_id:
        query += " AND o.buyer_id = ?"
        params.append(buyer_id)
    
    if seller_id:
        query += " AND o.seller_id = ?"
        params.append(seller_id)
    
    if status:
        query += " AND o.status = ?"
        params.append(status)
    
    if payment_status:
        query += " AND o.payment_status = ?"
        params.append(payment_status)
    
    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?"
    params.extend([limit, skip])
    
    async with await db_manager.get_connection() as db:
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        
        return [
            OrderWithDetails(
                order_id=row[0], buyer_id=row[1], seller_id=row[2], product_id=row[3],
                quantity=row[4], unit_price=row[5], total_amount=row[6], status=row[7],
                delivery_address=row[8], order_date=row[9], delivery_date=row[10],
                notes=row[11], payment_status=row[12], created_at=row[13], updated_at=row[14],
                buyer_name=row[15], seller_name=row[16], product_name=row[17]
            ) for row in rows
        ]

@router.get("/{order_id}", response_model=OrderWithDetails)
async def get_order(order_id: str):
    """Get a specific order by ID"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("""
            SELECT o.*, 
                   b.full_name as buyer_name,
                   s.full_name as seller_name,
                   p.name as product_name
            FROM orders o
            LEFT JOIN users b ON o.buyer_id = b.user_id
            LEFT JOIN users s ON o.seller_id = s.user_id
            LEFT JOIN products p ON o.product_id = p.product_id
            WHERE o.order_id = ?
        """, (order_id,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return OrderWithDetails(
            order_id=row[0], buyer_id=row[1], seller_id=row[2], product_id=row[3],
            quantity=row[4], unit_price=row[5], total_amount=row[6], status=row[7],
            delivery_address=row[8], order_date=row[9], delivery_date=row[10],
            notes=row[11], payment_status=row[12], created_at=row[13], updated_at=row[14],
            buyer_name=row[15], seller_name=row[16], product_name=row[17]
        )

@router.put("/{order_id}", response_model=Order)
async def update_order(order_id: str, order_update: OrderUpdate):
    """Update an order"""
    async with await db_manager.get_connection() as db:
        # Check if order exists
        cursor = await db.execute("SELECT order_id FROM orders WHERE order_id = ?", (order_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Build update query
        update_fields = []
        params = []
        
        for field, value in order_update.dict(exclude_unset=True).items():
            if value is not None:
                update_fields.append(f"{field} = ?")
                params.append(value)
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        update_fields.append("updated_at = ?")
        params.append(datetime.utcnow())
        params.append(order_id)
        
        query = f"UPDATE orders SET {', '.join(update_fields)} WHERE order_id = ?"
        
        try:
            await db.execute(query, params)
            await db.commit()
            
            # Return updated order
            cursor = await db.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
            row = await cursor.fetchone()
            return Order(
                order_id=row[0], buyer_id=row[1], seller_id=row[2], product_id=row[3],
                quantity=row[4], unit_price=row[5], total_amount=row[6], status=row[7],
                delivery_address=row[8], order_date=row[9], delivery_date=row[10],
                notes=row[11], payment_status=row[12], created_at=row[13], updated_at=row[14]
            )
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating order: {str(e)}")

@router.delete("/{order_id}")
async def delete_order(order_id: str):
    """Cancel an order"""
    async with await db_manager.get_connection() as db:
        cursor = await db.execute("SELECT order_id FROM orders WHERE order_id = ?", (order_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Order not found")
        
        await db.execute("UPDATE orders SET status = ?, updated_at = ? WHERE order_id = ?", 
                        ('cancelled', datetime.utcnow(), order_id))
        await db.commit()
        
        return {"message": "Order cancelled successfully"}