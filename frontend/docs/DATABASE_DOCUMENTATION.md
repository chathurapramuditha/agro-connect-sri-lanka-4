# AgriMarket Sri Lanka - Database & Backend Documentation

## Overview
This document provides comprehensive information about the database schema, backend architecture, and API implementation for the AgriMarket Sri Lanka platform built with Supabase.

## Database Architecture

### Database Schema Overview
The platform uses PostgreSQL database with the following main tables:

#### 1. Profiles Table
**Purpose**: Stores extended user profile information
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'buyer', 'admin')),
  phone_number TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Links to Supabase auth.users table via user_id
- Supports three user types: farmer, buyer, admin
- Stores additional profile information not available in auth table
- Has verification status for trusted users

#### 2. Product Categories Table
**Purpose**: Defines product categories for the marketplace
```sql
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_sinhala TEXT,
  name_tamil TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Multilingual support (English, Sinhala, Tamil)
- Category images for better UX
- Read-only for regular users (admin-managed)

#### 3. Products Table
**Purpose**: Stores farmer product listings
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id),
  category_id UUID NOT NULL REFERENCES public.product_categories(id),
  name TEXT NOT NULL,
  name_sinhala TEXT,
  name_tamil TEXT,
  description TEXT,
  price_per_kg NUMERIC NOT NULL,
  quantity_available NUMERIC DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  location TEXT NOT NULL,
  harvest_date DATE,
  is_organic BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Multilingual product names
- Flexible pricing and quantity system
- Location-based filtering
- Organic certification tracking
- Multiple product images support
- Availability status management

#### 4. Orders Table
**Purpose**: Manages purchase transactions between buyers and farmers
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Complete order lifecycle management
- Delivery tracking and scheduling
- Order status workflow
- Price and quantity tracking

#### 5. Conversations Table
**Purpose**: Manages chat conversations between users
```sql
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES auth.users(id),
  participant_2_id UUID NOT NULL REFERENCES auth.users(id),
  last_message_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Two-participant chat system
- Direct reference to auth users for security
- Last message tracking for UI optimization

#### 6. Messages Table
**Purpose**: Stores individual chat messages
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  message_type VARCHAR DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- Real-time messaging capability
- Read status tracking
- Message type support (text, image, etc.)
- Direct user-to-user communication

#### 7. Reviews Table
**Purpose**: Stores order reviews and ratings
```sql
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id),
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Key Features**:
- 5-star rating system
- Order-based reviews
- Bidirectional review system (buyers can review farmers and vice versa)

## Security Implementation

### Row Level Security (RLS)
All tables implement comprehensive RLS policies:

#### Profile Security
- **Read**: Public access (users can view other profiles)
- **Insert**: Users can only create their own profile
- **Update**: Users can only update their own profile
- **Delete**: No delete access (data retention)

#### Product Security
- **Read**: Public access (marketplace visibility)
- **Insert/Update/Delete**: Farmers can only manage their own products

#### Order Security
- **Read**: Only order participants (buyer and farmer)
- **Insert**: Buyers can create orders
- **Update**: Both buyer and farmer can update order status
- **Delete**: No delete access (audit trail)

#### Message/Conversation Security
- **Read**: Only conversation participants
- **Insert**: Authenticated users can create messages/conversations
- **Update**: Users can update their own content
- **Delete**: No delete access (message history)

#### Review Security
- **Read**: Public access (trust and transparency)
- **Insert**: Only order participants can create reviews
- **Update/Delete**: No modification (review integrity)

### Authentication
- Supabase Auth handles user authentication
- JWT tokens for API access
- Session management with automatic refresh
- Email verification and password reset

## Database Functions

### Custom Functions
```sql
-- Check if any admin users exist
CREATE FUNCTION public.admin_exists() RETURNS boolean;

-- Check if current user is admin
CREATE FUNCTION public.is_current_user_admin() RETURNS boolean;

-- Auto-update updated_at columns
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger;

-- Handle new user registration
CREATE FUNCTION public.handle_new_user() RETURNS trigger;
```

### Triggers
- **Auto-update timestamps**: Updates `updated_at` on record changes
- **Auto-create profiles**: Creates profile entry when user registers

## Real-time Features

### Supabase Realtime
- **Message notifications**: Instant message delivery
- **Order updates**: Real-time order status changes
- **Product availability**: Live inventory updates

### Implementation
```typescript
// Real-time message subscription
const channel = supabase
  .channel('schema-db-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `receiver_id=eq.${currentUser.id}`
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

## API Patterns

### Query Patterns
```typescript
// Product search with filters
const { data: products } = await supabase
  .from('products')
  .select(`
    *,
    profiles:farmer_id(full_name, location),
    product_categories(name)
  `)
  .eq('is_available', true)
  .ilike('name', `%${searchTerm}%`)
  .order('created_at', { ascending: false });

// Order management
const { data: orders } = await supabase
  .from('orders')
  .select(`
    *,
    buyer:buyer_id(full_name),
    farmer:farmer_id(full_name),
    product:product_id(name, images)
  `)
  .eq('farmer_id', farmerId)
  .order('created_at', { ascending: false });
```

### Data Relationships
- **Products ↔ Farmers**: One-to-many via farmer_id
- **Orders ↔ Users**: Many-to-many via buyer_id and farmer_id
- **Messages ↔ Users**: Many-to-many via sender_id and receiver_id
- **Reviews ↔ Orders**: One-to-one via order_id

## Performance Optimizations

### Indexing Strategy
```sql
-- Core indexes for performance
CREATE INDEX idx_products_farmer_id ON products(farmer_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_location ON products(location);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_farmer_id ON orders(farmer_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
```

### Query Optimization
- Use `select()` to limit returned columns
- Implement pagination for large datasets
- Cache frequently accessed data (categories, locations)
- Use database functions for complex queries

## Backup and Maintenance

### Automated Backups
- Supabase provides automated daily backups
- Point-in-time recovery available
- Cross-region backup replication

### Data Retention
- Messages: Indefinite (chat history)
- Orders: Indefinite (business records)
- Reviews: Indefinite (reputation system)
- User data: Indefinite with GDPR compliance

## Monitoring and Analytics

### Database Monitoring
- Query performance tracking
- Connection pool monitoring
- Storage usage tracking
- Real-time dashboard

### Business Analytics
- User growth metrics
- Transaction volume
- Product performance
- Regional usage patterns

## Development Guidelines

### Best Practices
1. **Always use RLS**: Never disable row-level security
2. **Validate inputs**: Use TypeScript and Zod for type safety
3. **Handle errors**: Implement proper error handling
4. **Optimize queries**: Use proper select statements and joins
5. **Test thoroughly**: Include edge cases and security tests

### Common Patterns
```typescript
// Error handling pattern
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  console.error('Database error:', error);
  throw new Error('Failed to fetch data');
}

// Type-safe queries
const { data: products } = await supabase
  .from('products')
  .select('id, name, price_per_kg')
  .returns<Product[]>();
```

## Migration History
- Initial schema creation
- RLS policy implementation
- Real-time features enablement
- Performance optimizations
- Security enhancements

## Contact and Support
For database-related issues or questions:
- Review Supabase dashboard logs
- Check RLS policies for permission issues
- Monitor real-time connections
- Validate data types and constraints

---

*Last updated: January 2025*
*Database Version: PostgreSQL 15 with Supabase Extensions*