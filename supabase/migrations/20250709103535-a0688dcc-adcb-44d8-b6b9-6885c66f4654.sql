-- Create default admin user
-- First, insert into auth.users (this will trigger the profile creation)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@agrolink.lk',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator", "user_type": "admin"}',
  false,
  'authenticated'
);

-- Update the profile to ensure admin user_type (in case the trigger doesn't work properly)
UPDATE public.profiles 
SET user_type = 'admin', full_name = 'System Administrator'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@agrolink.lk');