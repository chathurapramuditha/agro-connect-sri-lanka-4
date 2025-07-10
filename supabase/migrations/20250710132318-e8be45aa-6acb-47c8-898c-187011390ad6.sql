-- Clean up the manually created admin user
DELETE FROM public.profiles WHERE user_id = '81c2696a-3674-4481-bc02-269e554b66a5';
DELETE FROM auth.users WHERE email = 'admin@agrolink.lk';