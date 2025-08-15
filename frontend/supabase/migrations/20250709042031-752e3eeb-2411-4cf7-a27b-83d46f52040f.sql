-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'buyer', 'admin')),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product categories table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_sinhala TEXT,
  name_tamil TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.product_categories(id),
  name TEXT NOT NULL,
  name_sinhala TEXT,
  name_tamil TEXT,
  description TEXT,
  price_per_kg DECIMAL(10,2) NOT NULL,
  quantity_available DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  harvest_date DATE,
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  is_organic BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for product_categories (public read)
CREATE POLICY "Product categories are viewable by everyone" 
ON public.product_categories FOR SELECT 
USING (true);

-- Create RLS policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Farmers can insert their own products" 
ON public.products FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = farmer_id));

CREATE POLICY "Farmers can update their own products" 
ON public.products FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = farmer_id));

CREATE POLICY "Farmers can delete their own products" 
ON public.products FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = farmer_id));

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = buyer_id OR id = farmer_id
));

CREATE POLICY "Buyers can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = buyer_id));

CREATE POLICY "Order participants can update orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE id = buyer_id OR id = farmer_id
));

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for their orders" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = reviewer_id));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some initial product categories
INSERT INTO public.product_categories (name, name_sinhala, name_tamil, description) VALUES
('Rice', 'සහල්', 'அரிசி', 'Various types of rice'),
('Vegetables', 'එළවළු', 'காய்கறிகள்', 'Fresh vegetables'),
('Fruits', 'පලතුරු', 'பழங்கள்', 'Fresh fruits'),
('Spices', 'කුළුබඩු', 'மசாலா', 'Sri Lankan spices'),
('Coconut Products', 'පොල් නිෂ්පාදන', 'தேங்காய் பொருட்கள்', 'Coconut and coconut products'),
('Tea', 'තේ', 'தேநீர்', 'Ceylon tea varieties'),
('Herbs', 'ඖෂධ ශාක', 'மூலிகைகள்', 'Medicinal and cooking herbs');