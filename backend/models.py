from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, date
from enum import Enum
import uuid

# Enums for better type safety
class UserType(str, Enum):
    BUYER = "buyer"
    FARMER = "farmer"
    ADMIN = "admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SOLD_OUT = "sold_out"

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"

# User Models
class UserBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    user_type: UserType

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        from_attributes = True

# Profile Models
class ProfileBase(BaseModel):
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_id: str

class ProfileUpdate(ProfileBase):
    pass

class Profile(ProfileBase):
    profile_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Product Category Models
class ProductCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category_id: Optional[str] = None

class ProductCategoryCreate(ProductCategoryBase):
    pass

class ProductCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ProductCategory(ProductCategoryBase):
    category_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        from_attributes = True

# Product Models
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity_available: int = 0
    unit: str = "kg"
    images: Optional[str] = None  # JSON string of image URLs/base64
    location: Optional[str] = None
    harvest_date: Optional[date] = None
    expiry_date: Optional[date] = None
    is_organic: bool = False

class ProductCreate(ProductBase):
    seller_id: str
    category_id: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity_available: Optional[int] = None
    unit: Optional[str] = None
    images: Optional[str] = None
    location: Optional[str] = None
    harvest_date: Optional[date] = None
    expiry_date: Optional[date] = None
    is_organic: Optional[bool] = None
    status: Optional[ProductStatus] = None

class Product(ProductBase):
    product_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    seller_id: str
    category_id: str
    status: ProductStatus = ProductStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Order Models
class OrderBase(BaseModel):
    quantity: int
    unit_price: float
    total_amount: float
    delivery_address: Optional[str] = None
    delivery_date: Optional[datetime] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    buyer_id: str
    seller_id: str
    product_id: str

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    delivery_address: Optional[str] = None
    delivery_date: Optional[datetime] = None
    notes: Optional[str] = None
    payment_status: Optional[PaymentStatus] = None

class Order(OrderBase):
    order_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    buyer_id: str
    seller_id: str
    product_id: str
    status: OrderStatus = OrderStatus.PENDING
    order_date: datetime = Field(default_factory=datetime.utcnow)
    payment_status: PaymentStatus = PaymentStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Conversation Models
class ConversationBase(BaseModel):
    participant_1_id: str
    participant_2_id: str

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase):
    conversation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Config:
        from_attributes = True

# Message Models
class MessageBase(BaseModel):
    content: str
    message_type: MessageType = MessageType.TEXT

class MessageCreate(MessageBase):
    conversation_id: str
    sender_id: str

class MessageUpdate(BaseModel):
    is_read: bool = True

class Message(MessageBase):
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str
    is_read: bool = False
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Review Models
class ReviewBase(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    reviewer_id: str
    reviewed_user_id: Optional[str] = None
    product_id: Optional[str] = None
    order_id: Optional[str] = None

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None
    is_verified: Optional[bool] = None

class Review(ReviewBase):
    review_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    reviewer_id: str
    reviewed_user_id: Optional[str] = None
    product_id: Optional[str] = None
    order_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False

    class Config:
        from_attributes = True

# Response Models with related data
class UserWithProfile(User):
    profile: Optional[Profile] = None

class ProductWithDetails(Product):
    seller_name: Optional[str] = None
    category_name: Optional[str] = None

class OrderWithDetails(Order):
    buyer_name: Optional[str] = None
    seller_name: Optional[str] = None
    product_name: Optional[str] = None

class ConversationWithLastMessage(Conversation):
    participant_1_name: Optional[str] = None
    participant_2_name: Optional[str] = None
    unread_count: int = 0

# Pagination
class PaginatedResponse(BaseModel):
    items: List[dict]
    total: int
    page: int
    per_page: int
    pages: int