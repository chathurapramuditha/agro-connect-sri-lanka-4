-- Update the handle_new_user function to extract phone_number and location from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, user_type, phone_number, location, bio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'buyer'),
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'bio'
  );
  RETURN NEW;
END;
$function$;