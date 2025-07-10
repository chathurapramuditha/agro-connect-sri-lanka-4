-- Delete the existing admin user that was created incorrectly
DELETE FROM public.profiles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@agrolink.lk');
DELETE FROM auth.users WHERE email = 'admin@agrolink.lk';

-- Create a proper admin signup function that can be called
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Use Supabase's built-in signup process
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_sent_at,
    recovery_token,
    email_change_sent_at,
    email_change,
    email_change_confirm_status,
    banned_until,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_new,
    email_change_token_current,
    is_sso_user,
    deleted_at,
    is_anonymous
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@agrolink.lk',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    '',
    null,
    '',
    null,
    '',
    0,
    null,
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Administrator", "user_type": "admin"}',
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    '',
    false,
    null,
    false
  ) RETURNING id INTO new_user_id;

  -- Create the profile
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (new_user_id, 'System Administrator', 'admin');
END;
$$;

-- Execute the function to create the admin user
SELECT create_admin_user();