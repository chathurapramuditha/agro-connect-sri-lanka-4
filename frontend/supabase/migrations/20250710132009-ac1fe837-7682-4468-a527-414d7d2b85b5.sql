-- Update the existing admin user with proper password encryption
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now()
WHERE email = 'admin@agrolink.lk';